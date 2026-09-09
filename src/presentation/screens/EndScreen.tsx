import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useGame, useGameActor } from '@/application'
import { useUiStore } from '@/composition'
import { Button } from '@/presentation/components/Button'
import { formatSeconds } from '@/presentation/hooks/useFormattedTime'

interface EndScreenProps {
  readonly outcome: 'won' | 'lost'
}

export const EndScreen = ({ outcome }: EndScreenProps) => {
  const actor = useGameActor()
  const elapsed = useGame((s) => s.context.elapsedSeconds)
  const hintsUsed = useGame((s) => s.context.hintsUsed)
  const recordRun = useUiStore((s) => s.recordRun)
  const won = outcome === 'won'

  useEffect(() => {
    if (won) recordRun({ seconds: elapsed, hintsUsed, finishedAt: new Date().toISOString() })
  }, [won, elapsed, hintsUsed, recordRun])

  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      data-testid={`end-${outcome}`}
    >
      <p className="mb-3 font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">
        {won ? 'Você escapou' : 'O tempo acabou'}
      </p>
      <h1 className="font-display text-5xl font-bold sm:text-7xl">
        {won ? 'A noite volta a respirar.' : 'A mansão o reivindicou.'}
      </h1>
      <p className="mt-6 max-w-lg font-display text-xl text-parchment-400">
        {won
          ? `A porta dos fundos range e o ar frio o recebe. Fuga concluída em ${formatSeconds(elapsed)} com ${hintsUsed} ${hintsUsed === 1 ? 'dica' : 'dicas'}.`
          : 'As trancas se fecharam de vez. Talvez, numa próxima vida, o relógio volte a andar.'}
      </p>
      <Button className="mt-10 px-8 py-3 text-base" onClick={() => actor.send({ type: 'RESET' })}>
        {won ? 'Jogar novamente' : 'Tentar de novo'}
      </Button>
    </motion.section>
  )
}
