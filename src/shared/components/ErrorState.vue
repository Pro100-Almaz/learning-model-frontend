<script setup lang="ts">
import { t } from '@/shared/lib/i18n'

interface Props {
  /** Headline copy. Defaults to active-voice generic message. */
  title?: string
  /** Optional secondary line — typically the error message in user-friendly terms. */
  body?: string
  /** Hide the retry button if the action isn't recoverable. */
  retryable?: boolean
}

const { retryable = true } = defineProps<Props>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div
    class="rounded-card bg-card border border-hairline px-6 py-10 text-center"
    role="alert"
  >
    <!-- Icon -->
    <div class="mx-auto w-12 h-12 rounded-full bg-danger/8 grid place-items-center mb-4">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-6 h-6 text-danger"
        aria-hidden="true"
      >
        <!-- Triangle warning -->
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line
          x1="12"
          y1="9"
          x2="12"
          y2="13"
        />
        <line
          x1="12"
          y1="17"
          x2="12.01"
          y2="17"
        />
      </svg>
    </div>

    <p class="font-display text-base font-semibold text-ink">
      {{ title ?? t('states.errorDefault') }}
    </p>
    <p class="mt-2 text-sm text-muted leading-relaxed max-w-xs mx-auto">
      {{ body ?? t('states.errorBody') }}
    </p>

    <button
      v-if="retryable"
      type="button"
      class="mt-6 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-button bg-brand text-white text-sm font-medium hover:bg-brand-press transition-colors"
      @click="emit('retry')"
    >
      <svg
        viewBox="0 0 20 20"
        class="w-4 h-4 shrink-0"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 10a6 6 0 1012 0 6 6 0 00-12 0" />
        <path d="M4 4v6h6" />
      </svg>
      {{ t('states.retry') }}
    </button>
  </div>
</template>
