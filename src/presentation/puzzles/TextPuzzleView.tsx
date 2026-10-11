import { useState } from 'react'
import { Button } from '@/presentation/components/Button'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

export const TextPuzzleView = ({ puzzle, onSubmit, failed }: PuzzleViewProps<'text'>) => {
  const [answer, setAnswer] = useState('')
  const [mirrored, setMirrored] = useState(puzzle.variant === 'mirror')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(answer)
      }}
    >
      {puzzle.variant === 'anagram' ? (
        <ul
          className="flex flex-wrap justify-center gap-2 rounded-md border border-gold-600/40 bg-parchment-100 p-5"
          data-testid="cipher-text"
          aria-label={`Letras embaralhadas: ${puzzle.encoded.split('').join(' ')}`}
        >
          {puzzle.encoded.split('').map((letter, index) => (
            <li
              key={`${letter}-${index}`}
              className="flex size-11 items-center justify-center rounded border border-ink-600 bg-parchment-200 font-display text-2xl text-ink-900"
            >
              {letter}
            </li>
          ))}
        </ul>
      ) : (
        <>
          <blockquote
            className={`rounded-md border border-gold-600/40 bg-parchment-100 p-5 font-display text-ink-900 transition-transform duration-500 ${
              puzzle.variant === 'cipher' ? 'text-2xl tracking-[0.2em]' : 'text-xl'
            }`}
            style={{ transform: mirrored ? 'scaleX(-1)' : 'none' }}
            data-testid="cipher-text"
            data-mirrored={puzzle.variant === 'mirror' ? mirrored : undefined}
          >
            {puzzle.encoded}
          </blockquote>
          {puzzle.variant === 'mirror' && (
            <Button
              variant="ghost"
              className="mt-3"
              aria-pressed={!mirrored}
              onClick={() => setMirrored((value) => !value)}
              data-testid="mirror-toggle"
            >
              {mirrored ? 'Aproximar o espelho' : 'Afastar o espelho'}
            </Button>
          )}
        </>
      )}
      <label className="mt-5 block text-xs tracking-widest text-parchment-400 uppercase" htmlFor="cipher-answer">
        {puzzle.fieldLabel}
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="cipher-answer"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          className="flex-1 rounded-md border border-gold-600/50 bg-ink-900 px-3 py-2 font-display text-xl tracking-widest text-gold-300 uppercase placeholder:text-ink-600"
          placeholder="…"
          data-testid="cipher-input"
        />
        <Button type="submit" disabled={answer.trim().length === 0} data-testid="cipher-submit">
          {puzzle.submitLabel}
        </Button>
      </div>
      <FailureNote show={failed} text={puzzle.failureText} />
    </form>
  )
}
