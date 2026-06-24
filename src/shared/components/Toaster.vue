<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/shared/stores/ui'

const ui = useUiStore()
const { toasts } = storeToRefs(ui)

const toneClass = {
  info: 'bg-ink text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
} as const
</script>

<template>
  <div
    class="fixed top-[68px] md:top-[76px] inset-x-0 z-50 flex flex-col items-center gap-2 pointer-events-none px-4"
    role="region"
    aria-live="polite"
  >
    <button
      v-for="t in toasts"
      :key="t.id"
      type="button"
      class="pointer-events-auto px-4 py-2.5 rounded-button text-sm shadow-elevated max-w-[90vw] text-center cursor-pointer"
      :class="toneClass[t.tone]"
      @click="ui.dismissToast(t.id)"
    >
      {{ t.message }}
    </button>
  </div>
</template>
