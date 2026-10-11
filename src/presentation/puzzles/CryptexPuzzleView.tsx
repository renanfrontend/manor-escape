import { useState } from 'react'
import { Button } from '@/presentation/components/Button'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const spin = (letter: string, delta: 1 | -1): string =>
  ALPHABET.charAt((ALPHABET.indexOf(letter) + delta + ALPHABET.length) % ALPHABET.length)

export const CryptexPuzzleView = ({ puzzle, onSubmit, failed }: PuzzleViewProps<'cryptex'>) => {
  const [letters, setLetters] = useState<readonly string[]>(() => Array.from({ length: puzzle.wheels }, () => 'A'))
  const turn = (wheel: number, delta: 1 | -1) =>
    setLetters((current) => current.map((letter, index) => (index === wheel ? spin(letter, delta) : letter)))

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        role="group"
        aria-label="Rodas do criptex"
        className="flex gap-2 rounded-full border border-gold-600/50 bg-gradient-to-b from-ink-800 to-ink-950 px-4 py-3"
        data-testid="cryptex"
      >
        {letters.map((letter, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              className="!px-3 !py-1"
              onClick={() => turn(index, 1)}
              aria-label={`Roda ${index + 1}: letra seguinte`}
              data-testid={`cryptex-up-${index}`}
            >
              ▲
            </Button>
            <output
              className="flex size-12 items-center justify-center rounded border border-gold-600/60 bg-parchment-100 font-display text-3xl text-ink-900"
              aria-label={`Roda ${index + 1}: ${letter}`}
              data-testid={`cryptex-wheel-${index}`}
            >
              {letter}
            </output>
            <Button
              variant="ghost"
              className="!px-3 !py-1"
              onClick={() => turn(index, -1)}
              aria-label={`Roda ${index + 1}: letra anterior`}
              data-testid={`cryptex-down-${index}`}
            >
              ▼
            </Button>
          </div>
        ))}
      </div>
      <Button onClick={() => onSubmit(letters.join(''))} data-testid="cryptex-submit">
        Girar o selo
      </Button>
      <FailureNote show={failed} text="O selo resiste. As rodas não formam a palavra certa." />
    </div>
  )
}
