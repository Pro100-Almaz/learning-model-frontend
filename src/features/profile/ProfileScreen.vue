<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGamification } from './composables/useGamification'
import XPBar from './components/XPBar.vue'
import StreakFlame from './components/StreakFlame.vue'
import LevelBadge from './components/LevelBadge.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { useAuthStore } from '@/shared/stores/auth'
import { t } from '@/shared/lib/i18n'

const router = useRouter()
const auth = useAuthStore()

const { data: gam, isPending, isError, error, refetch } = useGamification()

function onLogout(): void {
  auth.logout()
  void router.replace({ name: 'login' })
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto pb-24">
    <header class="mb-6 flex items-start justify-between gap-3 flex-wrap">
      <div>
        <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
          {{ t('profile.title') }}
        </h1>
        <p v-if="auth.user" class="mt-1 text-sm text-muted">
          {{ auth.user.email }}
        </p>
      </div>
      <LevelBadge
        v-if="gam"
        :code="gam.level_code"
        :label="gam.level_label"
        size="md"
      />
    </header>

    <LoadingSkeleton v-if="isPending" :rows="2" variant="card" />

    <ErrorState
      v-else-if="isError"
      :body="error?.message"
      @retry="refetch()"
    />

    <div v-else-if="gam" class="space-y-4">
      <XPBar
        :total-xp="gam.total_xp ?? 0"
        :xp-to-next="gam.xp_to_next_level ?? 0"
        :level-code="gam.level_code"
        :level-label="gam.level_label"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StreakFlame
          :days="gam.streak?.current ?? 0"
          :active-today="gam.streak?.active_today ?? false"
        />
        <div
          class="rounded-card bg-card border border-hairline px-5 py-3.5 flex items-center justify-between"
        >
          <span class="text-sm text-muted">{{ t('profile.longestStreak') }}</span>
          <span class="text-base font-semibold text-ink tabular-nums">
            {{ gam.streak?.longest ?? 0 }}
          </span>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-8 inline-flex items-center justify-center h-11 px-5 rounded-button text-sm font-medium text-muted hover:text-ink hover:bg-card border border-hairline transition-colors"
      @click="onLogout"
    >
      {{ t('auth.logout') }}
    </button>
  </section>
</template>
