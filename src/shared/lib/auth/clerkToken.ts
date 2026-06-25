import { getToken } from '@clerk/vue'

const JWT_TEMPLATE = import.meta.env.VITE_CLERK_JWT_TEMPLATE

/**
 * Returns the current Clerk session JWT, or null when no session exists.
 * Safe to call from anywhere in the browser — Clerk's own helper waits for
 * SDK init and surfaces transient errors as null.
 *
 * The backend validates tokens against a Clerk JWT template whose claims
 * include email and first_name; that template name is wired through the
 * VITE_CLERK_JWT_TEMPLATE env var.
 */
export async function getClerkBearerToken(): Promise<string | null> {
  try {
    return await getToken(JWT_TEMPLATE ? { template: JWT_TEMPLATE } : undefined)
  } catch {
    // Offline, network glitch, Clerk not yet loaded — caller treats null as
    // "no session" and routes / interceptors fall back to the unauthed path.
    return null
  }
}

export function warnIfClerkJwtTemplateMissing(): void {
  if (import.meta.env.DEV && !JWT_TEMPLATE) {
    console.warn(
      '[clerk] VITE_CLERK_JWT_TEMPLATE is not set. The backend expects tokens minted from a named template; without it /auth/me/ will likely 401.',
    )
  }
}
