<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOnboardingOptions } from './composables/useOnboardingOptions'
import { useProfile } from '@/shared/composables/useProfile'
import { useUpdateProfile } from './composables/useUpdateProfile'
import {
  stepTargetSchema,
  stepScoresSchema,
  stepGoalSchema,
  ENT_MAX_SCORE,
  type ExpectedScoreValues,
} from './schemas/onboarding'
import Stepper from '@/shared/components/Stepper.vue'
import SearchSelect, {
  type SearchSelectOption,
} from '@/shared/components/SearchSelect.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { useAuthStore } from '@/shared/stores/auth'
import { useUiStore } from '@/shared/stores/ui'
import { t, tFn } from '@/shared/lib/i18n'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()

const optionsQuery = useOnboardingOptions()
const profileQuery = useProfile()
const updateProfile = useUpdateProfile()

const isLoading = computed(
  () => optionsQuery.isPending.value || profileQuery.isPending.value,
)
const isError = computed(() => optionsQuery.isError.value || profileQuery.isError.value)
const error = computed(() => optionsQuery.error.value ?? profileQuery.error.value)

const step = ref<1 | 2 | 3>(1)
const TOTAL_STEPS = 3

// Form state — a single reactive object so back-navigation preserves entries.
const form = reactive<{
  target_university: number | null
  target_specialty: number | null
  target_score: number | null
}>({
  target_university: null,
  target_specialty: null,
  target_score: null,
})

// Per-subject score map — keyed by subject name from /profile/onboarding-options/.subjects.
const expectedMap = reactive<Record<string, number | null>>({})

// Pre-fill from existing profile (covers refresh / partially-completed onboarding).
watch(
  () => profileQuery.data.value,
  (p) => {
    if (!p) return
    if (p.target_university != null) form.target_university = p.target_university
    if (p.target_specialty != null) form.target_specialty = p.target_specialty
    if (p.target_score != null) form.target_score = p.target_score
    for (const es of p.expected_scores ?? []) {
      if (es.subject) expectedMap[es.subject] = es.score ?? null
    }
  },
  { immediate: true },
)

// Seed expectedMap with every subject from the options endpoint, default null.
watch(
  () => optionsQuery.data.value?.subjects,
  (subjects) => {
    for (const s of subjects ?? []) {
      if (!(s in expectedMap)) expectedMap[s] = null
    }
  },
  { immediate: true },
)

// Reset specialty when university changes — the old spec almost certainly doesn't
// belong to the new uni.
watch(
  () => form.target_university,
  (next, prev) => {
    if (prev !== undefined && next !== prev) form.target_specialty = null
  },
)

// ────────────────── Options for the SearchSelects ──────────────────

const universityOptions = computed<SearchSelectOption<number>[]>(() => {
  const list = optionsQuery.data.value?.universities ?? []
  return list
    .filter((u): u is typeof u & { id: number; name: string } =>
      typeof u.id === 'number' && typeof u.name === 'string',
    )
    .map((u) => ({
      value: u.id,
      label: u.name,
      hint: u.city ?? undefined,
    }))
})

const specialtyOptions = computed<SearchSelectOption<number>[]>(() => {
  const uniId = form.target_university
  if (uniId == null) return []
  const list = optionsQuery.data.value?.specialties ?? []
  return list
    .filter((s) => s.university_id === uniId)
    .filter((s): s is typeof s & { id: number; name: string } =>
      typeof s.id === 'number' && typeof s.name === 'string',
    )
    .map((s) => ({
      value: s.id,
      label: s.name,
      hint: s.latest_threshold != null ? `${s.latest_threshold}` : undefined,
    }))
})

const subjects = computed(() => optionsQuery.data.value?.subjects ?? [])

// ────────────────── Per-step validation gates ──────────────────

const step1Ok = computed(() => {
  const r = stepTargetSchema.safeParse({
    target_university: form.target_university,
    target_specialty: form.target_specialty,
  })
  return r.success
})

const expectedScores = computed<ExpectedScoreValues[]>(() =>
  subjects.value
    .map((s) => ({ subject: s, score: expectedMap[s] }))
    .filter((e): e is ExpectedScoreValues => typeof e.score === 'number'),
)

const step2Ok = computed(() => {
  if (subjects.value.length === 0) return false
  // All subjects must be filled and valid.
  if (expectedScores.value.length !== subjects.value.length) return false
  const r = stepScoresSchema.safeParse({ expected_scores: expectedScores.value })
  return r.success
})

const step3Ok = computed(() => {
  // target_score is optional — null is acceptable.
  if (form.target_score == null) return true
  const r = stepGoalSchema.safeParse({ target_score: form.target_score })
  return r.success
})

const canAdvance = computed(() => {
  if (step.value === 1) return step1Ok.value
  if (step.value === 2) return step2Ok.value
  return step3Ok.value
})

// ────────────────── Actions ──────────────────

function next(): void {
  if (!canAdvance.value) return
  if (step.value < TOTAL_STEPS) step.value = (step.value + 1) as 1 | 2 | 3
  else void finish()
}

function back(): void {
  if (step.value > 1) step.value = (step.value - 1) as 1 | 2 | 3
}

function onScoreInput(subject: string, e: Event): void {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') {
    expectedMap[subject] = null
    return
  }
  const n = Number(raw)
  expectedMap[subject] = Number.isFinite(n) ? Math.trunc(n) : null
}

function onTargetInput(e: Event): void {
  const raw = (e.target as HTMLInputElement).value
  if (raw === '') {
    form.target_score = null
    return
  }
  const n = Number(raw)
  form.target_score = Number.isFinite(n) ? Math.trunc(n) : null
}

function skipGoal(): void {
  form.target_score = null
  void finish()
}

