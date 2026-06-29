<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
  getQuestions,
  type GeneratedQuestions,
} from '@/features/assessments/composables/useAssessments'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const route = useRoute()

const result = ref<GeneratedQuestions | null>(null)
const isLoading = ref(true)
const errorMessage = ref<string | null>(null)

let intervalId: number | undefined

const jobId = computed(() => {
  return Number(route.params.jobId)
})

const isFinished = computed(
  () => result.value?.status === 'succeeded' || result.value?.status === 'partial',
)
const isFailed = computed(
  () => result.value?.status === 'failed' || result.value?.status === 'cancelled',
)

async function fetchQuestions() {
  try {
    const data = await getQuestions(jobId.value)
    result.value = data

    if (isFinished.value) {
      isLoading.value = false
      stopPolling()
    }

    if (isFailed.value) {
      isLoading.value = false
      errorMessage.value = 'Question generation failed. Please try again.'
      stopPolling()
    }
  } catch (error) {
    isLoading.value = false
    errorMessage.value = 'Failed to load generated questions'
    stopPolling()
    console.error(error)
  }
}

function startPoling() {
  fetchQuestions()

  intervalId = window.setInterval(() => {
    fetchQuestions()
  }, 5000)
}

function stopPolling() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = undefined
  }
}

onMounted(() => {
  startPoling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<template>
  <div>
    <div v-if="isLoading">
      <p v-if="result">
        Created: {{ result.created_count }}/ Skipped: {{ result.skipped_count }}/ Failed:
        {{ result.failed_count }}
      </p>
    </div>

    <div v-else-if="errorMessage">
      <p class="text-red-500">
        {{ errorMessage }}
      </p>
    </div>

    <div v-else-if="isFinished && result" class="space-y-6">
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
        Generated Questions
      </h1>

      <div
        v-for="question in result.questions"
        :key="question.id"
        class="mt-6 rounded-lg border p-4 bg-purple-400"
      >
        <p class="font-semibold text-ink">
          {{ question.text }}
        </p>

        <div class="mt-3 space-y-2">
          <button
            v-for="option in question.options"
            :key="option.id"
            type="button"
            class="block w-full rounded border px-4 py-2 text-left bg-amber-500"
          >
            {{ option.text }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
