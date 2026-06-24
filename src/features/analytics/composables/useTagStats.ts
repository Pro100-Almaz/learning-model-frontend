import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type TagStat = components['schemas']['TagStat']

export function useTagStats() {
  return useQuery({
    queryKey: ['analytics', 'tags'] as const,
    queryFn: async () => {
      const { data } = await api.get<TagStat[]>('/analytics/tags/')
      return data
    },
    staleTime: 30_000,
  })
}
