import { useMutation } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type AttemptStart = components['schemas']['AttemptStart']

export function useStartAttempt() {
  return useMutation({
    mutationFn: async (testId: number) => {
      const { data } = await api.post<AttemptStart>('/attempts/', { test_id: testId })
      return data
    },
  })
}
