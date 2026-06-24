import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type Module = components['schemas']['Module']

export function useModules() {
  return useQuery({
    queryKey: ['modules'] as const,
    queryFn: async () => {
      const { data } = await api.get<Module[]>('/modules/')
      return data
    },
  })
}
