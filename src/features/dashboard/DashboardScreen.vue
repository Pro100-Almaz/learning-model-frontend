<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import { useGamification } from '@/features/profile/composables/useGamification'
import { useCalculateGrant } from '@/features/grant/composables/useCalculateGrant'
import { useRecommendations } from '@/features/analytics/composables/useRecommendations'
import Trajectory from '@/features/grant/components/Trajectory.vue'
import StreakFlame from '@/features/profile/components/StreakFlame.vue'
import XPBar from '@/features/profile/components/XPBar.vue'
import MasteryBadge from '@/features/analytics/components/MasteryBadge.vue'
import ProgressBar from '@/shared/components/ProgressBar.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { masteryLevel, masteryTone } from '@/shared/lib/utils/mastery'
import { pluralRu } from '@/shared/lib/utils/plural'
import { useAuthStore } from '@/shared/stores/auth'
import { t, tFn } from '@/shared/lib/i18n'

const router = useRouter()
const auth = useAuthStore()

const gamQuery = useGamification()
const grantQuery = useCalculateGrant()
const recsQuery = useRecommendations()

const greet = tFn<(name: string) => string>('dashboard.greeting')
const continueWith = tFn<(tag: string) => string>('dashboard.continueWith')
const qualifyingCountFmt = tFn<(n: number, word: string) => string>('dashboard.qualifyingCount')
const equationFmt = tFn<(math: number, other: number) => string>('dashboard.equation')
const lessonsCountFmt = tFn<(n: number, word: string) => string>('dashboard.lessonsCount')
const passingByFmt = tFn<(n: number) => string>('grant.passingBy')
const shortByFmt = tFn<(n: number) => string>('grant.shortBy')

// 409 = no completed math mock yet → hide Trajectory, show "first mock" CTA instead.
const noMockYet = computed(() => {
  if (!grantQuery.isError.value) return false
  return axios.isAxiosError(grantQuery.error.value) && grantQuery.error.value.response?.status === 409
})

// A real failure (network, 5xx) — distinct from the fixable 409 empty state.
const grantHardError = computed(() => grantQuery.isError.value && !noMockYet.value)

// Only block the whole surface on the very first load, before any data exists.
const initialLoading = computed(
  () => grantQuery.isPending.value || gamQuery.isPending.value,
)
const recsLoading = computed(() => recsQuery.isPending.value)

function retryGrant(): void {
  void grantQuery.refetch()
}

const grant = computed(() => grantQuery.data.value ?? null)
const goal = computed(() => grant.value?.goal ?? null)
const gam = computed(() => gamQuery.data.value ?? null)

const topRecs = computed(() => (recsQuery.data.value ?? []).slice(0, 3))
const topGrants = computed(() => (grant.value?.qualifying_grants ?? []).slice(0, 3))
const qualifyingTotal = computed(() => grant.value?.qualifying_grants?.length ?? 0)

// Header subtitle carries the honest grant headline: how many you already clear.
const qualifyingLine = computed<string>(() => {
  const n = qualifyingTotal.value
  if (n === 0) return t('dashboard.qualifyingNone')
  return qualifyingCountFmt(n, pluralRu(n, 'грант', 'гранта', 'грантов'))
})

function recLessonId(rec: (typeof topRecs.value)[number]): number | null {
  return rec.lessons?.[0]?.id ?? null
}
function recLevel(rec: (typeof topRecs.value)[number]) {
  return masteryLevel(rec.percent ?? 0, 1)
}
function lessonsLabel(rec: (typeof topRecs.value)[number]): string {
  const n = rec.lessons?.length ?? 0
  return lessonsCountFmt(n, pluralRu(n, 'урок', 'урока', 'уроков'))
}

function grantMargin(margin: number | undefined): {
  label: string
  cls: string
} {
  const m = margin ?? 0
  if (m > 0) return { label: passingByFmt(m), cls: 'bg-success/15 text-success' }
  if (m === 0) return { label: t('grant.atThreshold'), cls: 'bg-brand/15 text-brand' }
  return { label: shortByFmt(Math.abs(m)), cls: 'bg-danger/15 text-danger' }
}

