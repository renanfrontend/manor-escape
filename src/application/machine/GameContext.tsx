import { createActorContext } from '@xstate/react'
import { useEffect, type ReactNode } from 'react'
import type { Snapshot } from 'xstate'
import type { KeyValueStorage } from '@/application/ports/storage'
import { gameMachine } from './gameMachine'

const SNAPSHOT_KEY = 'game-snapshot'

export const GameActorContext = createActorContext(gameMachine)

interface GameProviderProps {
  readonly storage: KeyValueStorage
  readonly children: ReactNode
}

/** Restores a persisted run (if any) and keeps saving on every change. */
export const GameProvider = ({ storage, children }: GameProviderProps) => {
  const snapshot = storage.get<Snapshot<unknown>>(SNAPSHOT_KEY)

  return (
    <GameActorContext.Provider options={snapshot ? { snapshot } : {}}>
      <SnapshotPersister storage={storage} />
      {children}
    </GameActorContext.Provider>
  )
}

const SnapshotPersister = ({ storage }: { readonly storage: KeyValueStorage }) => {
  const actor = GameActorContext.useActorRef()

  useEffect(() => {
    const subscription = actor.subscribe((state) => {
      if (state.matches('idle')) {
        storage.remove(SNAPSHOT_KEY)
        return
      }
      storage.set(SNAPSHOT_KEY, actor.getPersistedSnapshot())
    })
    return () => subscription.unsubscribe()
  }, [actor, storage])

  return null
}

export const useGame = GameActorContext.useSelector
export const useGameActor = GameActorContext.useActorRef
