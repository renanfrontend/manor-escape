import { useState } from 'react'
import { allDark, pressLight } from '@/domain'
import { Button } from '@/presentation/components/Button'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

export const LightsPuzzleView = ({ puzzle, onSubmit, failed }: PuzzleViewProps<'lights'>) => {
  const [board, setBoard] = useState<readonly boolean[]>(puzzle.initial)
  const [presses, setPresses] = useState<readonly number[]>([])
  const dark = allDark(board)

  const press = (index: number) => {
    setBoard((current) => pressLight(current, puzzle.size, index))
    setPresses((list) => [...list, index])
  }
  const reset = () => {
    setBoard(puzzle.initial)
    setPresses([])
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4">
      <div
        role="group"
        aria-label="Painel de lanternas"
        className="grid gap-2 rounded-md border border-gold-600/40 bg-ink-900 p-3"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
        data-testid="lanterns-grid"
      >
        {board.map((lit, index) => (
          <button
            key={index}
            type="button"
            onClick={() => press(index)}
            aria-pressed={lit}
            aria-label={`Lanterna da linha ${Math.floor(index / puzzle.size) + 1}, coluna ${(index % puzzle.size) + 1}: ${lit ? 'acesa' : 'apagada'}`}
            data-testid={`lantern-${index}`}
            data-lit={lit}
            className={`aspect-square rounded-md border text-3xl transition-colors ${
              lit
                ? 'border-gold-300 bg-gold-400/30 text-gold-300 shadow-glow'
                : 'border-ink-600 bg-ink-800 text-ink-600'
            }`}
          >
            <span aria-hidden="true">{lit ? '💡' : '◌'}</span>
          </button>
        ))}
      </div>
      <p className="text-center text-xs tracking-widest text-parchment-400 uppercase" aria-live="polite">
        Toques: <span data-testid="lantern-presses">{presses.length}</span> · {dark ? 'tudo apagado' : 'ainda há luz'}
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={reset} disabled={presses.length === 0} data-testid="lanterns-reset">
          Recomeçar
        </Button>
        <Button className="flex-1" onClick={() => onSubmit(presses)} disabled={!dark} data-testid="lanterns-submit">
          Revelar a fechadura
        </Button>
      </div>
      <FailureNote show={failed} text="A câmara escura não revela nada. Recomece o painel." />
    </div>
  )
}
