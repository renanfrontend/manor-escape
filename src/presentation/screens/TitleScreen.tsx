import { motion } from 'framer-motion'
import { GAME_RULES, useGameActor } from '@/application'
import { useUiStore } from '@/composition'
import { Button } from '@/presentation/components/Button'
import { formatSeconds } from '@/presentation/hooks/useFormattedTime'

export const TitleScreen = () => {
  const actor = useGameActor()
  const bestRun = useUiStore((s) => s.bestRun)
  const reducedMotion = useUiStore((s) => s.reducedMotion)
  const setReducedMotion = useUiStore((s) => s.setReducedMotion)

  return (
    <motion.section
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <p className="mb-3 font-sans text-xs tracking-[0.4em] text-gold-400 uppercase">Um escape room vitoriano</p>
      <h1 className="font-display text-6xl font-bold text-parchment-100 sm:text-8xl">
        Manor <span className="text-gold-300 italic">Escape</span>
      </h1>
      <p className="mt-6 max-w-lg font-display text-xl text-parchment-400">
        A Mansão Blackwood guarda um segredo há um século. Você tem{' '}
        <strong className="text-gold-300">{GAME_RULES.timeLimitSeconds / 60} minutos</strong> para
        descobri-lo — e sair.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4">
        <Button onClick={() => actor.send({ type: 'START' })} className="px-8 py-3 text-base" data-testid="start">
          Entrar na mansão
        </Button>
        <label className="flex items-center gap-2 text-xs text-parchment-400">
          <input
            type="checkbox"
            checked={reducedMotion}
            onChange={(event) => setReducedMotion(event.target.checked)}
            className="accent-gold-400"
          />
          Reduzir animações
        </label>
      </div>

      {bestRun && (
        <p className="mt-10 text-sm text-parchment-400">
          Melhor fuga: <span className="text-gold-300">{formatSeconds(bestRun.seconds)}</span> · {bestRun.hintsUsed}{' '}
          {bestRun.hintsUsed === 1 ? 'dica' : 'dicas'}
        </p>
      )}
    </motion.section>
  )
}
