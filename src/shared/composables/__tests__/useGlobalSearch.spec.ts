import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

vi.mock('@/shared/lib/api', () => ({
  api: { get: vi.fn() },
}))

import { api } from '@/shared/lib/api'
import { useGlobalSearch, type UseGlobalSearch } from '../useGlobalSearch'

function mountSearch(): UseGlobalSearch {
  let captured!: UseGlobalSearch
  const TestComp = defineComponent({
    setup() {
      captured = useGlobalSearch()
      return () => h('div')
    },
  })

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0, staleTime: 0 } },
  })

  mount(TestComp, {
    global: {
      plugins: [createPinia(), [VueQueryPlugin, { queryClient }]],
    },
  })

  return captured
}

describe('useGlobalSearch', () => {
  it('returns empty results when query is empty', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: [] } as never)
    const s = mountSearch()
    await flushPromises()
    expect(s.results.value).toEqual([])
  })

  it('matches modules by title, case-insensitive', async () => {
    vi.mocked(api.get).mockImplementation(async (url) => {
      if (url === '/modules/') {
        return {
          data: [
            { id: 1, title: 'Алгебра', slug: 'algebra', subject: 'profile_math', lesson_count: 0 },
            { id: 2, title: 'Геометрия', slug: 'geometry', subject: 'profile_math', lesson_count: 0 },
          ],
        } as never
      }
      throw new Error(`unexpected ${url}`)
    })
    const s = mountSearch()
    await flushPromises()
    s.query.value = 'алг'
    expect(s.results.value).toHaveLength(1)
    expect(s.results.value[0]).toMatchObject({ kind: 'module', title: 'Алгебра' })
  })

  it('lessons become searchable only after activate() is called', async () => {
    vi.mocked(api.get).mockImplementation(async (url) => {
      if (url === '/modules/') {
        return {
          data: [
            { id: 1, title: 'Алгебра', slug: 'algebra', subject: 'profile_math', lesson_count: 1 },
          ],
        } as never
      }
      if (url === '/modules/1/') {
        return {
          data: {
            id: 1,
            title: 'Алгебра',
            slug: 'algebra',
            order: 1,
            subject: 'profile_math',
            lesson_count: 1,
            lessons: [
              { id: 10, title: 'Логарифмы', order: 1, duration_sec: 300, completed: false },
            ],
          },
        } as never
      }
      throw new Error(`unexpected ${url}`)
    })

    const s = mountSearch()
    await flushPromises()

    // Before activate: only modules are indexed, so a lesson-only query misses.
    s.query.value = 'лог'
    expect(s.results.value).toHaveLength(0)

    // After activate: lesson prefetch fires and the lesson becomes searchable.
    s.activate()
    await flushPromises()
    expect(s.results.value).toHaveLength(1)
    expect(s.results.value[0]).toMatchObject({
      kind: 'lesson',
      title: 'Логарифмы',
      moduleTitle: 'Алгебра',
    })
  })

  it('caps results at 12 to keep the UI tight', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({
      data: Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Модуль ${i + 1}`,
        slug: `m${i + 1}`,
        subject: 'profile_math',
        lesson_count: 0,
      })),
    } as never)
    const s = mountSearch()
    await flushPromises()
    s.query.value = 'модуль'
    expect(s.results.value).toHaveLength(12)
  })
})
