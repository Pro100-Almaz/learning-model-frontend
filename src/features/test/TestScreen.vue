<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStartAttempt, type AttemptStart } from './composables/useStartAttempt'
import { useSubmitAnswer } from './composables/useSubmitAnswer'
import { useFinishAttempt } from './composables/useFinishAttempt'
import QuestionCard, { type QuestionFeedback } from './components/QuestionCard.vue'
import ProgressBar from '@/shared/components/ProgressBar.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { useUiStore } from '@/shared/stores/ui'
import { t, tFn } from '@/shared/lib/i18n'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()

const testId = computed(() => Number(route.params.id))

const attempt = ref<AttemptStart | null>(null)
const currentIndex = ref(0)
const selectedId = ref<number | null>(null)
const feedback = ref<QuestionFeedback | null>(null)

const startAttempt = useStartAttempt()
const submitAnswer = useSubmitAnswer()
const finishAttempt = useFinishAttempt()

const questions = computed(() => attempt.value?.questions ?? [])
const total = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
const isLast = computed(() => currentIndex.value === total.value - 1)
const isAnswered = computed(() => feedback.value !== null)
const canSubmit = computed(() => selectedId.value !== null && !isAnswered.value && !submitAnswer.isPending.value)

// Progress reflects answered questions, not the current index, so the bar feels earned.
const progressPercent = computed(() => {
  if (total.value === 0) return 0
  const answered = currentIndex.value + (isAnswered.value ? 1 : 0)
  return (answered / total.value) * 100
})

const progressText = tFn<(i: number, n: number) => string>('test.questionProgress')
const xpText = tFn<(n: number) => string>('test.xpGained')

async function start(): Promise<void> {
  try {
    const data = await startAttempt.mutateAsync(testId.value)
    attempt.value = data
    currentIndex.value = 0
    selectedId.value = null
    feedback.value = null
  } catch {
    // surfaced via startAttempt.isError; toast is optional
  }
}

onMounted(() => {
  void start()
})

function onSelect(optionId: number): void {
  if (isAnswered.value) return
  selectedId.value = optionId
}

async function onSubmit(): Promise<void> {
  if (!canSubmit.value || !attempt.value || !currentQuestion.value) return
  const attemptId = attempt.value.attempt_id
  const qId = currentQuestion.value.id
  const optId = selectedId.value
  if (typeof attemptId !== 'number' || typeof qId !== 'number' || optId == null) return

  try {
    const result = await submitAnswer.mutateAsync({
      attemptId,
      questionId: qId,
      optionId: optId,
    })
    // Micro tests: is_correct boolean. Mock tests: null until finish.
    // For this screen (micro), treat null as "no feedback" and just advance.
    if (result.is_correct === null) {
      // Mock-test fallback path — though the route is /test/:id (micro), be defensive.
      goNext()
      return
    }
    feedback.value = {
      isCorrect: result.is_correct,
      selectedId: optId,
    }
    if (result.xp_awarded > 0) {
      ui.pushToast(xpText(result.xp_awarded), 'success', 1500)
    }
  } catch {
    ui.pushToast(t('test.submitError'), 'danger')
  }
}

function goNext(): void {
  selectedId.value = null
  feedback.value = null
  currentIndex.value += 1
}

async function onFinish(): Promise<void> {
  if (!attempt.value) return
  const attemptId = attempt.value.attempt_id
  if (typeof attemptId !== 'number') return
  try {
    await finishAttempt.mutateAsync(attemptId)
    await router.push({ name: 'results', params: { attemptId } })
  } catch {
    ui.pushToast(t('states.errorDefault'), 'danger')
  }
}

function onPrimaryClick(): void {
  if (!isAnswered.value) {
    void onSubmit()
    return
  }
  if (isLast.value) {
    void onFinish()
  } else {
    goNext()
  }
}

const primaryLabel = computed(() => {
  if (!isAnswered.value) return t('test.submit')
  if (isLast.value) return t('test.finish')
  return t('test.next')
})
</script>

<template>
  <section
    class="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto pb-32 md:pb-10"
  >
    <!-- Loading -->
    <template v-if="startAttempt.isPending.value">
      <LoadingSkeleton :rows="1" variant="row" />
      <div class="mt-6">
        <LoadingSkeleton :rows="4" variant="card" />
      </div>
    </template>

    <ErrorState
      v-else-if="startAttempt.isError.value || (!attempt && !startAttempt.isPending.value)"
      :body="t('test.startError')"
      @retry="start"
    />

    <template v-else-if="currentQuestion">
      <!-- Progress header -->
      <header class="mb-6 space-y-2">
        <p class="text-xs uppercase tracking-wider font-semibold text-muted tabular-nums">
          {{ progressText(currentIndex + 1, total) }}
        </p>
        <ProgressBar
          :percent="progressPercent"
          :tone="
            feedback?.isCorrect === true
              ? 'success'
              : feedback?.isCorrect === false
                ? 'danger'
                : 'brand'
          "
        />
      </header>

      <QuestionCard
        :question="currentQuestion"
        :selected-id="selectedId"
        :feedback="feedback"
        @select="onSelect"
      />

      <!-- Feedback line — text companion to the color (color is never sole signal) -->
      <p
        v-if="feedback"
        class="mt-5 text-sm font-medium"
        :class="feedback.isCorrect ? 'text-success' : 'text-danger'"
        role="status"
        aria-live="polite"
      >
        {{ feedback.isCorrect ? t('test.correct') : t('test.incorrect') }}
      </p>

      <!-- Sticky primary CTA -->
      <div class="sticky bottom-4 md:static md:mt-8 z-30 mt-6">
        <button
          type="button"
          class="w-full inline-flex items-center justify-center h-14 px-6 rounded-button font-semibold text-base transition-colors duration-150 shadow-elevated"
          :class="
            canSubmit || isAnswered
              ? 'bg-brand text-white hover:bg-brand-press active:scale-[0.98]'
              : 'bg-card text-muted border border-hairline cursor-not-allowed opacity-60'
          "
          :disabled="(!canSubmit && !isAnswered) || finishAttempt.isPending.value"
          @click="onPrimaryClick"
        >
          {{ primaryLabel }}
        </button>
        <p
          v-if="!isAnswered && !canSubmit"
          class="mt-2 text-xs text-muted text-center"
        >
          {{ t('test.selectAnswer') }}
        </p>
      </div>
    </template>
  </section>
</template>
