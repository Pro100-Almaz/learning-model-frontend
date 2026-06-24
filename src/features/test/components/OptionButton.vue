<script setup lang="ts">
type OptionState = 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled'

interface Props {
  text: string
  state: OptionState
}

const props = defineProps<Props>()

const isClickable = (): boolean => props.state === 'idle' || props.state === 'selected'
</script>

<template>
  <button
    type="button"
    class="w-full text-left rounded-card border-2 px-4 py-3.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    :class="{
      'border-hairline bg-card text-ink hover:border-brand/40 cursor-pointer':
        state === 'idle',
      'border-brand bg-brand/5 text-ink cursor-pointer': state === 'selected',
      'border-success bg-success/8 text-success cursor-default': state === 'correct',
      'border-danger bg-danger/8 text-danger cursor-default': state === 'wrong',
      'border-hairline bg-card text-muted cursor-default opacity-60':
        state === 'disabled',
    }"
    :disabled="!isClickable()"
    :aria-pressed="state === 'selected'"
  >
    <div class="flex items-center gap-3">
      <!-- State indicator -->
      <span
        class="shrink-0 w-5 h-5 rounded-full border-2 grid place-items-center transition-colors duration-150"
        :class="{
          'border-hairline bg-transparent': state === 'idle' || state === 'disabled',
          'border-brand bg-brand': state === 'selected',
          'border-success bg-success': state === 'correct',
          'border-danger bg-danger': state === 'wrong',
        }"
        aria-hidden="true"
      >
        <svg
          v-if="state === 'selected'"
          class="w-2.5 h-2.5 text-white"
          viewBox="0 0 8 8"
        >
          <circle cx="4" cy="4" r="3" fill="currentColor" />
        </svg>
        <svg
          v-else-if="state === 'correct'"
          class="w-3 h-3 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12l5 5L20 7" />
        </svg>
        <svg
          v-else-if="state === 'wrong'"
          class="w-3 h-3 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
          stroke-linecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </span>

      <span class="text-sm font-medium leading-snug">{{ text }}</span>
    </div>
  </button>
</template>
