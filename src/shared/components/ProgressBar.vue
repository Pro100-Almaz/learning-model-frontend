<script setup lang="ts">
interface Props {
  /** 0–100; clamped if out of range. */
  percent: number
  /** Visual tone; defaults to brand. */
  tone?: 'brand' | 'success' | 'danger'
  /** Optional ARIA label override (defaults to a generic «прогресс»). */
  label?: string
}

const { percent, tone = 'brand', label } = defineProps<Props>()

const clamped = (): number => Math.max(0, Math.min(100, Math.round(percent)))
</script>

<template>
  <div
    class="h-2 w-full rounded-full bg-hairline overflow-hidden"
    role="progressbar"
    :aria-valuenow="clamped()"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label ?? 'Прогресс'"
  >
    <div
      class="h-full rounded-full transition-[width] duration-300 ease-out"
      :class="{
        'bg-brand': tone === 'brand',
        'bg-success': tone === 'success',
        'bg-danger': tone === 'danger',
      }"
      :style="{ width: `${clamped()}%` }"
    />
  </div>
</template>
