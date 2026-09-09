import { motion } from 'framer-motion'
import { canInteract, useGame } from '@/application'
import { getRoom, type Hotspot } from '@/domain'
import { useUiStore } from '@/composition'
import { SceneBackdrop } from './SceneBackdrop'

interface RoomSceneProps {
  readonly onHotspot: (hotspot: Hotspot) => void
}

const hotspotState = (
  hotspot: Hotspot,
  ctx: { solved: readonly string[]; collected: readonly string[]; unlockedRooms: readonly string[] },
): 'done' | 'ready' | 'locked' => {
  switch (hotspot.kind) {
    case 'puzzle':
      return ctx.solved.includes(hotspot.puzzleId) ? 'done' : 'ready'
    case 'item':
      return ctx.collected.includes(hotspot.itemId) ? 'done' : 'ready'
    case 'door':
      return hotspot.target !== 'exit' && ctx.unlockedRooms.includes(hotspot.target) ? 'done' : 'ready'
    case 'inspect':
      return 'ready'
  }
}

export const RoomScene = ({ onHotspot }: RoomSceneProps) => {
  const context = useGame((s) => s.context)
  const reducedMotion = useUiStore((s) => s.reducedMotion)
  const room = getRoom(context.room)

  return (
    <motion.section
      key={room.id}
      className="relative mx-auto aspect-[5/3] w-full max-w-5xl overflow-hidden rounded-lg border border-gold-600/30 shadow-2xl"
      aria-label={room.name}
      data-testid={`room-${room.id}`}
      initial={reducedMotion ? false : { opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <SceneBackdrop room={room.id} />

      <div className="absolute inset-x-0 top-0 p-4 sm:p-6">
        <h2 className="font-display text-3xl font-semibold text-gold-300 drop-shadow">{room.name}</h2>
        <p className="mt-1 max-w-md font-display text-base text-parchment-200/80 italic sm:text-lg">
          {room.description}
        </p>
      </div>

      {room.hotspots.map((hotspot) => {
        const state = hotspotState(hotspot, context)
        const visible = canInteract(context, hotspot)
        return (
          <motion.button
            key={hotspot.id}
            type="button"
            onClick={() => onHotspot(hotspot)}
            aria-label={hotspot.label}
            data-testid={`hotspot-${hotspot.id}`}
            data-state={state}
            className={`group absolute flex flex-col items-center justify-end gap-1 rounded-lg border p-2 text-center transition-colors ${
              state === 'done'
                ? 'border-moss-500/60 bg-ink-950/40'
                : visible
                  ? 'border-gold-600/40 bg-ink-950/30 hover:border-gold-300 hover:bg-ink-950/50'
                  : 'border-transparent bg-transparent opacity-60'
            }`}
            style={{
              left: `${hotspot.area.x}%`,
              top: `${hotspot.area.y}%`,
              width: `${hotspot.area.w}%`,
              height: `${hotspot.area.h}%`,
            }}
            whileHover={{ scale: reducedMotion ? 1 : 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl drop-shadow sm:text-5xl" aria-hidden="true">
              {hotspot.glyph}
            </span>
            <span className="rounded bg-ink-950/70 px-2 py-0.5 font-sans text-[10px] tracking-wider text-parchment-200 uppercase sm:text-xs">
              {hotspot.label}
              {state === 'done' && ' ✓'}
            </span>
          </motion.button>
        )
      })}
    </motion.section>
  )
}