function goMock(): void {
  void router.push({ name: 'mock' })
}
</script>

<template>
  <section
    class="mx-auto max-w-screen-xl px-4 md:px-8 py-6 md:py-10 pb-24 md:pb-12"
  >
    <!-- Greeting row -->
    <header class="flex items-start justify-between gap-4 mb-6 md:mb-8">
      <div class="min-w-0">
        <h1
          class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight text-balance"
        >
          {{ greet(auth.user?.first_name ?? 'друг') }}
        </h1>
        <p
          v-if="!initialLoading && !grantHardError"
          class="mt-1.5 flex items-center gap-1.5 text-sm font-medium tabular-nums"
          :class="qualifyingTotal > 0 ? 'text-ink' : 'text-muted'"
        >
          <span
            v-if="qualifyingTotal > 0"
            class="inline-block w-1.5 h-1.5 rounded-full bg-success"
            aria-hidden="true"
          />
          {{ qualifyingLine }}
        </p>
      </div>
      <StreakFlame
        v-if="gam?.streak"
        class="shrink-0"
        :days="gam.streak.current ?? 0"
        :active-today="gam.streak.active_today ?? false"
      />
    </header>

    <!-- Loading: unified skeleton (no lone spinners) -->
    <div
      v-if="initialLoading"
      class="grid grid-cols-1 gap-5 lg:grid-cols-12"
    >
      <div class="lg:col-span-8">
        <div class="rounded-card bg-card border border-hairline shadow-card p-6 md:p-7">
          <LoadingSkeleton
            :rows="1"
            variant="video"
          />
        </div>
        <div class="mt-5">
          <LoadingSkeleton
            :rows="3"
            variant="row"
          />
        </div>
      </div>
      <div class="lg:col-span-4 space-y-5">
        <LoadingSkeleton
          :rows="2"
          variant="card"
        />
      </div>
    </div>

    <!-- Content -->
    <div
      v-else
      class="grid grid-cols-1 gap-5 lg:grid-cols-12"
    >
      <!-- ── Main column ─────────────────────────────── -->
      <div class="lg:col-span-8 space-y-5">
        <!-- Hero: Trajectory · first-mock empty · hard error -->
        <RouterLink
          v-if="goal || grant"
          :to="{ name: 'grant' }"
          class="block rounded-card bg-card border border-hairline shadow-card p-6 md:p-7 hover:border-brand/40 hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Trajectory
            :predicted="grant?.predicted_score ?? goal?.predicted_score ?? 0"
            :target="goal?.target_score ?? null"
            variant="full"
          />

          <!-- Advice — the narrative heart, straight from the backend -->
          <div
            v-if="goal?.advice || goal?.weakest_tag"
            class="mt-5 rounded-card bg-surface border border-hairline px-4 py-3.5"
          >
            <p
              v-if="goal.advice"
              class="text-sm text-ink leading-relaxed"
            >
              {{ goal.advice }}
            </p>
            <p
              v-if="goal.weakest_tag"
              class="mt-2 text-xs uppercase tracking-wider font-semibold text-ascent"
            >
              {{ t('grant.weakestTag') }}: {{ goal.weakest_tag }}
            </p>
          </div>

          <!-- Footer: honest breakdown + affordance -->
          <div class="mt-4 flex items-center justify-between gap-3">
            <p
              v-if="grant?.math_score != null && grant?.other_subjects_total != null"
              class="text-xs text-muted tabular-nums truncate"
            >
              {{ equationFmt(grant.math_score, grant.other_subjects_total) }}
            </p>
            <span
              class="shrink-0 ml-auto text-xs uppercase tracking-wider font-semibold text-brand"
            >
              {{ t('dashboard.trajectoryCta') }}
            </span>
          </div>
        </RouterLink>

        <article
          v-else-if="noMockYet"
          class="rounded-card bg-card border border-hairline shadow-card p-6 md:p-7"
        >
          <span
            class="inline-grid place-items-center w-11 h-11 rounded-full bg-brand/8 text-brand mb-4"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
              />
              <circle
                cx="12"
                cy="12"
                r="0.5"
                fill="currentColor"
              />
            </svg>
          </span>
          <p class="font-display text-xl font-semibold text-ink leading-snug text-balance">
            {{ t('dashboard.firstMockCta') }}
          </p>
          <p class="mt-2 text-sm text-muted leading-relaxed max-w-md">
            {{ t('dashboard.firstMockBody') }}
          </p>
          <button
            type="button"
            class="mt-5 inline-flex items-center justify-center h-11 px-5 rounded-button bg-brand text-white text-sm font-semibold hover:bg-brand-press transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            @click="goMock"
          >
            {{ t('mock.introCta') }}
          </button>
        </article>

        <ErrorState
          v-else-if="grantHardError"
          @retry="retryGrant"
        />

        <!-- Weak spots — top tags, drill into the first lesson -->
        <section
          class="rounded-card bg-card border border-hairline shadow-card overflow-hidden"
        >
          <header
            class="px-5 py-4 flex items-center justify-between gap-3 border-b border-hairline"
          >
            <div class="min-w-0">
              <h2 class="text-base font-semibold text-ink">
                {{ t('dashboard.weakSpotHeading') }}
              </h2>
              <p class="text-xs text-muted mt-0.5">
                {{ t('dashboard.weakSpotsSub') }}
              </p>
            </div>
            <RouterLink
              :to="{ name: 'analytics' }"
              class="shrink-0 text-xs font-semibold text-brand hover:text-brand-press transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              {{ t('dashboard.weakSpotsAll') }} →
            </RouterLink>
          </header>

          <!-- Loading -->
          <div
            v-if="recsLoading"
            class="px-5 py-4"
          >
            <LoadingSkeleton
              :rows="3"
              variant="row"
            />
          </div>

          <!-- Data -->
          <ul v-else-if="topRecs.length">
            <li
              v-for="(rec, i) in topRecs"
              :key="rec.tag?.name ?? `rec-${i}`"
              class="border-b border-hairline last:border-b-0"
            >
              <component
                :is="recLessonId(rec) != null ? RouterLink : 'div'"
                :to="
                  recLessonId(rec) != null
                    ? { name: 'lesson', params: { id: recLessonId(rec) } }
                    : undefined
                "
                class="flex items-center gap-4 px-5 py-4 transition-colors group"
                :class="
                  recLessonId(rec) != null
                    ? 'hover:bg-surface focus-visible:outline-none focus-visible:bg-surface'
                    : ''
                "
              >
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-semibold text-ink truncate">
                      {{ continueWith(rec.tag?.name ?? '') }}
                    </p>
                    <MasteryBadge
                      :level="recLevel(rec)"
                      size="sm"
                    />
                  </div>
                  <div class="mt-2 flex items-center gap-3">
                    <div class="w-24 sm:w-32">
                      <ProgressBar
                        :percent="rec.percent ?? 0"
                        :tone="masteryTone(recLevel(rec))"
                      />
                    </div>
                    <span class="text-xs text-muted tabular-nums whitespace-nowrap">
                      {{ Math.round(rec.percent ?? 0) }}% · {{ lessonsLabel(rec) }}
                    </span>
                  </div>
                </div>
                <svg
                  v-if="recLessonId(rec) != null"
                  viewBox="0 0 16 16"
                  class="shrink-0 w-4 h-4 text-muted/50 group-hover:text-ink group-hover:translate-x-0.5 transition-all"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 4l4 4-4 4" />
                </svg>
              </component>
            </li>
          </ul>

          <!-- Empty (honest positive) -->
          <div
            v-else
            class="px-5 py-8 text-center"
          >
            <p class="font-display text-base font-semibold text-ink">
              {{ t('dashboard.weakSpotsEmpty') }}
            </p>
            <p class="mt-1.5 text-sm text-muted max-w-xs mx-auto">
              {{ t('dashboard.weakSpotsEmptyBody') }}
            </p>
          </div>
        </section>
      </div>

      <!-- ── Side rail ───────────────────────────────── -->
      <aside class="lg:col-span-4 space-y-5">
        <!-- Momentum -->
        <XPBar
          v-if="gam"
          :total-xp="gam.total_xp ?? 0"
          :xp-to-next="gam.xp_to_next_level ?? 0"
          :level-code="gam.level_code"
          :level-label="gam.level_label"
        />

        <!-- Qualifying grants preview -->
        <section
          class="rounded-card bg-card border border-hairline shadow-card p-5"
        >
          <header class="flex items-center justify-between gap-3 mb-1">
            <h2 class="text-base font-semibold text-ink">
              {{ t('dashboard.grantsHeading') }}
            </h2>
            <RouterLink
              v-if="topGrants.length"
              :to="{ name: 'grant' }"
              class="shrink-0 text-xs font-semibold text-brand hover:text-brand-press transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
            >
              {{ t('dashboard.grantsAll') }} →
            </RouterLink>
          </header>

          <ul
            v-if="topGrants.length"
            class="mt-3 divide-y divide-hairline"
          >
            <li
              v-for="(g, i) in topGrants"
              :key="`${g.specialty_name}-${i}`"
              class="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <div class="min-w-0">
                <p class="text-sm font-medium text-ink truncate">
                  {{ g.specialty_name }}
                </p>
                <p class="text-xs text-muted truncate mt-0.5">
                  {{ g.university_name }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums"
                :class="grantMargin(g.margin).cls"
              >
                {{ grantMargin(g.margin).label }}
              </span>
            </li>
          </ul>

          <p
            v-else
            class="mt-2 text-sm text-muted leading-relaxed"
          >
            {{ t('dashboard.grantsEmptyBody') }}
          </p>
        </section>

        <!-- Quick actions -->
        <section
          class="rounded-card bg-card border border-hairline shadow-card p-5"
        >
          <h2 class="text-base font-semibold text-ink mb-3">
            {{ t('dashboard.quickHeading') }}
          </h2>

          <button
            type="button"
            class="w-full inline-flex items-center gap-3 h-12 px-4 rounded-button bg-brand text-white text-sm font-semibold hover:bg-brand-press transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            @click="goMock"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5 shrink-0"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
              />
              <circle
                cx="12"
                cy="12"
                r="5"
              />
              <circle
                cx="12"
                cy="12"
                r="1.5"
                fill="currentColor"
              />
            </svg>
            <span class="flex-1 text-left leading-tight">
              {{ t('dashboard.quickMock') }}
              <span class="block text-xs font-normal text-white/90">
                {{ t('dashboard.quickMockSub') }}
              </span>
            </span>
          </button>

          <RouterLink
            :to="{ name: 'catalog' }"
            class="mt-2 w-full inline-flex items-center gap-3 h-12 px-4 rounded-button bg-surface border border-hairline text-ink text-sm font-semibold hover:border-brand/40 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-5 h-5 shrink-0 text-muted group-hover:text-ink transition-colors"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z" />
              <path
                d="M8 7h8M8 11h8M8 15h5"
                stroke-linecap="round"
              />
            </svg>
            <span class="flex-1 text-left leading-tight">
              {{ t('dashboard.quickCatalog') }}
              <span class="block text-xs font-normal text-muted">
                {{ t('dashboard.quickCatalogSub') }}
              </span>
            </span>
            <svg
              viewBox="0 0 16 16"
              class="shrink-0 w-4 h-4 text-muted/50 group-hover:text-ink group-hover:translate-x-0.5 transition-all"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4l4 4-4 4" />
            </svg>
          </RouterLink>
        </section>
      </aside>
    </div>
  </section>
</template>
