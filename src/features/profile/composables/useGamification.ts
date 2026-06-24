import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type Gamification = components['schemas']['Gamification']

export function useGamification() {
  return useQuery({
    queryKey: ['gamification'] as const,
    queryFn: async () => {
      const { data } = await api.get<Gamification>('/gamification/me/')
      return data
    },
    // Lightweight — re-checked on any test finish (which invalidates this key)
    staleTime: 60_000,
  })
}
