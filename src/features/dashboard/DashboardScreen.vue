<script setup lang="ts">
import { useAuthStore } from '@/shared/stores/auth'
import { t, tFn } from '@/shared/lib/i18n'

const auth = useAuthStore()
const greet = tFn<(name: string) => string>('dashboard.greeting')
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto space-y-6">
    <header>
      <p class="text-xs uppercase tracking-wider text-muted">Ticket T-205+</p>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink mt-1">
        {{ greet(auth.user?.first_name ?? 'друг') }}
      </h1>
    </header>

    <div
      class="rounded-card bg-card border border-hairline px-5 py-5 shadow-card"
    >
      <p class="text-sm text-muted">
        {{ t('dashboard.noTargetCta') }}
      </p>
    </div>

    <div
      class="rounded-card bg-card border border-hairline px-5 py-5 shadow-card"
    >
      <p class="text-sm font-medium text-ink">
        {{ t('dashboard.keepLearning') }}
      </p>
      <p class="text-sm text-muted mt-1">
        Когда появятся уроки и попытки — здесь покажем последний урок.
      </p>
    </div>
  </section>
</template>
