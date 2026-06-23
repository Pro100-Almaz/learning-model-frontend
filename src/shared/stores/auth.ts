import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface AuthUser {
  id: number
  email: string
  first_name: string
  is_staff: boolean
  onboarding_completed: boolean
}

const STORAGE_KEY = 'qadam.auth.v1'

interface PersistedAuth {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
}

function readPersisted(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { accessToken: null, refreshToken: null, user: null }
    return JSON.parse(raw) as PersistedAuth
  } catch {
    return { accessToken: null, refreshToken: null, user: null }
  }
}

function writePersisted(state: PersistedAuth): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* private mode / quota — fail silently */
  }
}

export const useAuthStore = defineStore('auth', () => {
  const persisted = readPersisted()

  const accessToken = ref<string | null>(persisted.accessToken)
  const refreshToken = ref<string | null>(persisted.refreshToken)
  const user = ref<AuthUser | null>(persisted.user)

  const isAuthed = computed(() => !!accessToken.value && !!user.value)
  const isOnboarded = computed(() => !!user.value?.onboarding_completed)

  function setSession(payload: { access: string; refresh: string; user: AuthUser }): void {
    accessToken.value = payload.access
    refreshToken.value = payload.refresh
    user.value = payload.user
    writePersisted({ accessToken: payload.access, refreshToken: payload.refresh, user: payload.user })
  }

  function setAccessToken(token: string): void {
    accessToken.value = token
    writePersisted({ accessToken: token, refreshToken: refreshToken.value, user: user.value })
  }

  function patchUser(patch: Partial<AuthUser>): void {
    if (!user.value) return
    user.value = { ...user.value, ...patch }
    writePersisted({ accessToken: accessToken.value, refreshToken: refreshToken.value, user: user.value })
  }

  function logout(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthed,
    isOnboarded,
    setSession,
    setAccessToken,
    patchUser,
    logout,
  }
})

export type { AuthUser }
