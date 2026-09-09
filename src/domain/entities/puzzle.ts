import type { ItemId, PuzzleId } from './ids'

export interface ClockAnswer {
  readonly hour: number
  readonly minute: number
}

interface PuzzleBase<K extends string, A> {
  readonly id: PuzzleId
  readonly kind: K
  readonly title: string
  readonly prompt: string
  readonly hints: readonly [string, string, string]
  readonly solution: A
  /** Item granted once the puzzle is solved. */
  readonly reward?: ItemId
}

export interface ClockPuzzle extends PuzzleBase<'clock', ClockAnswer> {}

export interface SequencePuzzle extends PuzzleBase<'sequence', readonly string[]> {
  readonly options: readonly SequenceOption[]
}

export interface SequenceOption {
  readonly id: string
  readonly label: string
  readonly detail: string
  readonly color: string
}

export interface TextPuzzle extends PuzzleBase<'text', string> {
  readonly encoded: string
}

export interface CombinationPuzzle extends PuzzleBase<'combination', readonly number[]> {
  readonly dialMax: number
}

export type Puzzle = ClockPuzzle | SequencePuzzle | TextPuzzle | CombinationPuzzle
export type PuzzleKind = Puzzle['kind']

/** Extracts the answer type from a puzzle type — used to keep validators fully typed. */
export type AnswerOf<P extends Puzzle> = P['solution']

export type PuzzleOfKind<K extends PuzzleKind> = Extract<Puzzle, { kind: K }>
