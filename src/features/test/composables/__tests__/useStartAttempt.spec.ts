import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, type Ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

vi.mock('@/shared/lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}))

import { api } from '@/shared/lib/api'
import { useStartAttempt, type AttemptStart } from '../useStartAttempt'

interface Captured {
  mutateAsync: ReturnType<typeof useStartAttempt>['mutateAsync']
  isPending: Ref<boolean>
  isError: Ref<boolean>
  data: Ref<AttemptStart | undefined>
}

function mountMutation(): Captured {
  let captured!: Captured
  const TestComp = defineComponent({
    setup() {
      const m = useStartAttempt()
      captured = {
        mutateAsync: m.mutateAsync,
        isPending: m.isPending,
        isError: m.isError,
        data: m.data,
      }
      return () => h('div')
    },
  })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  mount(TestComp, {
    global: {
      plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
    },
  })

  return captured
}

describe('useStartAttempt', () => {
  it('POSTs /attempts/ with test_id and returns AttemptStart', async () => {
    const payload: AttemptStart = {
      attempt_id: 42,
      started_at: '2026-06-24T10:00:00Z',
      test: { id: 7, type: 'micro', title: 'T-1', time_limit_sec: null, question_count: 3 },
      questions: [],
    }
    vi.mocked(api.post).mockResolvedValueOnce({ data: payload } as never)

    const m = mountMutation()
    const result = await m.mutateAsync(7)
    await flushPromises()

    expect(api.post).toHaveBeenCalledWith('/attempts/', { test_id: 7 })
    expect(result).toEqual(payload)
    expect(m.data.value).toEqual(payload)
  })

  it('surfaces server error via isError', async () => {
    vi.mocked(api.post).mockRejectedValueOnce(new Error('500'))
    const m = mountMutation()
    await expect(m.mutateAsync(7)).rejects.toThrow('500')
    await flushPromises()
    expect(m.isError.value).toBe(true)
  })
})
