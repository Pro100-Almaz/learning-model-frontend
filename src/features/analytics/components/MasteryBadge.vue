<script setup lang="ts">
import { computed } from 'vue'
import type { MasteryLevel } from '@/shared/lib/utils/mastery'
import { t } from '@/shared/lib/i18n'

interface Props {
  level: MasteryLevel
  size?: 'sm' | 'md'
}

const { level, size = 'sm' } = defineProps<Props>()

const labelKey = computed(() => `mastery.${level}`)

const toneClass = computed<string>(() => {
  switch (level) {
    case 'mastered':
      return 'bg-success/10 text-success'
    case 'confident':
      return 'bg-brand/10 text-brand'
    case 'familiar':
      return 'bg-ascent/10 text-ascent'
    case 'untouched':
    default:
      return 'bg-surface text-muted border border-hairline'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-semibold tracking-wide"
    :class="[
      toneClass,
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
    ]"
  >
    {{ t(labelKey) }}
  </span>
</template>
