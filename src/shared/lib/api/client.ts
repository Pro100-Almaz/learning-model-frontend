import axios, { type AxiosInstance } from 'axios'
import { getClerkBearerToken } from '@/shared/lib/auth/clerkToken'

/**
 * Axios instance. Clerk owns session refresh, so each request asks Clerk for the
 * current session JWT and injects it as the bearer token for the backend.
 */
export function createApiClient(baseURL = import.meta.env.VITE_API_BASE_URL): AxiosInstance {
  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
  })

  client.interceptors.request.use(async (config) => {
    const token = await getClerkBearerToken()

    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`)
    } else {
      config.headers.delete('Authorization')
    }

    return config
  })

  return client
}

export const api = createApiClient()
