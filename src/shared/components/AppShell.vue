<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import BottomNav from './BottomNav.vue'
import Toaster from './Toaster.vue'

const route = useRoute()

/**
 * Some routes (currently the mock simulator) need the full viewport with no
 * chrome. We swap AppHeader + BottomNav for a bare layout while still keeping
 * the auth guards in `router.beforeEach` doing their job.
 */
const fullscreen = computed(() =>
  route.matched.some((r) => Boolean(r.meta.fullscreen)),
)
</script>

<template>
  <div class="min-h-dvh bg-surface flex flex-col">
    <AppHeader v-if="!fullscreen" />

    <main
      class="flex-1"
      :class="
        fullscreen
          ? 'min-h-dvh'
          : 'pb-[calc(72px+var(--spacing-safe-bottom))] md:pb-0'
      "
    >
      <RouterView v-slot="{ Component }">
        <component :is="Component" />
      </RouterView>
    </main>

    <BottomNav
      v-if="!fullscreen"
      class="md:hidden"
    />
    <Toaster />
  </div>
</template>
