import { describe, expect, it } from 'vitest'
import { allDark, pressLight, replayPresses } from '../services/lights'

describe('lights-out engine', () => {
  const dark = Array.from({ length: 9 }, () => false)

  it('flips a corner and its two neighbours only', () => {
    const lit = pressLight(dark, 3, 0)
    expect(lit.flatMap((on, i) => (on ? [i] : []))).toEqual([0, 1, 3])
  })

  it('flips the centre and its four neighbours', () => {
    const lit = pressLight(dark, 3, 4)
    expect(lit.flatMap((on, i) => (on ? [i] : []))).toEqual([1, 3, 4, 5, 7])
  })

  it('is an involution: pressing twice restores the board', () => {
    const once = pressLight(dark, 3, 5)
    expect(pressLight(once, 3, 5)).toEqual(dark)
  })

  it('ignores presses outside the board and never mutates', () => {
    const board = Object.freeze([...dark])
    expect(pressLight(board, 3, 9)).toBe(board)
    expect(pressLight(board, 3, -1)).toBe(board)
    expect(pressLight(board, 3, 0.5)).toBe(board)
  })

  it('replays presses in any order to the same board', () => {
    expect(replayPresses(dark, 3, [0, 4, 8])).toEqual(replayPresses(dark, 3, [8, 0, 4]))
    expect(allDark(dark)).toBe(true)
    expect(allDark(pressLight(dark, 3, 0))).toBe(false)
  })
})
