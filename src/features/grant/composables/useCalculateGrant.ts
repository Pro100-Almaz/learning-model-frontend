import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type GrantCalcResult = components['schemas']['GrantCalcResult']
export type QualifyingGrant = components['schemas']['QualifyingGrant']
export type GoalTracker = components['schemas']['GoalTracker']

/**
 * Calls POST /careers/calculate/ via vue-query.
 * Despite being a POST, the endpoint is idempotent — it derives the prediction
 * from existing state (latest mock + profile expected scores). useQuery fits
 * the read-shaped semantics; the parent screen exposes refetch() as a
 * «Пересчитать» action.
 *
 * 409 means "no completed math mock yet" — that's a user-fixable empty state,
 * not an error we should retry.
 */
export function useCalculateGrant() {
  return useQuery({
    queryKey: ['careers', 'calculate'] as const,
    queryFn: async () => {
      const { data } = await api.post<GrantCalcResult>('/careers/calculate/')
      return data
    },
    staleTime: 60_000,
    retry: false,
  })
}
