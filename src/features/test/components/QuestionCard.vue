<script setup lang="ts">
import OptionButton from './OptionButton.vue'
import type { components } from '@/shared/lib/api'

type QuestionPublic = components['schemas']['QuestionPublic']

export interface QuestionFeedback {
  /** True if the user picked the correct option. */
  isCorrect: boolean
  /** The option id the user selected. */
  selectedId: number
  /** Optional — only known on the review screen, not during the test. */
  correctId?: number
}

interface Props {
  question: QuestionPublic
  /** Pre-submit selection; ignored once feedback arrives. */
  selectedId: number | null
  /** Set after submit/finish to lock the card and color the options. */
  feedback?: QuestionFeedback | null
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'select', optionId: number): void
}>()

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'

function stateFor(optionId: number): OptionState {
  if (!props.feedback) {
    return props.selectedId === optionId ? 'selected' : 'idle'
  }
  // Post-submit: full reveal only if correctId is known (review screen).
  if (props.feedback.correctId != null && optionId === props.feedback.correctId) {
    return 'correct'
  }
  if (optionId === props.feedback.selectedId) {
    return props.feedback.isCorrect ? 'correct' : 'wrong'
  }
  return 'disabled'
}
</script>

<template>
  <article class="space-y-5">
    <p class="text-base md:text-lg font-semibold text-ink leading-relaxed">
      {{ question.text }}
    </p>

    <img
      v-if="question.image"
      :src="question.image"
      alt=""
      class="max-w-full rounded-card border border-hairline"
      loading="lazy"
    />

    <div class="space-y-2.5">
      <OptionButton
        v-for="opt in question.options ?? []"
        :key="opt.id"
        :text="opt.text ?? ''"
        :state="stateFor(opt.id ?? -1)"
        @click="$emit('select', opt.id ?? -1)"
      />
    </div>
  </article>
</template>
