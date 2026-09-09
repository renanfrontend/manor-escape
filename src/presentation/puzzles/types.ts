import type { AnswerOf, PuzzleKind, PuzzleOfKind } from '@/domain'

/** Generic contract every puzzle view implements, typed by its puzzle kind. */
export interface PuzzleViewProps<K extends PuzzleKind> {
  readonly puzzle: PuzzleOfKind<K>
  readonly onSubmit: (answer: AnswerOf<PuzzleOfKind<K>>) => void
  readonly failed: boolean
}
