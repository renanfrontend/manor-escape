import { Reorder, useDragControls } from 'framer-motion'
import { useState } from 'react'
import type { SequenceOption, SequencePresentation } from '@/domain'
import { Button } from '@/presentation/components/Button'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

const move = <T,>(list: readonly T[], from: number, to: number): T[] => {
  const next = [...list]
  const [item] = next.splice(from, 1)
  if (item !== undefined) next.splice(to, 0, item)
  return next
}

const BOOKS: SequencePresentation = {
  shape: 'book',
  axisHint: 'Arraste ou use as setas · esquerda = mais antigo',
  submitLabel: 'Empurrar a estante',
  failureText: 'A estante não se move. A ordem ainda está errada.',
}

export const SequencePuzzleView = ({ puzzle, onSubmit, failed }: PuzzleViewProps<'sequence'>) => {
  const copy = puzzle.presentation ?? BOOKS
  const [order, setOrder] = useState<SequenceOption[]>(() => [...puzzle.options])

  const shift = (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 0 || target >= order.length) return
    setOrder((current) => move(current, index, target))
  }

  return (
    <div>
      <p className="mb-3 text-xs tracking-widest text-parchment-400 uppercase">
        {copy.axisHint}
      </p>
      <Reorder.Group
        axis="x"
        values={order}
        onReorder={setOrder}
        className="flex items-end justify-center gap-2 rounded-md border-b-8 border-gold-600 bg-ink-700 px-3 pt-4 pb-0"
        as="ul"
      >
        {order.map((book, index) => (
          <Book key={book.id} book={book} shape={copy.shape} index={index} total={order.length} onShift={shift} />
        ))}
      </Reorder.Group>
      <Button className="mt-5 w-full" onClick={() => onSubmit(order.map((b) => b.id))} data-testid="sequence-submit">
        {copy.submitLabel}
      </Button>
      <FailureNote show={failed} text={copy.failureText} />
    </div>
  )
}

interface BookProps {
  readonly shape: SequencePresentation['shape']
  readonly book: SequenceOption
  readonly index: number
  readonly total: number
  readonly onShift: (index: number, delta: -1 | 1) => void
}

const Book = ({ book, shape, index, total, onShift }: BookProps) => {
  const controls = useDragControls()
  return (
    <Reorder.Item
      value={book}
      dragListener={false}
      dragControls={controls}
      as="li"
      className="flex flex-col items-center gap-1"
      whileDrag={{ scale: 1.06, zIndex: 10 }}
    >
      <div
        onPointerDown={(event) => controls.start(event)}
        className={`flex cursor-grab touch-none flex-col items-center justify-between border border-black/40 py-3 shadow-lg select-none active:cursor-grabbing ${
          shape === 'orb' ? 'size-16 justify-center gap-1 rounded-full sm:size-20' : 'h-40 w-14 rounded-t-sm sm:w-16'
        }`}
        style={{ backgroundColor: book.color }}
        data-testid={`book-${book.id}`}
        role="img"
        aria-label={`${book.label}, ${book.detail}, posição ${index + 1}`}
      >
        <span
          className={`font-display text-sm font-semibold text-parchment-100 ${shape === 'orb' ? '' : '[writing-mode:vertical-rl]'}`}
        >
          {book.label}
        </span>
        <span className="text-[10px] text-parchment-200/80">{book.detail}</span>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          className="rounded px-1 text-parchment-400 hover:text-gold-300 disabled:opacity-30"
          onClick={() => onShift(index, -1)}
          disabled={index === 0}
          aria-label={`Mover ${book.label} para a esquerda`}
          data-testid={`book-${book.id}-left`}
        >
          ◀
        </button>
        <button
          type="button"
          className="rounded px-1 text-parchment-400 hover:text-gold-300 disabled:opacity-30"
          onClick={() => onShift(index, 1)}
          disabled={index === total - 1}
          aria-label={`Mover ${book.label} para a direita`}
          data-testid={`book-${book.id}-right`}
        >
          ▶
        </button>
      </div>
    </Reorder.Item>
  )
}
