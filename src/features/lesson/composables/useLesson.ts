import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type Lesson = components['schemas']['Lesson']

export function useLesson(idSource: MaybeRefOrGetter<number | string | undefined>) {
  const id = computed(() => {
    const v = toValue(idSource)
    return v == null ? null : Number(v)
  })

  return useQuery({
    queryKey: computed(() => ['lesson', id.value] as const),
    enabled: computed(() => id.value != null && !Number.isNaN(id.value)),
    queryFn: async () => {
      const { data } = await api.get<Lesson>(`/lessons/${id.value}/`)
      return data
    },
  })
}
