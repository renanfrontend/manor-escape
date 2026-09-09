import { AnimatePresence, motion } from 'framer-motion'
import { Suspense, lazy, useCallback, useEffect, useRef } from 'react'
import { GAME_RULES, useGame, useGameActor } from '@/application'
import { ITEMS, getPuzzle, type AnswerOf, type Puzzle, type PuzzleId } from '@/domain'
import { useUiStore } from '@/composition'
import { Button } from '@/presentation/components/Button'
import { Modal } from '@/presentation/components/Modal'
import { ClockPuzzleView } from './ClockPuzzleView'
import { SequencePuzzleView } from './SequencePuzzleView'
import { TextPuzzleView } from './TextPuzzleView'

const CombinationPuzzleView = lazy(() =>
  import('./CombinationPuzzleView').then((m) => ({ default: m.CombinationPuzzleView })),
)

interface PuzzleModalProps {
  readonly puzzleId: PuzzleId
}

export const PuzzleModal = ({ puzzleId }: PuzzleModalProps) => {
  const actor = useGameActor()
  const puzzle = getPuzzle(puzzleId)
  const solved = useGame((s) => s.context.solved.includes(puzzleId))
  const failed = useGame((s) => s.context.lastAttemptFailed)
  const revealed = useGame((s) => s.context.revealedHints[puzzleId])
  const hintsLeft = useGame((s) => GAME_RULES.maxHints - s.context.hintsUsed)
  const notify = useUiStore((s) => s.notify)
  const wasSolved = useRef(solved)

  useEffect(() => {
    if (solved && !wasSolved.current) {
      wasSolved.current = true
      notify(
        puzzle.reward ? `Resolvido! Você encontrou: ${ITEMS[puzzle.reward].name}.` : 'Resolvido!',
        'success',
      )
    }
  }, [solved, puzzle.reward, notify])

  const close = useCallback(() => actor.send({ type: 'CLOSE_PUZZLE' }), [actor])
  const submit = useCallback(
    (answer: AnswerOf<Puzzle>) => actor.send({ type: 'SUBMIT_ANSWER', puzzleId, answer }),
    [actor, puzzleId],
  )
  const useHint = () => actor.send({ type: 'USE_HINT', puzzleId })

  return (
    <Modal title={puzzle.title} onClose={close} wide={puzzle.kind !== 'text'} testId={`puzzle-${puzzleId}`}>
      <p className="mb-5 font-display text-lg text-parchment-400 italic">{puzzle.prompt}</p>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {solved ? (
            <motion.div
              key="solved"
              className="rounded-md border border-moss-500 bg-moss-500/10 p-5 text-center"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              data-testid="puzzle-solved"
            >
              <p className="font-display text-2xl text-gold-300">Um clique seco. Algo cedeu.</p>
              {puzzle.reward && (
                <p className="mt-2 text-parchment-200">
                  {ITEMS[puzzle.reward].glyph} {ITEMS[puzzle.reward].name} adicionado ao inventário.
                </p>
              )}
              <Button className="mt-5" onClick={close} data-testid="puzzle-continue">
                Continuar
              </Button>
            </motion.div>
          ) : (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <PuzzleBody puzzle={puzzle} onSubmit={submit} failed={failed} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!solved && (
        <section className="mt-6 border-t border-gold-600/30 pt-4" aria-label="Dicas">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs tracking-widest text-parchment-400 uppercase">
              Dicas ({revealed}/{puzzle.hints.length})
            </span>
            <Button
              variant="ghost"
              onClick={useHint}
              disabled={hintsLeft === 0 || revealed >= puzzle.hints.length}
              data-testid="use-hint"
              title={`Cada dica custa ${GAME_RULES.hintPenaltySeconds}s`}
            >
              Pedir dica (−{GAME_RULES.hintPenaltySeconds}s)
            </Button>
          </div>
          <ol className="mt-3 space-y-2">
            {puzzle.hints.slice(0, revealed).map((hint, index) => (
              <motion.li
                key={hint}
                className="rounded-md bg-ink-700 px-3 py-2 text-sm text-parchment-200"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="mr-2 text-gold-400">{index + 1}.</span>
                {hint}
              </motion.li>
            ))}
          </ol>
        </section>
      )}
    </Modal>
  )
}

interface PuzzleBodyProps {
  readonly puzzle: Puzzle
  readonly onSubmit: (answer: AnswerOf<Puzzle>) => void
  readonly failed: boolean
}

/** Exhaustive dispatch on the puzzle discriminant — adding a kind fails to compile until handled here. */
const PuzzleBody = ({ puzzle, onSubmit, failed }: PuzzleBodyProps) => {
  switch (puzzle.kind) {
    case 'clock':
      return <ClockPuzzleView puzzle={puzzle} onSubmit={onSubmit} failed={failed} />
    case 'sequence':
      return <SequencePuzzleView puzzle={puzzle} onSubmit={onSubmit} failed={failed} />
    case 'text':
      return <TextPuzzleView puzzle={puzzle} onSubmit={onSubmit} failed={failed} />
    case 'combination':
      return (
        <Suspense fallback={<p className="py-10 text-center text-parchment-400">Carregando o cofre…</p>}>
          <CombinationPuzzleView puzzle={puzzle} onSubmit={onSubmit} failed={failed} />
        </Suspense>
      )
  }
}
