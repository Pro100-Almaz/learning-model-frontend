<script setup lang="ts">
import { RouterView } from 'vue-router'
import BottomNav from './BottomNav.vue'
import Sidebar from './Sidebar.vue'
import Toaster from './Toaster.vue'
</script>

<template>
  <div class="min-h-dvh bg-surface">
    <Sidebar class="hidden md:flex" />

    <main
      class="md:ml-64 min-h-dvh pb-[calc(72px+var(--spacing-safe-bottom))] md:pb-0"
    >
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <BottomNav class="md:hidden" />
    <Toaster />
  </div>
</template>
