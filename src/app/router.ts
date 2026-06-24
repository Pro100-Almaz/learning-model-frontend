import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/shared/stores/auth'

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

router.beforeEach((to) => {
  const auth = useAuthStore()
  const isPublic = to.matched.some((m) => m.meta.public)
  const requiresAuth = to.matched.some((m) => m.meta.requiresAuth)
  const allowUnonboarded = to.matched.some((m) => m.meta.allowUnonboarded)

  if (requiresAuth && !auth.isAuthed) {
    return { name: 'login', query: to.fullPath !== '/' ? { next: to.fullPath } : undefined }
  }

  if (auth.isAuthed && isPublic) {
    return auth.isOnboarded ? { name: 'dashboard' } : { name: 'onboarding' }
  }

  if (requiresAuth && auth.isAuthed && !auth.isOnboarded && !allowUnonboarded) {
    return { name: 'onboarding' }
  }

  return true
})
