import { computed, ref, type Ref, type ComputedRef } from 'vue'
import { useQuery, useQueries } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

type Module = components['schemas']['Module']
type ModuleDetail = components['schemas']['ModuleDetail']

export interface SearchHitModule {
  kind: 'module'
  id: number
  title: string
  subject?: string
}

export interface SearchHitLesson {
  kind: 'lesson'
  id: number
  title: string
  moduleId: number
  moduleTitle: string
}

export type SearchHit = SearchHitModule | SearchHitLesson

const MAX_RESULTS = 12

export interface UseGlobalSearch {
  query: Ref<string>
  results: ComputedRef<SearchHit[]>
  /** True while the modules list is loading. Lesson prefetch is best-effort. */
  isLoading: ComputedRef<boolean>
  /**
   * Call when the search UI is opened/focused. Triggers parallel prefetch of
   * each module's detail so lesson titles become searchable. Idempotent.
   */
  activate: () => void
}

export function useGlobalSearch(): UseGlobalSearch {
  const query = ref('')
  const active = ref(false)

  const modulesQuery = useQuery({
    queryKey: ['modules'] as const,
    queryFn: async () => {
      const { data } = await api.get<Module[]>('/modules/')
      return data
    },
  })

  // Lazily prefetch each module's detail once the user focuses the search input.
  // We piggyback on the existing `['module', id]` cache so the ModuleScreen
  // hits these for free on subsequent navigation.
  const moduleQueries = useQueries({
    queries: computed(() => {
      if (!active.value) return []
      return (modulesQuery.data.value ?? [])
        .filter((m): m is Module & { id: number } => typeof m.id === 'number')
        .map((m) => ({
          queryKey: ['module', m.id] as const,
          queryFn: async () => {
            const { data } = await api.get<ModuleDetail>(`/modules/${m.id}/`)
            return data
          },
          staleTime: 60_000,
        }))
    }),
  })

  const index = computed<SearchHit[]>(() => {
    const modules = modulesQuery.data.value ?? []
    const list: SearchHit[] = []
    modules.forEach((m, i) => {
      if (typeof m.id !== 'number' || !m.title) return
      list.push({ kind: 'module', id: m.id, title: m.title, subject: m.subject })
      const detail = moduleQueries.value[i]?.data as ModuleDetail | undefined
      for (const lesson of detail?.lessons ?? []) {
        if (typeof lesson.id !== 'number' || !lesson.title) continue
        list.push({
          kind: 'lesson',
          id: lesson.id,
          title: lesson.title,
          moduleId: m.id,
          moduleTitle: m.title,
        })
      }
    })
    return list
  })

  const results = computed<SearchHit[]>(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return []
    return index.value
      .filter((item) => item.title.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
  })

  const isLoading = computed(() => modulesQuery.isPending.value)

  function activate(): void {
    active.value = true
  }

  return { query, results, isLoading, activate }
}
