<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import axios from 'axios'
import { useGamification } from '@/features/profile/composables/useGamification'
import { useCalculateGrant } from '@/features/grant/composables/useCalculateGrant'
import { useRecommendations } from '@/features/analytics/composables/useRecommendations'
import Trajectory from '@/features/grant/components/Trajectory.vue'
import StreakFlame from '@/features/profile/components/StreakFlame.vue'
import LevelBadge from '@/features/profile/components/LevelBadge.vue'
import ProgressBar from '@/shared/components/ProgressBar.vue'
import { useAuthStore } from '@/shared/stores/auth'
import { t, tFn } from '@/shared/lib/i18n'

const router = useRouter()
const auth = useAuthStore()

const gamQuery = useGamification()
const grantQuery = useCalculateGrant()
const recsQuery = useRecommendations()

const greet = tFn<(name: string) => string>('dashboard.greeting')
const continueWith = tFn<(tag: string) => string>('dashboard.continueWith')

// 409 = no completed math mock yet → hide Trajectory, show "first mock" CTA instead.
const noMockYet = computed(() => {
  if (!grantQuery.isError.value) return false
  return axios.isAxiosError(grantQuery.error.value) && grantQuery.error.value.response?.status === 409
})

const grant = computed(() => grantQuery.data.value ?? null)
const weakest = computed(() => recsQuery.data.value?.[0] ?? null)
const firstWeakLesson = computed(() => weakest.value?.lessons?.[0] ?? null)
const gam = computed(() => gamQuery.data.value ?? null)

// XP percent for the compact bar — total XP within the current level.
const xpPercent = computed(() => {
  if (!gam.value) return 0
  const xp = gam.value.total_xp ?? 0
  const toNext = Math.max(0, gam.value.xp_to_next_level ?? 0)
  const span = xp + toNext
  return span === 0 ? 0 : (xp / span) * 100
})

function goGrant(): void {
  void router.push({ name: 'grant' })
}

function goMock(): void {
  void router.push({ name: 'mock' })
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto pb-24 space-y-5">
    <!-- Greeting row -->
    <header class="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
          {{ greet(auth.user?.first_name ?? 'друг') }}
        </h1>
      </div>
      <StreakFlame
        v-if="gam?.streak"
        :days="gam.streak.current ?? 0"
        :active-today="gam.streak.active_today ?? false"
      />
    </header>

    <!-- XP compact strip -->
    <div
      v-if="gam"
      class="rounded-card bg-card border border-hairline px-5 py-4 shadow-card"
    >
      <div class="flex items-center justify-between gap-3 mb-2">
        <LevelBadge :code="gam.level_code" :label="gam.level_label" />
        <p class="text-xs text-muted tabular-nums">
          <span class="font-display font-semibold text-ink text-base">
            {{ gam.total_xp ?? 0 }}
          </span>
          XP
        </p>
      </div>
      <ProgressBar :percent="xpPercent" tone="brand" />
    </div>

    <!-- Hero: Trajectory compact (if data) OR first-mock CTA (if 409) -->
    <RouterLink
      v-if="grant && !noMockYet"
      :to="{ name: 'grant' }"
      class="block rounded-card bg-card border border-hairline px-5 py-5 shadow-card hover:border-brand/40 hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <Trajectory
        :predicted="grant.predicted_score ?? 0"
        :target="grant.goal?.target_score ?? null"
        variant="compact"
      />
      <p class="mt-3 text-xs uppercase tracking-wider font-semibold text-brand">
        {{ t('dashboard.trajectoryCta') }}
      </p>
    </RouterLink>

    <article
      v-else-if="noMockYet"
      class="rounded-card bg-card border border-hairline shadow-card px-5 py-5"
    >
      <p class="font-display text-lg font-semibold text-ink leading-snug">
        {{ t('dashboard.firstMockCta') }}
      </p>
      <p class="mt-2 text-sm text-muted">{{ t('dashboard.firstMockBody') }}</p>
      <button
        type="button"
        class="mt-4 inline-flex items-center justify-center h-11 px-5 rounded-button bg-brand text-white text-sm font-semibold hover:bg-brand-press transition-colors"
        @click="goMock"
      >
        {{ t('mock.introCta') }}
      </button>
    </article>

    <!-- Weakest tag → first lesson -->
    <RouterLink
      v-if="weakest && firstWeakLesson"
      :to="{ name: 'lesson', params: { id: firstWeakLesson.id } }"
      class="block rounded-card bg-card border border-hairline px-5 py-5 shadow-card hover:border-brand/40 hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <p class="text-xs uppercase tracking-wider font-semibold text-ascent">
        {{ t('dashboard.weakSpotHeading') }}
      </p>
      <p class="mt-1.5 font-display text-lg font-semibold text-ink leading-snug">
        {{ continueWith(weakest.tag?.name ?? '') }}
      </p>
      <p class="mt-2 text-sm text-muted truncate">{{ firstWeakLesson.title }}</p>
    </RouterLink>

    <!-- Browse all -->
    <RouterLink
      :to="{ name: 'catalog' }"
      class="block rounded-card bg-card border border-hairline px-5 py-4 hover:border-brand/40 hover:bg-surface transition-colors group"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-medium text-ink">{{ t('dashboard.browseAll') }}</p>
        <svg
          viewBox="0 0 16 16"
          class="w-4 h-4 text-muted group-hover:text-ink group-hover:translate-x-0.5 transition-all"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M6 4l4 4-4 4" />
        </svg>
      </div>
    </RouterLink>
  </section>
</template>
