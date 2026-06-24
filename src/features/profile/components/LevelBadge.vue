<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  code?: string
  label?: string
  /** Visual size variant. */
  size?: 'sm' | 'md'
}

const { code, label, size = 'md' } = defineProps<Props>()

// Map level codes to symbols. Future codes fall back to the brand spark.
const iconByCode: Record<string, 'sprout' | 'spark' | 'star' | 'crown'> = {
  novice: 'sprout',
  znatok: 'star',
  geniy: 'crown',
}

const icon = computed(() => iconByCode[code ?? ''] ?? 'spark')
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full bg-brand/10 text-brand font-semibold tracking-wide"
    :class="size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'"
    :aria-label="label"
  >
    <svg
      v-if="icon === 'sprout'"
      viewBox="0 0 20 20"
      class="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M10 17V8" />
      <path d="M10 8c0-3 2.5-4 5-3-.5 2.5-2 4-5 4z" />
      <path d="M10 11c0-2-2-3-4-2.5.5 2 2 3 4 3z" />
    </svg>
    <svg
      v-else-if="icon === 'star'"
      viewBox="0 0 20 20"
      class="w-3.5 h-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M10 1.6l2.6 5.3 5.9.9-4.3 4.2 1 5.8L10 15l-5.3 2.8 1-5.8L1.5 7.8l5.9-.9z"
      />
    </svg>
    <svg
      v-else-if="icon === 'crown'"
      viewBox="0 0 20 20"
      class="w-3.5 h-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M2 7l3 3 5-6 5 6 3-3v8H2z" />
    </svg>
    <svg
      v-else
      viewBox="0 0 20 20"
      class="w-3.5 h-3.5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M10 1l2.2 5.8L18 8l-5.8 1.2L10 15l-2.2-5.8L2 8l5.8-1.2z"
      />
    </svg>
    <span>{{ label ?? code ?? '' }}</span>
  </span>
</template>
