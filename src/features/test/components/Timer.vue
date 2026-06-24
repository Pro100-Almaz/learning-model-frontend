<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'

interface Props {
  /** ISO timestamp when the attempt started (server-supplied). */
  startedAt: string
  /** Time limit in seconds. */
  limitSec: number
  /** Threshold below which the timer enters its warning state. */
  warnAtSec?: number
}

const props = withDefaults(defineProps<Props>(), {
  warnAtSec: 60,
})

const emit = defineEmits<{
  (e: 'expire'): void
}>()

function computeRemaining(): number {
  const start = new Date(props.startedAt).getTime()
  if (Number.isNaN(start)) return 0
  const elapsedSec = (Date.now() - start) / 1000
  return Math.max(0, props.limitSec - elapsedSec)
}

const remaining = ref(computeRemaining())
let intervalId: ReturnType<typeof setInterval> | null = null
let expired = false

function tick(): void {
  const r = computeRemaining()
  remaining.value = r
  if (r <= 0 && !expired) {
    expired = true
    emit('expire')
    if (intervalId) clearInterval(intervalId)
  }
}

onMounted(() => {
  intervalId = setInterval(tick, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

// Re-anchor when the parent swaps in a different attempt mid-mount.
watchEffect(() => {
  expired = false
  remaining.value = computeRemaining()
})

const display = computed(() => {
  const total = Math.ceil(remaining.value)
  const mm = Math.floor(total / 60)
  const ss = total % 60
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
})

const isWarning = computed(() => remaining.value > 0 && remaining.value < props.warnAtSec)
const isExpired = computed(() => remaining.value <= 0)
</script>

<template>
  <div
    class="inline-flex items-center gap-2 rounded-button px-3 py-1.5 font-display font-bold tabular-nums transition-colors"
    :class="
      isExpired
        ? 'bg-danger/15 text-danger'
        : isWarning
          ? 'bg-danger/10 text-danger'
          : 'bg-surface text-ink'
    "
    role="timer"
    :aria-label="display"
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
      <circle cx="10" cy="11" r="6.5" />
      <path d="M10 7.5V11l2 1.5" />
      <path d="M7.5 3h5" />
    </svg>
    <span class="text-base">{{ display }}</span>
  </div>
</template>
