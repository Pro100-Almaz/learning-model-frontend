<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useModules } from './composables/useModules'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { t } from '@/shared/lib/i18n'
import { pluralRu } from '@/shared/lib/utils/plural'

const { data: modules, isPending, isError, error, refetch } = useModules()

const subjectLabel: Record<string, string> = {
  math_literacy: 'Мат. грамотность',
  profile_math: 'Профильная математика',
}

const pluralLessons = (n: number): string => pluralRu(n, 'урок', 'урока', 'уроков')
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto">
    <header class="mb-6">
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
        {{ t('catalog.title') }}
      </h1>
    </header>

    <RouterLink
      :to="{ name: 'assessments', params: { topic: 'MATH' } }"
      class="block rounded-card bg-card border border-hairline px-5 py-5 shadow-card hover:border-brand/40 hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      MATH
    </RouterLink>

    <LoadingSkeleton v-if="isPending" :rows="3" variant="card" />

    <ErrorState v-else-if="isError" :body="error?.message" @retry="refetch()" />

    <EmptyState
      v-else-if="!modules || modules.length === 0"
      :title="t('catalog.empty')"
      :body="t('catalog.emptyBody')"
    />

    <ul v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <li v-for="m in modules" :key="m.id">
        <RouterLink
          :to="{ name: 'module', params: { moduleId: m.id } }"
          class="group block rounded-card bg-card border border-hairline px-5 py-4 shadow-card hover:border-brand/40 hover:-translate-y-0.5 hover:shadow-elevated transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <!-- Subject pill -->
          <span
            v-if="m.subject"
            class="inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand/8 text-brand"
          >
            {{ subjectLabel[m.subject] ?? m.subject }}
          </span>

          <p class="mt-2 font-display text-lg font-semibold text-ink leading-snug">
            {{ m.title }}
          </p>

          <p class="mt-2 text-sm text-muted tabular-nums">
            {{ m.lesson_count ?? 0 }}&nbsp;{{ pluralLessons(m.lesson_count ?? 0) }}
          </p>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
