<script setup lang="ts">
import { tFn } from '@/shared/lib/i18n'

interface Props {
  step: number
  total: number
}

const props = defineProps<Props>()

const stepperLabel = tFn<(step: number, total: number) => string>('onboarding.stepperLabel')
</script>

<template>
  <div>
    <div
      class="flex items-center gap-2"
      role="progressbar"
      :aria-valuenow="step"
      aria-valuemin="1"
      :aria-valuemax="total"
    >
      <span
        v-for="i in total"
        :key="i"
        class="flex-1 h-1.5 rounded-full transition-colors duration-200"
        :class="i <= props.step ? 'bg-brand' : 'bg-hairline'"
      />
    </div>
    <p class="mt-2 text-xs text-muted tabular-nums">
      {{ stepperLabel(props.step, props.total) }}
    </p>
  </div>
</template>
