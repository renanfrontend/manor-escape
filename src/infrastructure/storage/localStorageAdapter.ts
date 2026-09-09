import type { KeyValueStorage } from '@/application/ports/storage'

const safeStorage = (): Storage | null => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export const createLocalStorageAdapter = (namespace: string): KeyValueStorage => {
  const prefixed = (key: string) => `${namespace}:${key}`
  return {
    get<T>(key: string): T | null {
      const raw = safeStorage()?.getItem(prefixed(key))
      if (raw == null) return null
      try {
        return JSON.parse(raw) as T
      } catch {
        return null
      }
    },
    set<T>(key: string, value: T): void {
      try {
        safeStorage()?.setItem(prefixed(key), JSON.stringify(value))
      } catch {
        /* quota exceeded or private mode: persistence is best-effort */
      }
    },
    remove(key: string): void {
      safeStorage()?.removeItem(prefixed(key))
    },
  }
}

export const createMemoryStorage = (): KeyValueStorage => {
  const map = new Map<string, unknown>()
  return {
    get: <T>(key: string) => (map.has(key) ? (map.get(key) as T) : null),
    set: (key, value) => void map.set(key, value),
    remove: (key) => void map.delete(key),
  }
}
