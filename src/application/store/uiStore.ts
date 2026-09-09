import { create } from 'zustand'
import { persist, type StateStorage, createJSONStorage } from 'zustand/middleware'
import type { ItemId } from '@/domain'
import type { KeyValueStorage } from '@/application/ports/storage'

export interface Toast {
  readonly id: number
  readonly text: string
  readonly tone: 'info' | 'success' | 'error'
}

export interface BestRun {
  readonly seconds: number
  readonly hintsUsed: number
  readonly finishedAt: string
}

export interface UiState {
  readonly inspectingItem: ItemId | null
  readonly toasts: readonly Toast[]
  readonly reducedMotion: boolean
  readonly bestRun: BestRun | null
  inspectItem: (item: ItemId | null) => void
  notify: (text: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
  setReducedMotion: (value: boolean) => void
  recordRun: (run: BestRun) => void
}

const PERSISTED_KEYS = ['reducedMotion', 'bestRun'] as const satisfies readonly (keyof UiState)[]

const toStateStorage = (storage: KeyValueStorage): StateStorage => ({
  getItem: (name) => storage.get<string>(name),
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.remove(name),
})

let toastSeq = 0

export const createUiStore = (storage: KeyValueStorage) =>
  create<UiState>()(
    persist(
      (set, get) => ({
        inspectingItem: null,
        toasts: [],
        reducedMotion: false,
        bestRun: null,
        inspectItem: (item) => set({ inspectingItem: item }),
        notify: (text, tone = 'info') => {
          const id = ++toastSeq
          set((state) => ({ toasts: [...state.toasts, { id, text, tone }].slice(-3) }))
          setTimeout(() => get().dismissToast(id), 4000)
        },
        dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
        setReducedMotion: (value) => set({ reducedMotion: value }),
        recordRun: (run) =>
          set((state) => ({
            bestRun: state.bestRun && state.bestRun.seconds <= run.seconds ? state.bestRun : run,
          })),
      }),
      {
        name: 'ui',
        storage: createJSONStorage(() => toStateStorage(storage)),
        partialize: (state) =>
          Object.fromEntries(PERSISTED_KEYS.map((key) => [key, state[key]])) as Pick<
            UiState,
            (typeof PERSISTED_KEYS)[number]
          >,
      },
    ),
  )

export type UiStore = ReturnType<typeof createUiStore>
