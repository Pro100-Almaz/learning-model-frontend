<script setup lang="ts">
defineProps<{
  ticket: string
  title: string
  hint?: string
}>()
</script>

<template>
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto">
    <header class="mb-4">
      <p class="text-xs uppercase tracking-wider text-muted">Ticket {{ ticket }}</p>
      <h1 class="font-display text-3xl md:text-4xl font-bold text-ink mt-1">
        {{ title }}
      </h1>
    </header>
    <div
      class="rounded-card bg-card border border-hairline px-5 py-6 shadow-card text-sm text-muted leading-relaxed"
    >
      <p>
        Этот экран ещё не реализован.
        <span v-if="hint"> — {{ hint }}</span>
      </p>
      <p class="mt-2">
        Контракт и AC см. в <code class="font-mono text-ink">06_Frontend_Spec.md</code> +
        <code class="font-mono text-ink">03_Ticket_Breakdown.md</code> ({{ ticket }}).
      </p>
    </div>
  </section>
</template>
