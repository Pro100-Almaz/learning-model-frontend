<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ENT_MAX_SCORE } from '@/features/onboarding/schemas/onboarding'
import { tFn, t } from '@/shared/lib/i18n'

interface Props {
  predicted: number
  target?: number | null
  /** Upper bound of the scale; defaults to ENT_MAX_SCORE (140). */
  max?: number
  /** Visual variant — 'full' for the grant screen hero, 'compact' for dashboard. */
  variant?: 'full' | 'compact'
}

const props = defineProps<Props>()

const max = computed(() => props.max ?? ENT_MAX_SCORE)
const clamped = (v: number): number => Math.max(0, Math.min(max.value, v))
const pct = (v: number): number => (clamped(v) / max.value) * 100

const predictedPct = computed(() => pct(props.predicted))
const targetPct = computed(() =>
  props.target == null ? null : pct(props.target),
)

// Did we hit (or exceed) the target? Drives the "celebratory" color shift.
const isOverTarget = computed(
  () => props.target != null && props.predicted >= props.target,
)

// Animated fill — starts at 0 on mount, then transitions to predictedPct.
const animatedPct = ref(0)
onMounted(() => {
  requestAnimationFrame(() => {
    animatedPct.value = predictedPct.value
  })
})

// If the predicted value mutates after mount (recalculate), reset & re-animate.
watch(predictedPct, (next, prev) => {
  if (prev === undefined || next === prev) return
  animatedPct.value = 0
  requestAnimationFrame(() => {
    animatedPct.value = next
  })
})

const aboveTargetByFmt = tFn<(n: number) => string>('grant.aboveTargetBy')
const gapFmt = tFn<(n: number) => string>('grant.gap')

const statusLine = computed<string | null>(() => {
  if (props.target == null) return null
  const diff = props.predicted - props.target
  if (diff === 0) return t('grant.atTarget')
  if (diff > 0) return aboveTargetByFmt(diff)
  return gapFmt(-diff)
})
</script>

<template>
  <div
    class="trajectory"
    :class="[
      variant === 'compact' ? 'trajectory--compact' : 'trajectory--full',
      isOverTarget ? 'trajectory--over' : '',
    ]"
  >
    <!-- Full variant: numeric callouts above bar -->
    <header
      v-if="variant !== 'compact'"
      class="flex items-start justify-between gap-4 mb-3"
    >
      <div>
        <p class="text-xs uppercase tracking-wider font-semibold text-muted">
          {{ t('grant.predictedHeading') }}
        </p>
        <p
          class="font-display font-bold text-5xl md:text-6xl text-ink tabular-nums leading-none mt-1"
          :class="isOverTarget ? 'text-success' : ''"
          data-tabular
        >
          {{ Math.round(predicted) }}
        </p>
      </div>
      <div v-if="target != null" class="text-right">
        <p class="text-xs uppercase tracking-wider font-semibold text-muted">
          {{ t('grant.targetLabel') }}
        </p>
        <p
          class="font-display font-semibold text-2xl md:text-3xl text-ink tabular-nums leading-none mt-1"
          data-tabular
        >
          {{ target }}
        </p>
      </div>
    </header>

    <!-- Compact variant: single inline line -->
    <div
      v-else
      class="flex items-center justify-between text-xs text-muted mb-1.5"
    >
      <span
        class="font-display font-semibold text-base text-ink tabular-nums"
        :class="isOverTarget ? 'text-success' : ''"
      >
        {{ Math.round(predicted) }}
      </span>
      <span v-if="target != null" class="tabular-nums">
        {{ t('grant.targetLabel') }} {{ target }}
      </span>
    </div>

    <!-- The bar — gradient fill, target marker, position dot -->
    <div
      class="relative w-full bg-hairline rounded-full overflow-visible"
      :class="variant === 'compact' ? 'h-2' : 'h-3'"
      role="progressbar"
      :aria-valuenow="Math.round(predicted)"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="t('grant.predictedHeading')"
    >
      <!-- Fill -->
      <div
        class="trajectory__fill h-full rounded-full"
        :class="isOverTarget ? 'trajectory__fill--over' : ''"
        :style="{ width: animatedPct + '%' }"
      />

      <!-- Position marker — sits at the tip of the fill -->
      <div
        class="trajectory__dot absolute top-1/2 -translate-y-1/2 rounded-full bg-card border-2 transition-[left] duration-700 ease-out"
        :class="[
          variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4',
          isOverTarget ? 'border-success' : 'border-brand',
        ]"
        :style="{ left: `calc(${animatedPct}% - ${variant === 'compact' ? 6 : 8}px)` }"
        aria-hidden="true"
      />

      <!-- Target marker -->
      <template v-if="targetPct != null">
        <div
          class="absolute -top-1 -bottom-1 w-px bg-ink/70"
          :style="{ left: targetPct + '%' }"
          aria-hidden="true"
        />
      </template>
    </div>

    <!-- Status line below — visible in full variant only -->
    <p
      v-if="variant !== 'compact' && statusLine"
      class="mt-3 text-sm font-medium tabular-nums"
      :class="isOverTarget ? 'text-success' : 'text-ink'"
    >
      {{ statusLine }}
    </p>
  </div>
</template>

<style scoped>
.trajectory__fill {
  background-image: linear-gradient(
    to right,
    var(--color-brand) 0%,
    var(--color-ascent) 100%
  );
  transition: width 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

.trajectory__fill--over {
  background-image: linear-gradient(
    to right,
    var(--color-brand) 0%,
    var(--color-success) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .trajectory__fill,
  .trajectory__dot {
    transition: none;
  }
}
</style>
