<script setup lang="ts">
interface Props {
  title: string
  body?: string
  ctaLabel?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'cta'): void
}>()
</script>

<template>
  <div
    class="rounded-card bg-card border border-hairline px-6 py-10 text-center"
    role="status"
  >
    <!-- Icon -->
    <div class="mx-auto w-12 h-12 rounded-full bg-brand/8 grid place-items-center mb-4">
      <svg
        viewBox="0 0 24 24"
        class="w-6 h-6 text-brand/60"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2a7 7 0 100 14A7 7 0 0012 2z" />
        <path d="M12 16v6M8 20h8" />
      </svg>
    </div>

    <p class="font-display text-base font-semibold text-ink">
      {{ title }}
    </p>
    <p
      v-if="body"
      class="mt-2 text-sm text-muted leading-relaxed max-w-xs mx-auto"
    >
      {{ body }}
    </p>
    <button
      v-if="ctaLabel"
      type="button"
      class="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-button bg-brand text-white text-sm font-medium hover:bg-brand-press transition-colors"
      @click="emit('cta')"
    >
      {{ ctaLabel }}
    </button>
  </div>
</template>
