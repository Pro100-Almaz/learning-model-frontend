import { useQuery } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

export type StudentProfile = components['schemas']['StudentProfile']

export function useProfile() {
  return useQuery({
    queryKey: ['profile'] as const,
    queryFn: async () => {
      const { data } = await api.get<StudentProfile>('/profile/')
      return data
    },
  })
}
