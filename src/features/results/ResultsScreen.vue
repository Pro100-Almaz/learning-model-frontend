<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useAttemptReview, type AttemptReviewItem } from './composables/useAttemptReview'
import OptionButton from '@/features/test/components/OptionButton.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { t, tFn } from '@/shared/lib/i18n'

const route = useRoute()
const router = useRouter()
const attemptId = computed(() => route.params.attemptId as string | undefined)

const { data: review, isPending, isError, error, refetch } = useAttemptReview(attemptId)

const correctCount = tFn<(c: number, total: number) => string>('results.correctCount')
const hero = tFn<(pct: number) => string>('results.hero')

const stats = computed(() => {
  const items: AttemptReviewItem[] = review.value?.items ?? []
  const correct = items.filter((i) => i.is_correct === true).length
  const total = items.length
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { correct, total, pct }
})

// 403 / 404 surface friendlier copy than the generic error message.
const errorBody = computed<string | undefined>(() => {
  if (!isError.value) return undefined
  if (axios.isAxiosError(error.value)) {
    const status = error.value.response?.status
    if (status === 403) return t('results.notOwner')
    if (status === 404) return t('results.notFound')
  }
  return error.value?.message
})

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'

function stateForOption(item: AttemptReviewItem, optionId: number | undefined): OptionState {
  if (optionId == null) return 'disabled'
  if (optionId === item.correct_option_id) return 'correct'
  if (optionId === item.selected_option_id && item.is_correct !== true) return 'wrong'
  return 'disabled'
}

function onContinue(): void {
  void router.push({ name: 'catalog' })
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto pb-24">
    <LoadingSkeleton
      v-if="isPending"
      :rows="3"
      variant="card"
    />

    <ErrorState
      v-else-if="isError"
      :body="errorBody"
      @retry="refetch()"
    />

    <template v-else-if="review">
      <!-- Hero — big score, tabular-nums so digits don't jitter -->
      <header
        class="rounded-card bg-card border border-hairline shadow-card px-6 py-7 md:py-8 text-center"
      >
        <p class="text-xs uppercase tracking-wider font-semibold text-muted">
          {{ t('results.score') }}
        </p>
        <p
          class="mt-2 font-display text-5xl md:text-6xl font-bold text-ink tabular-nums leading-none"
          :class="stats.pct >= 60 ? 'text-success' : stats.pct >= 30 ? 'text-ink' : 'text-danger'"
          data-tabular
        >
          {{ hero(stats.pct) }}
        </p>
        <p class="mt-3 text-sm text-muted tabular-nums">
          {{ correctCount(stats.correct, stats.total) }}
        </p>
      </header>

      <h2 class="font-display text-xl font-semibold text-ink mt-8 mb-4">
        {{ t('results.review') }}
      </h2>

      <ol class="space-y-5">
        <li
          v-for="(item, i) in review.items ?? []"
          :key="item.question_id"
          class="rounded-card bg-card border border-hairline shadow-card px-5 py-5 space-y-4"
        >
          <header class="flex items-start gap-3">
            <span
              class="shrink-0 mt-0.5 w-6 h-6 rounded-full grid place-items-center text-xs font-semibold tabular-nums"
              :class="
                item.is_correct
                  ? 'bg-success/15 text-success'
                  : 'bg-danger/15 text-danger'
              "
              :aria-label="item.is_correct ? t('test.correct') : t('test.incorrect')"
            >
              {{ i + 1 }}
            </span>
            <p class="text-sm md:text-base font-semibold text-ink leading-relaxed">
              {{ item.question_text }}
            </p>
          </header>

          <div class="space-y-2.5">
            <OptionButton
              v-for="opt in item.options ?? []"
              :key="opt.id"
              :text="opt.text ?? ''"
              :state="stateForOption(item, opt.id)"
            />
          </div>

          <div
            v-if="item.explanation"
            class="border-l-2 border-brand/40 pl-4 py-1"
          >
            <p class="text-xs uppercase tracking-wider font-semibold text-muted">
              {{ t('results.explanation') }}
            </p>
            <p class="mt-1 text-sm text-ink/80 leading-relaxed whitespace-pre-line">
              {{ item.explanation }}
            </p>
          </div>
        </li>
      </ol>

      <!-- Continue CTA -->
      <div class="mt-8">
        <button
          type="button"
          class="w-full md:w-auto inline-flex items-center justify-center h-12 px-6 rounded-button bg-brand text-white font-semibold text-sm hover:bg-brand-press transition-colors"
          @click="onContinue"
        >
          {{ t('results.ctaContinue') }}
        </button>
      </div>
    </template>
  </section>
</template>
