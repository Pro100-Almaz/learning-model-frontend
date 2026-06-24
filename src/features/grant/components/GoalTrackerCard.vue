<script setup lang="ts">
import Trajectory from './Trajectory.vue'
import { t } from '@/shared/lib/i18n'
import type { GoalTracker } from '../composables/useCalculateGrant'

interface Props {
  goal: GoalTracker
}

defineProps<Props>()
</script>

<template>
  <section
    class="rounded-card bg-card border border-hairline shadow-card px-5 py-6 md:px-7 md:py-7"
  >
    <Trajectory
      :predicted="goal.predicted_score ?? 0"
      :target="goal.target_score ?? null"
      variant="full"
    />

    <!--
      Advice block — the narrative heart of the screen.
      The backend already ships the localized advice string (e.g.
      «До цели не хватает 14 — упор на Тригонометрию»). We render that
      verbatim but pull the weakest tag out for emphasis when available.
    -->
    <div
      v-if="goal.advice || goal.weakest_tag"
      class="mt-5 rounded-card bg-surface/60 border border-hairline px-4 py-3.5"
    >
      <p v-if="goal.advice" class="text-sm text-ink leading-relaxed">
        {{ goal.advice }}
      </p>
      <p
        v-if="goal.weakest_tag"
        class="mt-2 text-xs uppercase tracking-wider font-semibold text-ascent"
      >
        {{ t('grant.weakestTag') }}: {{ goal.weakest_tag }}
      </p>
    </div>
  </section>
</template>
