import type { AnswerOf, ClockAnswer, Puzzle } from '../entities/puzzle'
import { normalizeAnswer } from '../services/normalize'

const sameSequence = <T>(a: readonly T[], b: readonly T[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index])

const isClockAnswer = (value: unknown): value is ClockAnswer =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as ClockAnswer).hour === 'number' &&
  typeof (value as ClockAnswer).minute === 'number'

/**
 * Type-safe entry point: the answer type is inferred from the puzzle passed in,
 * so `validateAnswer(CLOCK_PUZZLE, 'text')` fails at compile time. Runtime
 * shape checks keep it safe for answers arriving from persisted state.
 */
export const validateAnswer = <P extends Puzzle>(puzzle: P, answer: AnswerOf<P>): boolean => {
  const candidate: unknown = answer
  const definition: Puzzle = puzzle

  switch (definition.kind) {
    case 'clock':
      return (
        isClockAnswer(candidate) &&
        candidate.hour % 12 === definition.solution.hour % 12 &&
        candidate.minute === definition.solution.minute
      )
    case 'sequence':
      return Array.isArray(candidate) && sameSequence(definition.solution, candidate as readonly string[])
    case 'text':
      return typeof candidate === 'string' && normalizeAnswer(candidate) === normalizeAnswer(definition.solution)
    case 'combination':
      return Array.isArray(candidate) && sameSequence(definition.solution, candidate as readonly number[])
  }
}
