/** Port: any key/value persistence (localStorage, IndexedDB wrapper, in-memory for tests). */
export interface KeyValueStorage {
  get<T>(key: string): T | null
  set<T>(key: string, value: T): void
  remove(key: string): void
}
