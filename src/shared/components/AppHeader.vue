<script setup lang="ts">
import { RouterLink } from 'vue-router'
import SearchBar from './SearchBar.vue'
import AppMenu from './AppMenu.vue'
import { t } from '@/shared/lib/i18n'
</script>

<template>
  <header
    class="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-hairline"
  >
    <div
      class="h-14 md:h-16 px-4 md:px-6 flex items-center gap-4 max-w-screen-xl mx-auto"
    >
      <!-- Brand (left) -->
      <RouterLink
        :to="{ name: 'dashboard' }"
        class="shrink-0 font-display text-xl md:text-2xl font-bold tracking-tight text-ink"
        :aria-label="t('app.name')"
      >
        {{ t('app.name') }}
      </RouterLink>

      <!--
        Search (centered, desktop only).
        Hidden on mobile — BottomNav already covers primary navigation, and
        global search adds chrome without enough payoff at small widths.
        The flex-1 wrapper stays so AppMenu stays anchored to the right.
      -->
      <div class="flex-1 min-w-0 flex justify-center">
        <SearchBar class="hidden md:block w-full max-w-md" />
      </div>

      <!-- Menu (right) -->
      <AppMenu class="shrink-0" />
    </div>
  </header>
</template>
