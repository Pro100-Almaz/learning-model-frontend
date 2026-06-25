<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import ProgressBar from '@/shared/components/ProgressBar.vue'
import LevelBadge from './LevelBadge.vue'
import { t, tFn } from '@/shared/lib/i18n'

interface Props {
  totalXp: number
  xpToNext: number
  levelCode?: string
  levelLabel?: string
}

const props = defineProps<Props>()

// Percent within the current level — total XP toward (current + remaining).
const percent = computed(() => {
  const total = props.totalXp + Math.max(0, props.xpToNext)
  if (total === 0) return 0
  return (props.totalXp / total) * 100
})

const toNextText = tFn<(n: number) => string>('profile.xpToNext')

// XP gain animation — when totalXp grows between fetches, briefly float a +N badge.
const delta = ref<number | null>(null)
watch(
  () => props.totalXp,
  (next, prev) => {
    if (typeof prev === 'number' && next > prev) {
      delta.value = next - prev
      window.setTimeout(() => (delta.value = null), 1600)
    }
  },
)
</script>

<template>
  <div
    class="relative rounded-card bg-card border border-hairline shadow-card px-5 py-4 overflow-hidden"
  >
    <div class="flex items-center justify-between gap-3 mb-3">
      <LevelBadge
        :code="levelCode"
        :label="levelLabel ?? t('profile.noLevel')"
      />
      <p class="text-xs text-muted tabular-nums">
        {{ toNextText(Math.max(0, xpToNext)) }}
      </p>
    </div>

    <ProgressBar
      :percent="percent"
      tone="brand"
      :label="t('profile.xp')"
    />

    <p class="mt-3 text-sm text-ink tabular-nums">
      <span class="font-display font-bold text-lg">{{ totalXp }}</span>
      <span class="text-muted ml-1">XP</span>
    </p>

    <!-- XP-gain float-up — fires when totalXp increases between renders -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-700 ease-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <span
        v-if="delta !== null"
        class="absolute right-5 bottom-4 text-sm font-bold text-success tabular-nums"
        aria-live="polite"
      >
        +{{ delta }} XP
      </span>
    </Transition>
  </div>
</template>
