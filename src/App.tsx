import { AnimatePresence } from 'framer-motion'
import { GameProvider, useGame } from '@/application'
import { storage } from '@/composition'
import { Toasts } from '@/presentation/components/Toasts'
import { EndScreen } from '@/presentation/screens/EndScreen'
import { GameScreen } from '@/presentation/screens/GameScreen'
import { TitleScreen } from '@/presentation/screens/TitleScreen'

const Screens = () => {
  const phase = useGame((state) =>
    state.matches('idle') ? 'idle' : state.matches('playing') ? 'playing' : state.matches('won') ? 'won' : 'lost',
  )

  return (
    <AnimatePresence mode="wait">
      {phase === 'idle' && <TitleScreen key="title" />}
      {phase === 'playing' && <GameScreen key="game" />}
      {(phase === 'won' || phase === 'lost') && <EndScreen key="end" outcome={phase} />}
    </AnimatePresence>
  )
}

export const App = () => (
  <GameProvider storage={storage}>
    <main className="min-h-full bg-ink-900 text-parchment-100">
      <Screens />
    </main>
    <Toasts />
  </GameProvider>
)
