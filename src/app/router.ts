import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import axios from 'axios'
import { api, type components } from '@/shared/lib/api'
import { getClerkBearerToken } from '@/shared/lib/auth/clerkToken'
import { useAuthStore } from '@/shared/stores/auth'

type AuthUser = components['schemas']['User']

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/LoginScreen.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/shared/components/AppShell.vue'),
    children: [
      {
        path: 'onboarding',
        name: 'onboarding',
        component: () => import('@/features/onboarding/OnboardingScreen.vue'),
        meta: { requiresAuth: true, allowUnonboarded: true },
      },
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/features/dashboard/DashboardScreen.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'catalog',
        name: 'catalog',
        component: () => import('@/features/catalog/CatalogScreen.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'catalog/:moduleId',
        name: 'module',
        component: () => import('@/features/catalog/ModuleScreen.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'lesson/:id',
        name: 'lesson',
        component: () => import('@/features/lesson/LessonScreen.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'test/:id',
        name: 'test',
        component: () => import('@/features/test/TestScreen.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'mock',
        name: 'mock',
        component: () => import('@/features/test/MockScreen.vue'),
        meta: { requiresAuth: true, fullscreen: true },
      },
      {
        path: 'mock/:attemptId',
        name: 'mock-attempt',
        component: () => import('@/features/test/MockScreen.vue'),
        meta: { requiresAuth: true, fullscreen: true },
        props: true,
      },
      {
        path: 'results/:attemptId',
        name: 'results',
        component: () => import('@/features/results/ResultsScreen.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: () => import('@/features/analytics/AnalyticsScreen.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'grant',
        name: 'grant',
        component: () => import('@/features/grant/GrantScreen.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/features/profile/ProfileScreen.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'assessments',
        name: 'assessments',
        component: () => import('@/features/assessments/Assessments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'generation/jobs/:jobId',
        name: 'generation_job',
        component: () => import('@/features/assessments/GenerationJobScreen.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0 }
  },
})

async function hasClerkSession(): Promise<boolean> {
  const token = await getClerkBearerToken()
  return Boolean(token)
}

async function ensureBackendUser(): Promise<boolean> {
  const auth = useAuthStore()

  if (auth.user) return true

  try {
    const { data } = await api.get<AuthUser>('/auth/me/')
    auth.setUser(data)
    return true
  } catch (error) {
    if (import.meta.env.DEV) {
      if (axios.isAxiosError(error)) {
        console.warn('[auth] /auth/me/ failed', {
          status: error.response?.status,
          detail: error.response?.data,
          message: error.message,
        })
      } else {
        console.warn('[auth] /auth/me/ failed', error)
      }
    }
    auth.logout()
    return false
  }
}

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const isPublic = to.matched.some((m) => m.meta.public)
  const requiresAuth = to.matched.some((m) => m.meta.requiresAuth)
  const allowUnonboarded = to.matched.some((m) => m.meta.allowUnonboarded)
  const isSignedIn = await hasClerkSession()

  if (requiresAuth && !isSignedIn) {
    return { name: 'login', query: to.fullPath !== '/' ? { next: to.fullPath } : undefined }
  }

  if (!isSignedIn) {
    auth.logout()
    return true
  }

  if (requiresAuth || isPublic) {
    const hasUser = await ensureBackendUser()
    if (!hasUser) {
      if (isPublic) return true
      return {
        name: 'login',
        query: {
          next: to.fullPath !== '/' ? to.fullPath : undefined,
          auth_error: 'backend',
        },
      }
    }
  }

  if (isPublic) {
    return auth.isOnboarded ? { name: 'dashboard' } : { name: 'onboarding' }
  }

  if (requiresAuth && !auth.isOnboarded && !allowUnonboarded) {
    return { name: 'onboarding' }
  }

  return true
})
