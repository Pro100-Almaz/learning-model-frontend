import { ru, type Dict } from './ru'

let active: Dict = ru

/**
 * Tiny resolver: `t('auth.login.heading')` walks dotted keys; if the leaf is a
 * function (parameterised string), it is returned for the caller to apply.
 *
 * Intentionally minimal — swap for vue-i18n if/when we add Kazakh + plurals.
 */
export function t(path: string): string {
  const keys = path.split('.')
  let node: unknown = active
  for (const k of keys) {
    if (node && typeof node === 'object' && k in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[k]
    } else {
      if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${path}`)
      return path
    }
  }
  if (typeof node === 'string') return node
  if (typeof node === 'function') {
    if (import.meta.env.DEV) console.warn(`[i18n] key is a function — use tFn: ${path}`)
    return path
  }
  return path
}

/** For parameterised dictionary entries: `tFn('grant.advice')(20, 'Тригонометрия')` */
export function tFn<T extends (...args: never[]) => string>(path: string): T {
  const keys = path.split('.')
  let node: unknown = active
  for (const k of keys) {
    if (node && typeof node === 'object' && k in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[k]
    }
  }
  if (typeof node === 'function') return node as T
  throw new Error(`[i18n] tFn requires a function key, got: ${path}`)
}

export function setLocale(dict: Dict): void {
  active = dict
}

export { ru }
