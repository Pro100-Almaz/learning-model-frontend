import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, type Ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

// Mock the api before the composable picks it up.
vi.mock('@/shared/lib/api', () => ({
  api: { get: vi.fn() },
}))

import { api } from '@/shared/lib/api'
import { useModules, type Module } from '../useModules'

interface Captured {
  data: Ref<Module[] | undefined>
  isPending: Ref<boolean>
  isError: Ref<boolean>
}

function mountWithQuery() {
  let captured!: Captured
  const TestComp = defineComponent({
    setup() {
      const q = useModules()
      captured = {
        data: q.data,
        isPending: q.isPending,
        isError: q.isError,
      }
      return () => h('div')
    },
  })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })

  mount(TestComp, {
    global: {
      plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
    },
  })

  return captured
}

describe('useModules', () => {
  it('hits /modules/ and returns the array', async () => {
    const payload: Module[] = [
      { id: 1, title: 'Алгебра', slug: 'algebra', order: 1, subject: 'profile_math', lesson_count: 3 },
      { id: 2, title: 'Геометрия', slug: 'geometry', order: 2, subject: 'profile_math', lesson_count: 5 },
    ]
    vi.mocked(api.get).mockResolvedValueOnce({ data: payload } as never)

    const q = mountWithQuery()
    await flushPromises()

    expect(api.get).toHaveBeenCalledWith('/modules/')
    expect(q.data.value).toEqual(payload)
    expect(q.isPending.value).toBe(false)
    expect(q.isError.value).toBe(false)
  })

  it('surfaces fetch errors via isError', async () => {
    vi.mocked(api.get).mockRejectedValueOnce(new Error('boom'))

    const q = mountWithQuery()
    await flushPromises()

    expect(q.isError.value).toBe(true)
  })
})
