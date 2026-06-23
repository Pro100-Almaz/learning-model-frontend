<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'
import { useUiStore } from '@/shared/stores/ui'
import { t } from '@/shared/lib/i18n'

const router = useRouter()
const auth = useAuthStore()
const ui = useUiStore()
const loading = ref(false)

/**
 * Real Google OAuth flow lands in T-005 finalisation once VITE_GOOGLE_CLIENT_ID
 * is provisioned (README blocker #3). Until then this stubs a session so the
 * rest of the app is reachable for development.
 */
async function onGoogleSignIn(): Promise<void> {
  if (loading.value) return
  loading.value = true
  try {
    await new Promise((r) => setTimeout(r, 400))
    auth.setSession({
      access: 'dev-access-token',
      refresh: 'dev-refresh-token',
      user: {
        id: 1,
        email: 'demo@qadam.local',
        first_name: 'Demo',
        is_staff: false,
        onboarding_completed: false,
      },
    })
    await router.replace({ name: 'onboarding' })
  } catch {
    ui.pushToast(t('auth.login.error'), 'danger')
  } finally {
    loading.value = false
  }
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

        <button
          type="button"
          class="mt-6 w-full inline-flex items-center justify-center gap-2.5 h-12 rounded-button bg-brand text-white font-medium hover:bg-brand-press transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          :disabled="loading"
          @click="onGoogleSignIn"
        >
          <svg
            v-if="!loading"
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
          <span v-if="loading">…</span>
          <span v-else>{{ t('auth.login.ctaGoogle') }}</span>
        </button>

        <p class="mt-4 text-xs text-muted text-center">
          T-005 stub — реальный Google OAuth подключается, когда client_id будет
          выдан.
        </p>
      </div>
    </div>
  </main>
</template>
