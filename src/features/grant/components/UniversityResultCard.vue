<script setup lang="ts">
import { computed } from 'vue'
import { t, tFn } from '@/shared/lib/i18n'

interface Props {
  universityName: string
  specialtyName: string
  minScore: number
  margin: number
}

const props = defineProps<Props>()

const isPassing = computed(() => props.margin >= 0)
const isExact = computed(() => props.margin === 0)

const passingByFmt = tFn<(n: number) => string>('grant.passingBy')
const shortByFmt = tFn<(n: number) => string>('grant.shortBy')

const marginLabel = computed(() => {
  if (isExact.value) return t('grant.atThreshold')
  if (isPassing.value) return passingByFmt(props.margin)
  return shortByFmt(Math.abs(props.margin))
})
</script>

<template>
  <article
    class="rounded-card bg-card border border-hairline shadow-card px-5 py-4 flex items-center justify-between gap-4"
  >
    <div class="min-w-0">
      <p class="text-sm font-medium text-ink truncate">
        {{ specialtyName }}
      </p>
      <p class="text-xs text-muted truncate mt-0.5">{{ universityName }}</p>
      <p class="text-xs text-muted mt-1.5 tabular-nums">
        Проходной балл: {{ minScore }}
      </p>
    </div>

    <span
      class="shrink-0 rounded-full px-3 py-1 text-xs font-semibold tabular-nums"
      :class="{
        'bg-success/15 text-success': isPassing && !isExact,
        'bg-brand/15 text-brand': isExact,
        'bg-danger/15 text-danger': !isPassing,
      }"
    >
      {{ marginLabel }}
    </span>
  </article>
</template>
