import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type ModuleDetail = components['schemas']['ModuleDetail']

export function useModule(idSource: MaybeRefOrGetter<number | string | undefined>) {
  const id = computed(() => {
    const v = toValue(idSource)
    return v == null ? null : Number(v)
  })

  return useQuery({
    queryKey: computed(() => ['module', id.value] as const),
    enabled: computed(() => id.value != null && !Number.isNaN(id.value)),
    queryFn: async () => {
      const { data } = await api.get<ModuleDetail>(`/modules/${id.value}/`)
      return data
    },
  })
}
