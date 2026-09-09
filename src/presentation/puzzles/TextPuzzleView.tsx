import { useState } from 'react'
import { Button } from '@/presentation/components/Button'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

export const TextPuzzleView = ({ puzzle, onSubmit, failed }: PuzzleViewProps<'text'>) => {
  const [answer, setAnswer] = useState('')

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(answer)
      }}
    >
      <blockquote
        className="rounded-md border border-gold-600/40 bg-parchment-100 p-5 font-display text-2xl tracking-[0.2em] text-ink-900"
        data-testid="cipher-text"
      >
        {puzzle.encoded}
      </blockquote>
      <label className="mt-5 block text-xs tracking-widest text-parchment-400 uppercase" htmlFor="cipher-answer">
        Onde está a chave? (uma palavra)
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
          Procurar
        </Button>
      </div>
      <FailureNote show={failed} text="Você procura ali e não encontra nada. Releia a carta." />
    </form>
  )
}
