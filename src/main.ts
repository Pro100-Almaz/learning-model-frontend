import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { clerkPlugin } from '@clerk/vue'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

import App from './App.vue'
import { router } from './app/router'
import { warnIfClerkJwtTemplateMissing } from './shared/lib/auth/clerkToken'
import './styles/main.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

const app = createApp(App)
app.config.devtools = true

warnIfClerkJwtTemplateMissing()

app.use(createPinia())
app.use(clerkPlugin, { publishableKey: PUBLISHABLE_KEY })
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
