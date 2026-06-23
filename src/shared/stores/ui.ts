import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Toast {
  id: number
  message: string
  tone: 'info' | 'success' | 'danger'
}

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(false)
  const toasts = ref<Toast[]>([])
  let nextId = 1

  function pushToast(message: string, tone: Toast['tone'] = 'info', timeoutMs = 3500): void {
    const id = nextId++
    toasts.value.push({ id, message, tone })
    if (timeoutMs > 0) {
      setTimeout(() => dismissToast(id), timeoutMs)
    }
  }

  function dismissToast(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { sidebarOpen, toasts, pushToast, dismissToast }
})
