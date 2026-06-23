<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'

const router = useRouter()
const auth = useAuthStore()

function skipForNow(): void {
  // Dev-only: flip the flag so the rest of the app is reachable.
  auth.patchUser({ onboarding_completed: true })
  void router.replace({ name: 'dashboard' })
}
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-2xl mx-auto">
    <header class="mb-4">
      <p class="text-xs uppercase tracking-wider text-muted">Ticket T-304</p>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink mt-1">
        Онбординг
      </h1>
    </header>
    <div
      class="rounded-card bg-card border border-hairline px-5 py-6 shadow-card text-sm text-muted leading-relaxed"
    >
      <p>
        Мастер из 3 шагов: целевой ВУЗ/специальность, ожидаемые баллы по другим
        предметам, желаемый балл. Скоро.
      </p>
      <button
        type="button"
        class="mt-5 inline-flex items-center justify-center h-11 px-4 rounded-button bg-ink text-white text-sm font-medium hover:opacity-90"
        @click="skipForNow"
      >
        Пропустить для разработки
      </button>
    </div>
  </section>
</template>
