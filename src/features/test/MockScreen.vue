<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStartAttempt, type AttemptStart } from './composables/useStartAttempt'
import { useSubmitAnswer } from './composables/useSubmitAnswer'
import { useFinishAttempt } from './composables/useFinishAttempt'
import QuestionCard from './components/QuestionCard.vue'
import Timer from './components/Timer.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { useUiStore } from '@/shared/stores/ui'
import { t, tFn } from '@/shared/lib/i18n'

/**
 * Mock simulator — full-screen, timed, distraction-free.
 *
 * Differences from TestScreen:
 *  • `is_correct` is null per the contract — no inline feedback.
 *  • Question navigation grid lets the user jump around.
 *  • Timer drives auto-finish on expiry.
 *  • sessionStorage persists attempt state so a refresh resumes the run.
 *
 * Contract gap (flagged for backend): there is no GET /attempts/{id}/ to
 * recover questions server-side, so we rely on sessionStorage as a v1 hack.
 */

const router = useRouter()
const ui = useUiStore()

// Hard-coded test_id for the mock — in a real flow the user picks a mock test,
// but the contract doesn't yet expose a "list of mock tests" endpoint.
// Prism returns shape-conformant data regardless of which test_id we POST.
const MOCK_TEST_ID = 1

const SESSION_KEY = 'qadam.mock.v1'

interface PersistedMock {
  attempt: AttemptStart
  answers: Record<number, number> // question_id → option_id
}

function loadPersisted(): PersistedMock | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedMock
  } catch {
    return null
  }
}

function savePersisted(state: PersistedMock): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state))
  } catch {
    // ignore quota / private-mode errors
  }
}

