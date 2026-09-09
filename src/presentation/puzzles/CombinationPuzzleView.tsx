import { useState } from 'react'
import { Button } from '@/presentation/components/Button'
import { SafeDial } from '@/presentation/three/SafeDial'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

export const CombinationPuzzleView = ({ puzzle, onSubmit, failed }: PuzzleViewProps<'combination'>) => {
  const steps = puzzle.dialMax + 1
  const length = puzzle.solution.length
  const [value, setValue] = useState(0)
  const [entered, setEntered] = useState<number[]>([])
  const complete = entered.length === length

  const rotate = (delta: 1 | -1) => setValue((v) => (((v + delta) % steps) + steps) % steps)
  const confirm = () => {
    if (complete) return
    setEntered((list) => [...list, value])
  }
  const clear = () => setEntered([])

  return (
    <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr]">
      <div className="aspect-square overflow-hidden rounded-md border border-gold-600/40" data-testid="safe-canvas">
        <SafeDial steps={steps} value={value} onChange={setValue} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-md border border-gold-600/40 p-3 text-center">
          <p className="text-xs tracking-widest text-parchment-400 uppercase">Número sob a marca</p>
          <output className="block font-display text-6xl text-gold-300 tabular-nums" data-testid="dial-value">
            {value}
          </output>
          <div className="mt-2 flex justify-center gap-2">
            <Button variant="ghost" onClick={() => rotate(-1)} aria-label="Girar para a esquerda" data-testid="dial-left">
              ↺
            </Button>
            <Button variant="ghost" onClick={() => rotate(1)} aria-label="Girar para a direita" data-testid="dial-right">
              ↻
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-gold-600/40 p-3">
          <p className="text-xs tracking-widest text-parchment-400 uppercase">Combinação</p>
          <ol className="mt-2 flex justify-center gap-3" data-testid="combination-entered">
            {Array.from({ length }, (_, i) => (
              <li
                key={i}
                className={`flex size-12 items-center justify-center rounded-md border font-display text-2xl ${
                  entered[i] !== undefined ? 'border-gold-300 text-gold-300' : 'border-ink-600 text-ink-600'
                }`}
              >
                {entered[i] ?? '·'}
              </li>
            ))}
          </ol>
          <div className="mt-3 flex gap-2">
            <Button variant="ghost" className="flex-1" onClick={confirm} disabled={complete} data-testid="dial-confirm">
              Marcar {value}
            </Button>
            <Button variant="ghost" onClick={clear} disabled={entered.length === 0} aria-label="Limpar combinação">
              ⟲
            </Button>
          </div>
        </div>

        <Button onClick={() => onSubmit(entered)} disabled={!complete} data-testid="safe-submit">
          Puxar a alavanca
        </Button>
        <FailureNote show={failed} text="A alavanca não cede. Recomece a combinação." />
      </div>
    </div>
  )
}
