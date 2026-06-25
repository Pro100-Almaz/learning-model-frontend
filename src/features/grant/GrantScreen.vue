<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useCalculateGrant, type QualifyingGrant } from './composables/useCalculateGrant'
import Trajectory from './components/Trajectory.vue'
import GoalTrackerCard from './components/GoalTrackerCard.vue'
import UniversityResultCard from './components/UniversityResultCard.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { t, tFn } from '@/shared/lib/i18n'

const router = useRouter()

const { data: result, isPending, isError, error, refetch, isFetching } = useCalculateGrant()

const isNoMock = computed(() => {
  if (!isError.value) return false
  return axios.isAxiosError(error.value) && error.value.response?.status === 409
})

// Sort qualifying grants by margin desc — the user wants their best fits first.
const sortedGrants = computed<QualifyingGrant[]>(() => {
  const list = result.value?.qualifying_grants ?? []
  return [...list].sort((a, b) => (b.margin ?? 0) - (a.margin ?? 0))
})

const equationFmt = tFn<(math: number, other: number, total: number) => string>(
  'grant.equation',
)

const equation = computed(() => {
  if (!result.value) return ''
  return equationFmt(
    Math.round(result.value.math_score ?? 0),
    Math.round(result.value.other_subjects_total ?? 0),
    Math.round(result.value.predicted_score ?? 0),
  )
})

function goMock(): void {
  void router.push({ name: 'mock' })
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto pb-24 space-y-6">
    <header class="flex items-start justify-between gap-3 flex-wrap">
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
        {{ t('grant.title') }}
      </h1>
      <button
        v-if="result"
        type="button"
        class="shrink-0 h-9 px-3.5 rounded-button bg-card border border-hairline text-xs font-medium text-muted hover:text-ink hover:bg-surface transition-colors disabled:opacity-60"
        :disabled="isFetching"
        @click="refetch()"
      >
        {{ t('grant.recalculate') }}
      </button>
    </header>

    <LoadingSkeleton
      v-if="isPending"
      :rows="2"
      variant="card"
    />

    <EmptyState
      v-else-if="isNoMock"
      :title="t('grant.title')"
      :body="t('grant.blockedNoMock')"
      :cta-label="t('grant.blockedCta')"
      @cta="goMock"
    />

    <ErrorState
      v-else-if="isError"
      :body="error?.message"
      @retry="refetch()"
    />

    <template v-else-if="result">
      <!-- Equation line — math + others = predicted -->
      <p class="text-sm text-muted tabular-nums">
        {{ equation }}
      </p>

      <!-- Hero: Goal tracker (if target is set) or plain Trajectory -->
      <GoalTrackerCard
        v-if="result.goal"
        :goal="result.goal"
      />
      <section
        v-else
        class="rounded-card bg-card border border-hairline shadow-card px-5 py-6 md:px-7 md:py-7"
      >
        <Trajectory
          :predicted="result.predicted_score ?? 0"
          :target="null"
          variant="full"
        />
      </section>

      <!-- Qualifying grants -->
      <section class="space-y-3">
        <h2 class="font-display text-lg font-semibold text-ink">
          {{ t('grant.qualifyingHeading') }}
        </h2>

        <EmptyState
          v-if="sortedGrants.length === 0"
          :title="t('grant.notQualifying')"
        />
        <div
          v-else
          class="space-y-3"
        >
          <UniversityResultCard
            v-for="(grant, i) in sortedGrants"
            :key="`${grant.university_name}-${grant.specialty_name}-${i}`"
            :university-name="grant.university_name ?? ''"
            :specialty-name="grant.specialty_name ?? ''"
            :min-score="grant.min_score ?? 0"
            :margin="grant.margin ?? 0"
          />
        </div>
      </section>
    </template>
  </section>
</template>
