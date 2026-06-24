<script setup lang="ts">
import { computed } from 'vue'
import { useAuth, useClerk } from '@clerk/vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { t } from '@/shared/lib/i18n'

const route = useRoute()
const clerk = useClerk()
const clerkAuth = useAuth()
const auth = useAuthStore()

const redirectUrl = computed(() => {
  const next = typeof route.query.next === 'string' ? route.query.next : '/'
  return next.startsWith('/') ? next : '/'
})

const hasBackendAuthError = computed(() => route.query.auth_error === 'backend')
const ctaLabel = computed(() =>
  clerkAuth.isSignedIn.value ? t('auth.logout') : t('auth.login.ctaGoogle'),
)

async function onAuthClick(): Promise<void> {
  if (clerkAuth.isSignedIn.value) {
    auth.logout()
    await clerkAuth.signOut.value({ redirectUrl: '/login' })
    return
  }

  clerk.value?.openSignIn({
    forceRedirectUrl: redirectUrl.value,
    fallbackRedirectUrl: redirectUrl.value,
  })
}
</script>

<template>
  <main class="min-h-dvh bg-surface flex items-center justify-center px-6">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <p class="font-display text-5xl font-bold tracking-tight text-ink">
          {{ t('app.name') }}
        </p>
        <p class="mt-4 text-base text-muted leading-relaxed">
          {{ t('app.tagline') }}
        </p>
      </div>

      <div
        class="rounded-card bg-card border border-hairline shadow-card px-6 py-7"
      >
        <h1 class="font-display text-xl font-semibold text-ink">
          {{ t('auth.login.heading') }}
        </h1>
        <p class="mt-1 text-sm text-muted">
          {{ t('auth.login.subheading') }}
        </p>

        <p
          v-if="hasBackendAuthError"
          class="mt-4 rounded-button border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
        >
          {{ t('auth.login.error') }}
        </p>

        <button
          type="button"
          class="mt-6 w-full inline-flex items-center justify-center gap-2.5 h-12 rounded-button bg-brand text-white font-medium hover:bg-brand-press transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="!clerk"
          @click="onAuthClick"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 7.1 29.5 5 24 5 16.3 5 9.6 9 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.5 39.9 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.3 5.3C42.5 35.6 44 30.2 44 24c0-1.3-.1-2.4-.4-3.5z"
            />
          </svg>
          <span>{{ ctaLabel }}</span>
        </button>
      </div>
    </div>
  </main>
</template>
