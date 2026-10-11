/** Flips `index` and its orthogonal neighbours on a square board. Pure: returns a new board. */
export const pressLight = (board: readonly boolean[], size: number, index: number): readonly boolean[] => {
  if (!Number.isInteger(index) || index < 0 || index >= size * size) return board
  const row = Math.floor(index / size)
  const col = index % size
  const flips = new Set<number>([index])
  if (row > 0) flips.add(index - size)
  if (row < size - 1) flips.add(index + size)
  if (col > 0) flips.add(index - 1)
  if (col < size - 1) flips.add(index + 1)
  return board.map((lit, i) => (flips.has(i) ? !lit : lit))
}

export const replayPresses = (initial: readonly boolean[], size: number, presses: readonly number[]): readonly boolean[] =>
  presses.reduce((board, index) => pressLight(board, size, index), initial)

export const allDark = (board: readonly boolean[]): boolean => board.every((lit) => !lit)
