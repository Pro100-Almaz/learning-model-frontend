<script setup lang="ts">
interface Props {
  /** How many skeleton rows to render. */
  rows?: number
  /**
   * Layout variant:
   *  'card'  — taller block (module cards)
   *  'row'   — compact line  (lesson rows)
   *  'video' — 16:9 aspect-ratio block (video player placeholder)
   */
  variant?: 'card' | 'row' | 'video'
}

const { rows = 3, variant = 'card' } = defineProps<Props>()
</script>

<template>
  <div
    class="space-y-3"
    role="status"
    aria-busy="true"
    aria-label="Загружаем содержимое"
  >
    <div
      v-for="i in rows"
      :key="i"
      class="rounded-card bg-card border border-hairline overflow-hidden"
      :class="{
        'h-24': variant === 'card',
        'h-14': variant === 'row',
        'aspect-video h-auto': variant === 'video',
      }"
    >
      <div
        class="skeleton-shimmer h-full w-full"
        :class="{ 'min-h-40': variant === 'video' }"
      />
    </div>
  </div>
</template>

<style scoped>
.skeleton-shimmer {
  background:
    linear-gradient(
      90deg,
      transparent 0%,
      rgba(110, 107, 133, 0.08) 50%,
      transparent 100%
    ),
    var(--color-surface);
  background-size: 200% 100%, 100% 100%;
  background-repeat: no-repeat;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position:
      -120% 0,
      0 0;
  }
  100% {
    background-position:
      120% 0,
      0 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background:
      linear-gradient(90deg, rgba(110, 107, 133, 0.08), rgba(110, 107, 133, 0.08)),
      var(--color-surface);
  }
}
</style>
