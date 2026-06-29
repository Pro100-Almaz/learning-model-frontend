<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { generateQuestions } from '@/features/assessments/composables/useAssessments'

const router = useRouter()

const selectedTopic = ref<string | null>(null)
const isSubmitting = ref(false)
const selectedButtonId = ref<number | null>(null)
const errorMessage = ref<string | null>(null)

const buttons = [
  { id: 1, label: 'Quadratic Equations', value: 'quadratic_equations' },
  { id: 2, label: 'Arithmetic Progression', value: 'arithmetic_progression' },
  { id: 3, label: 'Calculus Integrals', value: 'calculus_integrals' },
]

async function handleGenerateQuestions() {
  if (!selectedTopic.value) {
    errorMessage.value = 'Please select a topic.'
    return
  }

  try {
    isSubmitting.value = true
    errorMessage.value = null

    const job = await generateQuestions({
      topic: selectedTopic.value,
      target_score: 100,
      count: 3,
    })

    router.push({
      name: 'generation_job',
      params: {
        jobId: job.id,
      },
    })
  } catch (error) {
    errorMessage.value = 'Failed to start question generation'
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

function setTopic(topic: string): void {
  selectedTopic.value = topic
}

function selectButton(id: number): void {
  selectedButtonId.value = id
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto">
    <header class="mb-6">
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
        Choose the topic to generate questions for:
      </h1>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <button
        v-for="button in buttons"
        :key="button.id"
        @click="
          selectButton(button.id);
          setTopic(button.value)
        "
        class="rounded-button text-white px-5 py-3.5"
        :class="button.id === selectedButtonId ? 'bg-green-500' : 'bg-mist-500'"
      >
        {{ button.label }}
      </button>
    </div>
  </section>

  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto">
    <button
      type="button"
      class="rounded-button bg-brand text-white px-5 py-3.5"
      @click="handleGenerateQuestions"
    >
      {{ isSubmitting ? 'Starting...' : 'Generate Questions' }}
    </button>
    <p v-if="errorMessage" class="text-red-500">
      {{ errorMessage }}
    </p>
  </section>
</template>
