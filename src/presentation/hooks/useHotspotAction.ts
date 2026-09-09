import { useCallback } from 'react'
import { canInteract, useGameActor } from '@/application'
import { ITEMS, type Hotspot } from '@/domain'
import { useUiStore } from '@/composition'

export interface InspectTarget {
  readonly title: string
  readonly text: string
}

/** Translates a hotspot click into machine events + UI feedback, keeping RoomScene dumb. */
export const useHotspotAction = (onInspect: (target: InspectTarget) => void) => {
  const actor = useGameActor()
  const notify = useUiStore((s) => s.notify)

  return useCallback(
    (hotspot: Hotspot) => {
      // Read the live snapshot at click time: never act on a render-time closure.
      const { context } = actor.getSnapshot()
      if (!canInteract(context, hotspot)) {
        notify('Nada de interessante aqui... por enquanto.')
        return
      }
      switch (hotspot.kind) {
        case 'inspect':
          onInspect({ title: hotspot.label, text: hotspot.text })
          return
        case 'puzzle':
          actor.send({ type: 'OPEN_PUZZLE', puzzleId: hotspot.puzzleId })
          return
        case 'item':
          if (context.collected.includes(hotspot.itemId)) {
            notify('Você já vasculhou isso.')
            return
          }
          actor.send({ type: 'COLLECT_ITEM', hotspot })
          notify(`${hotspot.foundText} (+ ${ITEMS[hotspot.itemId].name})`, 'success')
          return
        case 'door': {
          const unlocked = hotspot.target !== 'exit' && context.unlockedRooms.includes(hotspot.target)
          const hasKey = context.inventory.includes(hotspot.lockedBy)
          if (!unlocked && !hasKey) {
            notify(hotspot.lockedText, 'error')
            return
          }
          if (!unlocked) notify(`${ITEMS[hotspot.lockedBy].name} gira na fechadura. Clique.`, 'success')
          actor.send({ type: 'USE_DOOR', hotspot })
          return
        }
      }
    },
    [actor, notify, onInspect],
  )
}
