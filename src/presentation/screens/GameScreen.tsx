import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useGame } from '@/application'
import { Hud } from '@/presentation/components/Hud'
import { Inventory } from '@/presentation/components/Inventory'
import { Modal } from '@/presentation/components/Modal'
import { useHotspotAction, type InspectTarget } from '@/presentation/hooks/useHotspotAction'
import { PuzzleModal } from '@/presentation/puzzles/PuzzleModal'
import { RoomScene } from '@/presentation/rooms/RoomScene'

export const GameScreen = () => {
  const room = useGame((s) => s.context.room)
  const activePuzzle = useGame((s) => (s.matches({ playing: 'solving' }) ? s.context.activePuzzle : null))
  const [inspecting, setInspecting] = useState<InspectTarget | null>(null)
  const onHotspot = useHotspotAction(setInspecting)
  const closeInspect = useCallback(() => setInspecting(null), [])

  return (
    <motion.div
      className="flex min-h-screen flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hud />
      <div className="flex flex-1 items-center px-3 py-4 sm:px-6">
        <AnimatePresence mode="wait">
          <RoomScene key={room} onHotspot={onHotspot} />
        </AnimatePresence>
      </div>
      <Inventory />

      <AnimatePresence>
        {inspecting && (
          <Modal key="inspect" title={inspecting.title} onClose={closeInspect} testId="inspect-modal">
            <p className="font-display text-xl whitespace-pre-line text-parchment-200">{inspecting.text}</p>
          </Modal>
        )}
        {activePuzzle && <PuzzleModal key={activePuzzle} puzzleId={activePuzzle} />}
      </AnimatePresence>
    </motion.div>
  )
}
