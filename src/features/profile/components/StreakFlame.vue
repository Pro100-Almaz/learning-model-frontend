<script setup lang="ts">
import { computed } from 'vue'
import { pluralRu } from '@/shared/lib/utils/plural'
import { t } from '@/shared/lib/i18n'

interface Props {
  days: number
  activeToday: boolean
}

const props = defineProps<Props>()

const dayWord = computed(() => pluralRu(props.days, 'день', 'дня', 'дней'))
</script>

<template>
  <div
    class="inline-flex items-center gap-2.5 rounded-card bg-card border border-hairline px-3 py-2"
  >
    <span
      class="w-9 h-9 rounded-full grid place-items-center"
      :class="
        activeToday
          ? 'bg-ascent/15 text-ascent flame-pulse'
          : 'bg-surface text-muted'
      "
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 20 20"
        class="w-5 h-5"
        fill="currentColor"
      >
        <!-- Stylised flame -->
        <path
          d="M10 1.5c1 2.6 3.8 4 3.8 7a3.8 3.8 0 11-7.6 0c0-1.4.6-2.4 1.5-3.2 0 1.4.8 2.3 1.6 2.3.9 0 1.4-.7 1.4-1.7 0-1.4-.7-3-.7-4.4z"
        />
      </svg>
    </span>
    <div class="leading-tight">
      <p class="text-base font-semibold text-ink tabular-nums">
        {{ days }} {{ dayWord }}
      </p>
      <p
        class="text-xs"
        :class="activeToday ? 'text-ascent font-medium' : 'text-muted'"
      >
        {{ activeToday ? t('profile.streakActive') : t('profile.streakInactive') }}
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes flame-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.flame-pulse {
  animation: flame-pulse 2.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .flame-pulse {
    animation: none;
  }
}
</style>
