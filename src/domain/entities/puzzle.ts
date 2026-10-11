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

export interface SequencePresentation {
  readonly shape: 'book' | 'orb'
  readonly axisHint: string
  readonly submitLabel: string
  readonly failureText: string
}

export interface SequencePuzzle extends PuzzleBase<'sequence', readonly string[]> {
  readonly options: readonly SequenceOption[]
  /** Defaults to the bookshelf wording when absent. */
  readonly presentation?: SequencePresentation
}

export interface SequenceOption {
  readonly id: string
  readonly label: string
  readonly detail: string
  readonly color: string
}

/** How a text puzzle presents itself; the answer is always typed. */
export type TextVariant = 'cipher' | 'anagram' | 'mirror' | 'riddle'

export interface TextPuzzle extends PuzzleBase<'text', string> {
  /** What the player reads: ciphertext, scrambled letters, mirrored writing or the riddle itself. */
  readonly encoded: string
  readonly variant: TextVariant
  readonly fieldLabel: string
  readonly submitLabel: string
  readonly failureText: string
  /** Other spellings that count as correct. */
  readonly accept?: readonly string[]
}

/** Lights-out board: every press flips that cell and its orthogonal neighbours. */
export interface LightsPuzzle extends PuzzleBase<'lights', readonly number[]> {
  readonly size: number
  /** Row-major; `true` means lit. */
  readonly initial: readonly boolean[]
}

/** Dan Brown-style cryptex: a row of lettered wheels. */
export interface CryptexPuzzle extends PuzzleBase<'cryptex', string> {
  readonly wheels: number
}

export interface CombinationPuzzle extends PuzzleBase<'combination', readonly number[]> {
  readonly dialMax: number
}

export type Puzzle = ClockPuzzle | SequencePuzzle | TextPuzzle | CombinationPuzzle | LightsPuzzle | CryptexPuzzle
export type PuzzleKind = Puzzle['kind']

/** Extracts the answer type from a puzzle type — used to keep validators fully typed. */
export type AnswerOf<P extends Puzzle> = P['solution']

export type PuzzleOfKind<K extends PuzzleKind> = Extract<Puzzle, { kind: K }>