function clearPersisted(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

const startAttempt = useStartAttempt()
const submitAnswer = useSubmitAnswer()
const finishAttempt = useFinishAttempt()

const attempt = ref<AttemptStart | null>(null)
const answers = ref<Record<number, number>>({})
const currentIndex = ref(0)
const finishing = ref(false)

const questions = computed(() => attempt.value?.questions ?? [])
const total = computed(() => questions.value.length)
const currentQuestion = computed(() => questions.value[currentIndex.value] ?? null)
const currentSelected = computed<number | null>(() => {
  const q = currentQuestion.value
  if (!q || q.id == null) return null
  return answers.value[q.id] ?? null
})

const answeredCount = computed(() => Object.keys(answers.value).length)
const progressText = tFn<(i: number, n: number) => string>('test.questionProgress')

async function ensureAttempt(): Promise<void> {
  const cached = loadPersisted()
  if (cached?.attempt?.attempt_id != null) {
    attempt.value = cached.attempt
    answers.value = cached.answers
    return
  }
  const data = await startAttempt.mutateAsync(MOCK_TEST_ID)
  attempt.value = data
  answers.value = {}
  savePersisted({ attempt: data, answers: {} })

  // Reflect the attempt_id in the URL so a refresh hits the same nominal route.
  if (typeof data.attempt_id === 'number') {
    void router.replace({ name: 'mock-attempt', params: { attemptId: data.attempt_id } })
  }
}

onMounted(() => {
  void ensureAttempt()
})

function persist(): void {
  if (attempt.value) {
    savePersisted({ attempt: attempt.value, answers: answers.value })
  }
}

async function onSelect(optionId: number): Promise<void> {
  const q = currentQuestion.value
  const a = attempt.value
  if (!q || !a || typeof q.id !== 'number' || typeof a.attempt_id !== 'number') return

  answers.value = { ...answers.value, [q.id]: optionId }
  persist()

  // Fire-and-forget submission — mock returns null is_correct, no UI signal.
  try {
    await submitAnswer.mutateAsync({
      attemptId: a.attempt_id,
      questionId: q.id,
      optionId,
    })
  } catch {
    // Defer error surfacing to finish-time. Don't break the flow on a single answer.
  }
}

function goPrev(): void {
  if (currentIndex.value > 0) currentIndex.value -= 1
}

function goNext(): void {
  if (currentIndex.value < total.value - 1) currentIndex.value += 1
}

function goTo(i: number): void {
  if (i >= 0 && i < total.value) currentIndex.value = i
}

let finishTriggered = false
async function finish(): Promise<void> {
  if (finishTriggered) return
  finishTriggered = true
  finishing.value = true
  const a = attempt.value
  if (!a || typeof a.attempt_id !== 'number') {
    finishing.value = false
    return
  }
  try {
    await finishAttempt.mutateAsync(a.attempt_id)
    clearPersisted()
    await router.replace({ name: 'results', params: { attemptId: a.attempt_id } })
  } catch {
    ui.pushToast(t('states.errorDefault'), 'danger')
    finishing.value = false
    finishTriggered = false
  }
}

async function onFinishClick(): Promise<void> {
  if (typeof window !== 'undefined' && !window.confirm(t('mock.finishConfirm'))) return
  await finish()
}

function onExit(): void {
  if (typeof window !== 'undefined' && !window.confirm(t('mock.exitConfirm'))) return
  clearPersisted()
  void router.push({ name: 'dashboard' })
}

function onTimerExpire(): void {
  ui.pushToast(t('mock.timeIsUp'), 'danger', 4000)
  void finish()
}

function isAnswered(qid: number | undefined): boolean {
  return qid != null && qid in answers.value
}
</script>

<template>
  <div class="min-h-dvh bg-surface flex flex-col">
    <!-- Top bar — Timer + exit + counter -->
    <header
      class="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-hairline"
    >
      <div
        class="px-4 md:px-6 h-14 md:h-16 max-w-3xl mx-auto flex items-center justify-between gap-3"
      >
        <button
          type="button"
          class="inline-flex items-center justify-center h-10 px-3 rounded-button text-sm font-medium text-muted hover:text-ink hover:bg-surface transition-colors"
          @click="onExit"
        >
          {{ t('mock.exit') }}
        </button>

        <Timer
          v-if="attempt?.started_at && (attempt.test?.time_limit_sec ?? 0) > 0"
          :started-at="attempt.started_at"
          :limit-sec="attempt.test?.time_limit_sec ?? 0"
          @expire="onTimerExpire"
        />
        <p
          v-else-if="attempt"
          class="text-xs uppercase tracking-wider font-semibold text-muted tabular-nums"
        >
          {{ t('mock.title') }}
        </p>

        <p class="text-xs text-muted tabular-nums shrink-0">
          {{ progressText(currentIndex + 1, total || 1) }}
        </p>
      </div>
    </header>

    <main class="flex-1 px-4 md:px-6 py-5 max-w-3xl w-full mx-auto pb-32 md:pb-24">
      <LoadingSkeleton v-if="startAttempt.isPending.value && !attempt" :rows="4" variant="card" />

      <ErrorState
        v-else-if="startAttempt.isError.value && !attempt"
        :body="t('test.startError')"
        @retry="ensureAttempt"
      />

      <template v-else-if="currentQuestion">
        <QuestionCard
          :question="currentQuestion"
          :selected-id="currentSelected"
          :feedback="null"
          @select="onSelect"
        />

        <!-- Question nav grid -->
        <nav class="mt-8" :aria-label="t('mock.navHeading')">
          <p class="text-xs uppercase tracking-wider font-semibold text-muted mb-2">
            {{ t('mock.navHeading') }}
          </p>
          <ul class="flex flex-wrap gap-2">
            <li v-for="(q, i) in questions" :key="q.id ?? i">
              <button
                type="button"
                class="w-9 h-9 rounded-button text-xs font-semibold tabular-nums transition-colors"
                :class="{
                  'bg-brand text-white': i === currentIndex,
                  'bg-success/15 text-success border border-success/30':
                    i !== currentIndex && isAnswered(q.id ?? undefined),
                  'bg-card text-muted border border-hairline hover:border-brand/40':
                    i !== currentIndex && !isAnswered(q.id ?? undefined),
                }"
                @click="goTo(i)"
              >
                {{ i + 1 }}
              </button>
            </li>
          </ul>
          <p class="mt-2 text-xs text-muted tabular-nums">
            {{ answeredCount }} / {{ total }}
          </p>
        </nav>
      </template>
    </main>

    <!-- Sticky bottom: Prev / Next / Finish -->
    <footer
      v-if="currentQuestion"
      class="sticky bottom-0 z-30 bg-card/95 backdrop-blur border-t border-hairline pb-[var(--spacing-safe-bottom)]"
    >
      <div
        class="px-4 md:px-6 py-3 max-w-3xl mx-auto flex items-center justify-between gap-3"
      >
        <button
          type="button"
          class="h-12 px-4 rounded-button bg-card border border-hairline text-sm font-medium text-ink hover:bg-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="currentIndex === 0"
          @click="goPrev"
        >
          {{ t('mock.prev') }}
        </button>

        <button
          v-if="currentIndex < total - 1"
          type="button"
          class="flex-1 h-12 px-4 rounded-button bg-brand text-white text-sm font-semibold hover:bg-brand-press transition-colors"
          @click="goNext"
        >
          {{ t('mock.next') }}
        </button>
        <button
          v-else
          type="button"
          class="flex-1 h-12 px-4 rounded-button bg-success text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          :disabled="finishing"
          @click="onFinishClick"
        >
          {{ t('mock.finish') }}
        </button>
      </div>
    </footer>
  </div>
</template>
