import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

interface AuthUser {
  id?: number
  email?: string
  first_name?: string
  is_staff?: boolean
  onboarding_completed?: boolean
}

const STORAGE_KEY = 'qadam.auth.v1'

interface PersistedAuth {
  user: AuthUser | null
}

function readPersisted(): PersistedAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null }
    const parsed = JSON.parse(raw) as Partial<PersistedAuth>
    return { user: parsed.user ?? null }
  } catch {
    return { user: null }
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

  const user = ref<AuthUser | null>(persisted.user)

  const isOnboarded = computed(() => !!user.value?.onboarding_completed)

  function setUser(nextUser: AuthUser): void {
    user.value = nextUser
    writePersisted({ user: nextUser })
  }

  function patchUser(patch: Partial<AuthUser>): void {
    if (!user.value) return
    user.value = { ...user.value, ...patch }
    writePersisted({ user: user.value })
  }

  function logout(): void {
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  return {
    user,
    isOnboarded,
    setUser,
    patchUser,
    logout,
  }
})

export type { AuthUser }
