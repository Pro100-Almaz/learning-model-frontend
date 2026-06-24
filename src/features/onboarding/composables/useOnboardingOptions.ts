import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type University = components['schemas']['University']
export type Specialty = components['schemas']['Specialty']

export interface OnboardingOptions {
  universities: University[]
  specialties: Specialty[]
  subjects: string[]
}

export function useOnboardingOptions() {
  return useQuery({
    queryKey: ['onboarding-options'] as const,
    queryFn: async () => {
      const { data } = await api.get<OnboardingOptions>('/profile/onboarding-options/')
      return data
    },
    // Options are catalog-static — cache aggressively to avoid re-fetching mid-flow.
    staleTime: 5 * 60_000,
  })
}
