import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type Recommendation = components['schemas']['Recommendation']

export function useRecommendations() {
  return useQuery({
    queryKey: ['analytics', 'recommendations'] as const,
    queryFn: async () => {
      const { data } = await api.get<Recommendation[]>('/analytics/recommendations/')
      return data
    },
    staleTime: 30_000,
  })
}
