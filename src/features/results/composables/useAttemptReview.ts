import { type MaybeRefOrGetter, toValue, computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type AttemptReview = components['schemas']['AttemptReview']
export type AttemptReviewItem = components['schemas']['AttemptReviewItem']

export function useAttemptReview(idSource: MaybeRefOrGetter<number | string | undefined>) {
  const id = computed(() => {
    const v = toValue(idSource)
    return v == null ? null : Number(v)
  })

  return useQuery({
    queryKey: computed(() => ['attempt-review', id.value] as const),
    enabled: computed(() => id.value != null && !Number.isNaN(id.value)),
    queryFn: async () => {
      const { data } = await api.get<AttemptReview>(`/attempts/${id.value}/review/`)
      return data
    },
  })
}
