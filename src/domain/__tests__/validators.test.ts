import { describe, expect, it } from 'vitest'
import { BOOKSHELF_PUZZLE, CIPHER_PUZZLE, CLOCK_PUZZLE, SAFE_PUZZLE, STORY } from '../puzzles/definitions'
import { validateAnswer } from '../puzzles/validators'
import { caesarDecode } from '../services/caesar'

describe('validateAnswer', () => {
  it('accepts the clock time in 12h or 24h form', () => {
    expect(validateAnswer(CLOCK_PUZZLE, { hour: 9, minute: 15 })).toBe(true)
    expect(validateAnswer(CLOCK_PUZZLE, { hour: 21, minute: 15 })).toBe(true)
    expect(validateAnswer(CLOCK_PUZZLE, { hour: 9, minute: 20 })).toBe(false)
  })

  it('requires the exact book order', () => {
    expect(validateAnswer(BOOKSHELF_PUZZLE, BOOKSHELF_PUZZLE.solution)).toBe(true)
    expect(validateAnswer(BOOKSHELF_PUZZLE, [...BOOKSHELF_PUZZLE.solution].reverse())).toBe(false)
    expect(validateAnswer(BOOKSHELF_PUZZLE, BOOKSHELF_PUZZLE.solution.slice(1))).toBe(false)
  })

  it('normalises text answers (case, accents, whitespace)', () => {
    expect(validateAnswer(CIPHER_PUZZLE, '  globo ')).toBe(true)
    expect(validateAnswer(CIPHER_PUZZLE, 'GLÔBO')).toBe(true)
    expect(validateAnswer(CIPHER_PUZZLE, 'estante')).toBe(false)
  })

  it('keeps the cipher solvable with the story shift', () => {
    expect(caesarDecode(CIPHER_PUZZLE.encoded, STORY.cipherShift)).toContain(CIPHER_PUZZLE.solution)
  })

  it('checks the safe combination in order', () => {
    expect(validateAnswer(SAFE_PUZZLE, [9, 3, 5])).toBe(true)
    expect(validateAnswer(SAFE_PUZZLE, [5, 3, 9])).toBe(false)
  })

  it('rejects malformed answers coming from untrusted state', () => {
    expect(validateAnswer(CLOCK_PUZZLE, 'nope' as never)).toBe(false)
    expect(validateAnswer(SAFE_PUZZLE, { hour: 1, minute: 2 } as never)).toBe(false)
  })
})
