/**
 * Composition root: the only place where application ports meet
 * infrastructure implementations.
 */
import { createUiStore } from '@/application'
import { createLocalStorageAdapter } from '@/infrastructure/storage/localStorageAdapter'

export const STORAGE_NAMESPACE = 'manor-escape'

export const storage = createLocalStorageAdapter(STORAGE_NAMESPACE)
export const useUiStore = createUiStore(storage)
