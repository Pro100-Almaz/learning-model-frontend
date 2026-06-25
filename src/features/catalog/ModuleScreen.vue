<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useModule } from './composables/useModule'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { t } from '@/shared/lib/i18n'

const route = useRoute()
const moduleId = computed(() => route.params.moduleId as string | undefined)

const { data: mod, isPending, isError, error, refetch } = useModule(moduleId)

function formatDuration(sec: number): string {
  if (!sec || sec < 60) return `${Math.max(sec, 0)} сек`
  const m = Math.round(sec / 60)
  return `${m} мин`
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto">
    <LoadingSkeleton
      v-if="isPending"
      :rows="4"
      variant="row"
    />

    <ErrorState
      v-else-if="isError"
      :body="error?.message"
      @retry="refetch()"
    />

    <template v-else-if="mod">
      <header class="mb-6">
        <RouterLink
          :to="{ name: 'catalog' }"
          class="inline-flex items-center gap-1 text-sm text-muted hover:text-ink transition-colors"
          aria-label="Вернуться ко всем темам"
        >
          <svg
            viewBox="0 0 16 16"
            class="w-3.5 h-3.5 shrink-0"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 12L6 8l4-4" />
          </svg>
          {{ t('module.backToTopics') }}
        </RouterLink>
        <h1 class="font-display text-3xl md:text-4xl font-bold text-ink mt-3 leading-tight">
          {{ mod.title }}
        </h1>
      </header>

      <EmptyState
        v-if="!mod.lessons || mod.lessons.length === 0"
        :title="t('module.lessonsEmpty')"
        :body="t('module.lessonsEmptyBody')"
      />

      <ol
        v-else
        class="space-y-2"
      >
        <li
          v-for="lesson in mod.lessons"
          :key="lesson.id"
        >
          <RouterLink
            :to="{ name: 'lesson', params: { id: lesson.id } }"
            class="group flex items-center gap-3 rounded-card bg-card border border-hairline px-4 py-3.5 hover:border-brand/40 hover:-translate-y-px hover:shadow-card transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <!-- Completion indicator -->
            <span
              class="shrink-0 w-7 h-7 rounded-full grid place-items-center transition-transform duration-150"
              :class="
                lesson.completed
                  ? 'bg-success/15 text-success scale-100 completion-pop'
                  : 'bg-surface text-muted border border-hairline'
              "
              :aria-label="lesson.completed ? t('module.lessonCompleted') : t('module.lessonNotCompleted')"
            >
              <svg
                v-if="lesson.completed"
                viewBox="0 0 24 24"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                aria-hidden="true"
              >
                <path
                  d="M5 12l5 5L20 7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span
                v-else
                class="text-xs font-semibold tabular-nums"
              >
                {{ lesson.order }}
              </span>
            </span>

            <!-- Lesson meta -->
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-ink truncate">
                {{ lesson.title }}
              </p>
              <p
                v-if="lesson.completed"
                class="text-xs text-success mt-0.5 font-medium"
              >
                {{ t('module.lessonCompleted') }}
              </p>
            </div>

            <!-- Duration -->
            <span class="shrink-0 text-xs text-muted tabular-nums">
              {{ formatDuration(lesson.duration_sec ?? 0) }}
            </span>

            <!-- Trailing chevron -->
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
      </ol>
    </template>
  </section>
</template>

<style scoped>
/*
  A brief scale pop on the completion badge.
  Keyframe drives 110% → 100% so it reads as a satisfying "snap".
  The global reduced-motion rule in main.css collapses this to 0.001ms automatically.
*/
@keyframes completion-pop {
  0% { transform: scale(1.15); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.completion-pop {
  animation: completion-pop 130ms ease-out both;
}
</style>
