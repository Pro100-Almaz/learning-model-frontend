<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { t } from '@/shared/lib/i18n'

const items = [
  { to: '/', label: t('nav.home'), icon: 'home' },
  { to: '/catalog', label: t('nav.topics'), icon: 'book' },
  { to: '/mock', label: t('nav.tests'), icon: 'target' },
  { to: '/profile', label: t('nav.profile'), icon: 'user' },
] as const
</script>

<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 bg-card border-t border-hairline pb-[var(--spacing-safe-bottom)]"
    aria-label="Главная навигация"
  >
    <ul class="grid grid-cols-4">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="flex flex-col items-center justify-center gap-1 min-h-[56px] py-2 text-xs text-muted transition-colors"
          active-class="text-brand"
          :exact-active-class="item.to === '/' ? 'text-brand' : ''"
        >
          <span aria-hidden="true" class="w-6 h-6 grid place-items-center">
            <!-- Inline minimal icons. Replace with proper iconography later. -->
            <svg
              v-if="item.icon === 'home'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-5 h-5"
            >
              <path
                d="M3 11l9-8 9 8M5 10v10h14V10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <svg
              v-else-if="item.icon === 'book'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-5 h-5"
            >
              <path
                d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5z"
                stroke-linejoin="round"
              />
              <path d="M8 7h8M8 11h8M8 15h5" stroke-linecap="round" />
            </svg>
            <svg
              v-else-if="item.icon === 'target'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-5 h-5"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="w-5 h-5"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round" />
            </svg>
          </span>
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
