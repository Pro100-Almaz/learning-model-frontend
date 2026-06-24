import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type AttemptResult = components['schemas']['AttemptResult']

export function useFinishAttempt() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (attemptId: number) => {
      const { data } = await api.post<AttemptResult>(`/attempts/${attemptId}/finish/`)
      return data
    },
    onSuccess: () => {
      // Finishing an attempt can change tag stats, recommendations, XP, level, streak.
      void qc.invalidateQueries({ queryKey: ['analytics'] })
      void qc.invalidateQueries({ queryKey: ['gamification'] })
    },
  })
}
