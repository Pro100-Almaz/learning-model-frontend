<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import MasteryBadge from './MasteryBadge.vue'
import { masteryLevel } from '@/shared/lib/utils/mastery'
import { pluralRu } from '@/shared/lib/utils/plural'
import type { Recommendation } from '../composables/useRecommendations'

interface Props {
  recommendation: Recommendation
}

const props = defineProps<Props>()

// The contract gives us percent but not total — assume any recommendation
// implies prior attempts (it's surfaced because the user got <50%), so total > 0.
const level = computed(() => masteryLevel(props.recommendation.percent ?? 0, 1))

const lessonsCount = computed(() => props.recommendation.lessons?.length ?? 0)
const lessonWord = computed(() => pluralRu(lessonsCount.value, 'урок', 'урока', 'уроков'))

function formatDuration(sec: number | undefined): string {
  if (!sec || sec < 60) return `${Math.max(sec ?? 0, 0)} сек`
  return `${Math.round(sec / 60)} мин`
}
</script>

<template>
  <article
    class="rounded-card bg-card border border-hairline shadow-card overflow-hidden"
  >
    <header class="px-5 py-4 flex items-center justify-between gap-3 border-b border-hairline">
      <div class="min-w-0">
        <p class="font-display text-lg font-semibold text-ink leading-tight truncate">
          {{ recommendation.tag?.name }}
        </p>
        <p class="text-xs text-muted mt-0.5 tabular-nums">
          {{ Math.round(recommendation.percent ?? 0) }}% · {{ lessonsCount }} {{ lessonWord }}
        </p>
      </div>
      <MasteryBadge :level="level" size="md" />
    </header>

    <ul>
      <li
        v-for="lesson in recommendation.lessons ?? []"
        :key="lesson.id"
        class="border-b border-hairline last:border-b-0"
      >
        <RouterLink
          :to="{ name: 'lesson', params: { id: lesson.id } }"
          class="flex items-center gap-3 px-5 py-3 hover:bg-surface transition-colors group"
        >
          <span
            class="shrink-0 w-7 h-7 rounded-full bg-surface border border-hairline text-muted text-xs font-semibold tabular-nums grid place-items-center"
            aria-hidden="true"
          >
            {{ lesson.order }}
          </span>
          <span class="min-w-0 flex-1 text-sm font-medium text-ink truncate">
            {{ lesson.title }}
          </span>
          <span class="shrink-0 text-xs text-muted tabular-nums">
            {{ formatDuration(lesson.duration_sec) }}
          </span>
          <svg
            viewBox="0 0 16 16"
            class="shrink-0 w-3.5 h-3.5 text-muted/50 group-hover:text-muted transition-colors"
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
      </li>
    </ul>
  </article>
</template>
