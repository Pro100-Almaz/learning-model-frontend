import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { api, type components } from '@/shared/lib/api'

type StudentProfile = components['schemas']['StudentProfile']
type StudentProfileUpdate = components['schemas']['StudentProfileUpdate']

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (patch: StudentProfileUpdate) => {
      const { data } = await api.patch<StudentProfile>('/profile/', patch)
      return data
    },
    onSuccess: (profile) => {
      // Cache the fresh server-side state so the next /profile/ read is instant.
      qc.setQueryData(['profile'], profile)
    },
  })
}