async function finish(): Promise<void> {
  try {
    const result = await updateProfile.mutateAsync({
      target_university: form.target_university,
      target_specialty: form.target_specialty,
      target_score: form.target_score,
      expected_scores: expectedScores.value,
    })
    // Keep authStore in lockstep so the router guard lets us into /dashboard.
    if (result.onboarding_completed) {
      auth.patchUser({ onboarding_completed: true })
    }
    await router.replace({ name: 'dashboard' })
  } catch {
    ui.pushToast(t('onboarding.submitError'), 'danger')
  }
}

const primaryLabel = computed(() => {
  if (step.value < TOTAL_STEPS) return t('onboarding.next')
  return t('onboarding.finish')
})

const scoreLabelFmt = tFn<(n: number | null | undefined) => string>('onboarding.minScore')
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-xl mx-auto pb-32 md:pb-10">
    <LoadingSkeleton v-if="isLoading" :rows="3" variant="card" />

    <ErrorState
      v-else-if="isError"
      :body="error?.message"
      @retry="
        () => {
          void optionsQuery.refetch()
          void profileQuery.refetch()
        }
      "
    />

    <template v-else>
      <Stepper :step="step" :total="TOTAL_STEPS" class="mb-6" />

      <!-- Step 1 — target uni + specialty -->
      <div v-show="step === 1" class="space-y-5">
        <header>
          <h1 class="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            {{ t('onboarding.stepTarget') }}
          </h1>
          <p class="mt-2 text-sm text-muted">{{ t('onboarding.stepTargetBody') }}</p>
        </header>

        <div class="space-y-3">
          <SearchSelect
            v-model="form.target_university"
            :options="universityOptions"
            :placeholder="t('onboarding.uniPlaceholder')"
            :aria-label="t('onboarding.stepTarget')"
          />
          <SearchSelect
            v-model="form.target_specialty"
            :options="specialtyOptions"
            :placeholder="t('onboarding.specPlaceholder')"
            :empty-label="
              form.target_university == null
                ? t('onboarding.specEmpty')
                : 'Ничего не найдено.'
            "
            :disabled="form.target_university == null"
          />
          <p
            v-if="form.target_specialty != null"
            class="text-xs text-muted tabular-nums"
          >
            {{
              scoreLabelFmt(
                optionsQuery.data.value?.specialties?.find(
                  (s) => s.id === form.target_specialty,
                )?.latest_threshold,
              )
            }}
          </p>
        </div>
      </div>

      <!-- Step 2 — expected scores per other subject -->
      <div v-show="step === 2" class="space-y-5">
        <header>
          <h1 class="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            {{ t('onboarding.stepScores') }}
          </h1>
          <p class="mt-2 text-sm text-muted">{{ t('onboarding.stepScoresBody') }}</p>
        </header>

        <div class="space-y-3">
          <label
            v-for="subject in subjects"
            :key="subject"
            class="block"
          >
            <span class="text-sm font-medium text-ink">{{ subject }}</span>
            <input
              type="number"
              inputmode="numeric"
              min="0"
              :max="ENT_MAX_SCORE"
              :value="expectedMap[subject] ?? ''"
              :placeholder="`0 — ${ENT_MAX_SCORE}`"
              class="mt-1.5 w-full h-12 px-3.5 rounded-button bg-card border border-hairline text-base text-ink tabular-nums placeholder:text-muted focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15 transition-colors"
              @input="onScoreInput(subject, $event)"
            />
          </label>
        </div>
      </div>

      <!-- Step 3 — optional target score -->
      <div v-show="step === 3" class="space-y-5">
        <header>
          <h1 class="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">
            {{ t('onboarding.stepGoal') }}
          </h1>
          <p class="mt-2 text-sm text-muted">{{ t('onboarding.stepGoalBody') }}</p>
        </header>

        <label class="block">
          <span class="text-sm font-medium text-ink">{{ t('profile.level') }}</span>
          <input
            type="number"
            inputmode="numeric"
            min="0"
            :max="ENT_MAX_SCORE"
            :value="form.target_score ?? ''"
            :placeholder="t('onboarding.targetScorePlaceholder')"
            class="mt-1.5 w-full h-12 px-3.5 rounded-button bg-card border border-hairline text-base text-ink tabular-nums placeholder:text-muted focus:outline-none focus:border-brand/40 focus:ring-2 focus:ring-brand/15 transition-colors"
            @input="onTargetInput"
          />
        </label>
      </div>

      <!-- Sticky footer with Back / primary -->
      <div
        class="sticky bottom-4 md:static md:mt-8 z-30 mt-8 flex items-center gap-3"
      >
        <button
          v-if="step > 1"
          type="button"
          class="shrink-0 h-12 px-5 rounded-button bg-card border border-hairline text-sm font-medium text-ink hover:bg-surface transition-colors"
          @click="back"
        >
          {{ t('onboarding.back') }}
        </button>

        <button
          v-if="step === 3"
          type="button"
          class="shrink-0 h-12 px-4 rounded-button text-sm font-medium text-muted hover:text-ink transition-colors"
          :disabled="updateProfile.isPending.value"
          @click="skipGoal"
        >
          {{ t('onboarding.skip') }}
        </button>

        <button
          type="button"
          class="flex-1 inline-flex items-center justify-center h-12 px-6 rounded-button font-semibold text-base transition-colors shadow-elevated"
          :class="
            canAdvance && !updateProfile.isPending.value
              ? 'bg-brand text-white hover:bg-brand-press active:scale-[0.98]'
              : 'bg-card text-muted border border-hairline cursor-not-allowed opacity-60'
          "
          :disabled="!canAdvance || updateProfile.isPending.value"
          @click="next"
        >
          {{ primaryLabel }}
        </button>
      </div>
    </template>
  </section>
</template>
