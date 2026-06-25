<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@clerk/vue'
import { onClickOutside } from '@vueuse/core'
import { useAuthStore } from '@/shared/stores/auth'
import { t } from '@/shared/lib/i18n'

const router = useRouter()
const auth = useAuthStore()
const { signOut } = useAuth()

const open = ref(false)
const rootEl = ref<HTMLDivElement | null>(null)

/**
 * `inBottomNav` items are duplicated by the mobile BottomNav, so we hide them
 * from the burger menu at small widths. At md+ there's no BottomNav, so all
 * items are visible.
 */
const items = [
  { to: '/', label: t('nav.home'), exact: true, inBottomNav: true },
  { to: '/catalog', label: t('nav.topics'), exact: false, inBottomNav: true },
  { to: '/mock', label: t('nav.tests'), exact: false, inBottomNav: true },
  { to: '/analytics', label: t('nav.analytics'), exact: false, inBottomNav: false },
  { to: '/grant', label: t('nav.grant'), exact: false, inBottomNav: false },
  { to: '/profile', label: t('nav.profile'), exact: false, inBottomNav: true },
] as const

function toggle(): void {
  open.value = !open.value
}

function close(): void {
  open.value = false
}

onClickOutside(rootEl, () => {
  if (open.value) close()
})

watch(
  () => router.currentRoute.value.fullPath,
  () => close(),
)

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && open.value) close()
}

async function onLogout(): Promise<void> {
  close()
  auth.logout()
  await signOut.value({ redirectUrl: '/login' })
  await router.replace({ name: 'login' })
}
</script>

<template>
  <div
    ref="rootEl"
    class="relative"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="inline-flex items-center justify-center w-10 h-10 rounded-button text-muted hover:bg-surface hover:text-ink transition-colors"
      :aria-label="open ? t('header.closeMenu') : t('header.openMenu')"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="toggle"
    >
      <svg
        v-if="!open"
        viewBox="0 0 20 20"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M3 6h14M3 10h14M3 14h14" />
      </svg>
      <svg
        v-else
        viewBox="0 0 20 20"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <path d="M5 5l10 10M15 5L5 15" />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 w-60 rounded-card bg-card border border-hairline shadow-elevated overflow-hidden z-50"
      role="menu"
    >
      <nav class="py-1">
        <RouterLink
          v-for="item in items"
          :key="item.to"
          :to="item.to"
          :class="[
            'px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface transition-colors',
            item.inBottomNav ? 'hidden md:block' : 'block',
          ]"
          active-class="bg-surface text-brand"
          :exact-active-class="item.exact ? 'bg-surface text-brand' : ''"
          role="menuitem"
          @click="close"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="border-t border-hairline">
        <div
          v-if="auth.user"
          class="px-4 pt-3 pb-1 text-xs text-muted truncate"
          :title="auth.user.email"
        >
          {{ auth.user.email }}
        </div>
        <button
          type="button"
          class="w-full text-left px-4 py-2.5 text-sm font-medium text-muted hover:bg-surface hover:text-ink transition-colors"
          role="menuitem"
          @click="onLogout"
        >
          {{ t('auth.logout') }}
        </button>
      </div>
    </div>
  </div>
</template>
