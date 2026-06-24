import { useMutation } from '@tanstack/vue-query'
import { api } from '@/shared/lib/api'

interface SubmitAnswerVars {
  attemptId: number
  questionId: number
  optionId: number
}

interface SubmitAnswerResult {
  /** null for mock tests — feedback is withheld until finish. */
  is_correct: boolean | null
  xp_awarded: number
}

export function useSubmitAnswer() {
  return useMutation({
    mutationFn: async ({ attemptId, questionId, optionId }: SubmitAnswerVars) => {
      const { data } = await api.post<SubmitAnswerResult>(
        `/attempts/${attemptId}/answer/`,
        { question_id: questionId, option_id: optionId },
      )
      return data
    },
  })
}
