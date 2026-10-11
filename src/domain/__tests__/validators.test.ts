import { describe, expect, it } from 'vitest'
import {
  BOOKSHELF_PUZZLE,
  CIPHER_PUZZLE,
  CLOCK_PUZZLE,
  CRYPTEX_PUZZLE,
  FIBONACCI_PUZZLE,
  LANTERNS_PUZZLE,
  MIRROR_PUZZLE,
  PLANETS_PUZZLE,
  SAFE_PUZZLE,
  STORY,
  TOMB_PUZZLE,
  VITRUVIAN_PUZZLE,
} from '../puzzles/definitions'
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

  it('accepts the Vitruvian count as digits or in words', () => {
    expect(validateAnswer(VITRUVIAN_PUZZLE, '96')).toBe(true)
    expect(validateAnswer(VITRUVIAN_PUZZLE, 'Noventa e seis')).toBe(true)
    expect(validateAnswer(VITRUVIAN_PUZZLE, '24')).toBe(false)
  })

  it('accepts the clepsydra under its common names', () => {
    expect(validateAnswer(MIRROR_PUZZLE, 'Clepsidra')).toBe(true)
    expect(validateAnswer(MIRROR_PUZZLE, 'relógio de água')).toBe(true)
    expect(validateAnswer(MIRROR_PUZZLE, 'ampulheta')).toBe(false)
  })

  it('shuffles the tomb letters without adding or losing any', () => {
    const sorted = (word: string) => word.split('').sort().join('')
    expect(sorted(TOMB_PUZZLE.encoded)).toBe(sorted(STORY.tombName))
    expect(TOMB_PUZZLE.encoded).not.toBe(STORY.tombName)
    expect(validateAnswer(TOMB_PUZZLE, 'eleanor')).toBe(true)
  })

  it('darkens the lantern board only when the presses cancel every light', () => {
    expect(validateAnswer(LANTERNS_PUZZLE, [1, 3, 5, 6])).toBe(true)
    expect(validateAnswer(LANTERNS_PUZZLE, [6, 5, 3, 1])).toBe(true)
    expect(validateAnswer(LANTERNS_PUZZLE, [1, 3, 5])).toBe(false)
    expect(validateAnswer(LANTERNS_PUZZLE, [0, 0, 1, 3, 5, 6])).toBe(true)
    expect(validateAnswer(LANTERNS_PUZZLE, [1.5] as never)).toBe(false)
    expect(validateAnswer(LANTERNS_PUZZLE, 'x' as never)).toBe(false)
  })

  it('spells the legacy word from the acrostic on the crypt wall', () => {
    expect(validateAnswer(CRYPTEX_PUZZLE, 'LEGADO')).toBe(true)
    expect(validateAnswer(CRYPTEX_PUZZLE, ' legado ')).toBe(true)
    expect(validateAnswer(CRYPTEX_PUZZLE, 'LEGADA')).toBe(false)
    expect(CRYPTEX_PUZZLE.wheels).toBe(CRYPTEX_PUZZLE.solution.length)
  })

  it('derives the astrolabe digits from the Fibonacci sequence', () => {
    const terms = [1, 1]
    while (terms.length < 9) terms.push((terms.at(-1) ?? 0) + (terms.at(-2) ?? 0))
    expect(terms.at(-1)).toBe(34)
    expect(validateAnswer(FIBONACCI_PUZZLE, [3, 4])).toBe(true)
    expect(validateAnswer(FIBONACCI_PUZZLE, [4, 3])).toBe(false)
  })

  it('orders the planets from the Sun', () => {
    expect(validateAnswer(PLANETS_PUZZLE, ['mercury', 'venus', 'earth', 'mars', 'jupiter'])).toBe(true)
    expect(validateAnswer(PLANETS_PUZZLE, ['venus', 'mercury', 'earth', 'mars', 'jupiter'])).toBe(false)
  })

  it('computes the Vitruvian height from the story constants', () => {
    expect(STORY.fingersPerPalm * STORY.palmsPerMan).toBe(Number(VITRUVIAN_PUZZLE.solution))
  })
})
