import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/shared/stores/auth'

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

/**
 * Axios instance. Bearer is injected from authStore at request time so logout
 * propagates immediately. The 401 interceptor calls /auth/refresh once, swaps
 * the access token, and retries the original request. A second 401 logs out.
 */
export function createApiClient(baseURL = import.meta.env.VITE_API_BASE_URL): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
  })

  client.interceptors.request.use((config) => {
    const auth = useAuthStore()
    if (auth.accessToken) {
      config.headers.set('Authorization', `Bearer ${auth.accessToken}`)
    }
    return config
  })

  let refreshInFlight: Promise<string | null> | null = null

  async function refreshOnce(): Promise<string | null> {
    const auth = useAuthStore()
    if (!auth.refreshToken) return null
    if (refreshInFlight) return refreshInFlight
    refreshInFlight = (async () => {
      try {
        const { data } = await axios.post<{ access: string }>(
          `${baseURL}/auth/refresh/`,
          { refresh: auth.refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        )
        auth.setAccessToken(data.access)
        return data.access
      } catch {
        auth.logout()
        return null
      } finally {
        refreshInFlight = null
      }
    })()
    return refreshInFlight
  }

  client.interceptors.response.use(
    (r) => r,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined
      if (error.response?.status === 401 && original && !original._retried) {
        original._retried = true
        const newAccess = await refreshOnce()
        if (newAccess) {
          original.headers.set('Authorization', `Bearer ${newAccess}`)
          return client(original)
        }
      }
      return Promise.reject(error)
    },
  )

  return client
}

export const api = createApiClient()
