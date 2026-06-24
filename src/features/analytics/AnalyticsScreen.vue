<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTagStats } from './composables/useTagStats'
import { useRecommendations } from './composables/useRecommendations'
import RadarChart from './components/RadarChart.vue'
import RecommendationCard from './components/RecommendationCard.vue'
import MasteryBadge from './components/MasteryBadge.vue'
import ProgressBar from '@/shared/components/ProgressBar.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { masteryLevel, masteryTone } from '@/shared/lib/utils/mastery'
import { t, tFn } from '@/shared/lib/i18n'

const router = useRouter()

const tagsQuery = useTagStats()
const recsQuery = useRecommendations()

const isPending = computed(
  () => tagsQuery.isPending.value || recsQuery.isPending.value,
)
const isError = computed(() => tagsQuery.isError.value || recsQuery.isError.value)
const error = computed(() => tagsQuery.error.value ?? recsQuery.error.value)

const tags = computed(() => tagsQuery.data.value ?? [])
const recs = computed(() => recsQuery.data.value ?? [])

// Show radar only when we have at least 3 tags — fewer and the polygon
// collapses to a line or point, which reads as a chart bug rather than data.
const hasRadarShape = computed(
  () => tags.value.filter((t) => (t.total ?? 0) > 0).length >= 3,
)

const isEmpty = computed(
  () => tags.value.length === 0 || tags.value.every((t) => (t.total ?? 0) === 0),
)

const countText = tFn<(c: number, total: number) => string>('analytics.statCount')

function levelFor(percent: number | null | undefined, total: number) {
  return masteryLevel(percent ?? 0, total)
}

function retry(): void {
  void tagsQuery.refetch()
  void recsQuery.refetch()
}

function startMock(): void {
  void router.push({ name: 'mock' })
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto pb-24 space-y-6">
    <header>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
        {{ t('analytics.title') }}
      </h1>
    </header>

    <LoadingSkeleton v-if="isPending" :rows="3" variant="card" />

    <ErrorState
      v-else-if="isError"
      :body="error?.message"
      @retry="retry"
    />

    <EmptyState
      v-else-if="isEmpty"
      :title="t('analytics.emptyTitle')"
      :body="t('analytics.emptyBody')"
      :cta-label="t('analytics.emptyCta')"
      @cta="startMock"
    />

    <template v-else>
      <!-- Hero radar (only meaningful with ≥3 tagged datapoints) -->
      <RadarChart v-if="hasRadarShape" :data="tags" />

      <!-- Per-tag breakdown -->
      <section class="space-y-3">
        <h2 class="font-display text-lg font-semibold text-ink">
          {{ t('analytics.tagsHeading') }}
        </h2>
        <ul class="space-y-2">
          <li
            v-for="stat in tags"
            :key="stat.tag?.id"
            class="rounded-card bg-card border border-hairline px-5 py-4 shadow-card"
          >
            <div class="flex items-center justify-between gap-3 mb-2">
              <p class="text-sm font-medium text-ink truncate">
                {{ stat.tag?.name }}
              </p>
              <MasteryBadge :level="levelFor(stat.percent, stat.total ?? 0)" />
            </div>
            <ProgressBar
              :percent="stat.percent ?? 0"
              :tone="masteryTone(levelFor(stat.percent, stat.total ?? 0))"
            />
            <p class="mt-2 text-xs text-muted tabular-nums">
              {{ Math.round(stat.percent ?? 0) }}% ·
              {{ countText(stat.correct ?? 0, stat.total ?? 0) }}
            </p>
          </li>
        </ul>
      </section>

      <!-- Recommendations -->
      <section v-if="recs.length > 0" class="space-y-3">
        <h2 class="font-display text-lg font-semibold text-ink">
          {{ t('analytics.recommendations') }}
        </h2>
        <div class="space-y-3">
          <RecommendationCard
            v-for="rec in recs"
            :key="rec.tag?.id"
            :recommendation="rec"
          />
        </div>
      </section>

      <p
        v-else
        class="text-sm text-muted text-center py-4"
      >
        {{ t('analytics.noRecommendations') }}
      </p>
    </template>
  </section>
</template>
