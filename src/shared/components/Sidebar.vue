<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { t } from '@/shared/lib/i18n'

const auth = useAuthStore()

const items = [
  { to: '/', label: t('nav.home') },
  { to: '/catalog', label: t('nav.topics') },
  { to: '/mock', label: t('nav.tests') },
  { to: '/analytics', label: t('analytics.title') },
  { to: '/grant', label: t('grant.title') },
  { to: '/profile', label: t('nav.profile') },
] as const

function onLogout(): void {
  auth.logout()
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-hairline flex flex-col"
    aria-label="Боковая навигация"
  >
    <div class="px-6 pt-7 pb-6">
      <span class="font-display text-2xl font-bold tracking-tight text-ink">
        {{ t('app.name') }}
      </span>
    </div>

    <nav class="flex-1 px-3 space-y-1">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="block px-3 py-2.5 rounded-button text-sm font-medium text-muted hover:bg-surface hover:text-ink transition-colors"
        active-class="bg-surface text-ink"
        :exact-active-class="item.to === '/' ? 'bg-surface text-ink' : ''"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="px-3 pb-6 pt-3 border-t border-hairline">
      <div v-if="auth.user" class="px-3 py-2 text-xs text-muted truncate">
        {{ auth.user.email }}
      </div>
      <button
        type="button"
        class="w-full text-left px-3 py-2.5 rounded-button text-sm font-medium text-muted hover:bg-surface hover:text-ink transition-colors"
        @click="onLogout"
      >
        {{ t('auth.logout') }}
      </button>
    </div>
  </aside>
</template>
