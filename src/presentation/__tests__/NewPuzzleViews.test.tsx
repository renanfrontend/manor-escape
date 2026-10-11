import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CRYPTEX_PUZZLE, LANTERNS_PUZZLE, MIRROR_PUZZLE, TOMB_PUZZLE } from '@/domain'
import { CryptexPuzzleView } from '../puzzles/CryptexPuzzleView'
import { LightsPuzzleView } from '../puzzles/LightsPuzzleView'
import { TextPuzzleView } from '../puzzles/TextPuzzleView'

describe('LightsPuzzleView', () => {
  it('only lets the player submit once every lantern is dark, sending the press history', async () => {
    const onSubmit = vi.fn()
    render(<LightsPuzzleView puzzle={LANTERNS_PUZZLE} onSubmit={onSubmit} failed={false} />)
    const submit = screen.getByTestId('lanterns-submit')
    expect(submit).toBeDisabled()

    for (const cell of LANTERNS_PUZZLE.solution) await userEvent.click(screen.getByTestId(`lantern-${cell}`))
    expect(submit).toBeEnabled()
    await userEvent.click(submit)
    expect(onSubmit).toHaveBeenCalledWith([1, 3, 5, 6])
  })

  it('resets the board and the counter', async () => {
    render(<LightsPuzzleView puzzle={LANTERNS_PUZZLE} onSubmit={() => {}} failed={false} />)
    await userEvent.click(screen.getByTestId('lantern-0'))
    expect(screen.getByTestId('lantern-presses')).toHaveTextContent('1')
    await userEvent.click(screen.getByTestId('lanterns-reset'))
    expect(screen.getByTestId('lantern-presses')).toHaveTextContent('0')
    expect(screen.getByTestId('lantern-1')).toHaveAttribute('data-lit', 'true')
  })
})

describe('CryptexPuzzleView', () => {
  it('spins each wheel independently, wrapping around the alphabet', async () => {
    const onSubmit = vi.fn()
    render(<CryptexPuzzleView puzzle={CRYPTEX_PUZZLE} onSubmit={onSubmit} failed={false} />)
    await userEvent.click(screen.getByTestId('cryptex-down-0'))
    expect(screen.getByTestId('cryptex-wheel-0')).toHaveTextContent('Z')
    await userEvent.click(screen.getByTestId('cryptex-up-1'))
    expect(screen.getByTestId('cryptex-wheel-1')).toHaveTextContent('B')
    expect(screen.getByTestId('cryptex-wheel-2')).toHaveTextContent('A')
    await userEvent.click(screen.getByTestId('cryptex-submit'))
    expect(onSubmit).toHaveBeenCalledWith('ZBAAAA')
  })

  it('renders one wheel per letter of the answer', () => {
    render(<CryptexPuzzleView puzzle={CRYPTEX_PUZZLE} onSubmit={() => {}} failed={false} />)
    expect(screen.getAllByTestId(/^cryptex-wheel-/)).toHaveLength(CRYPTEX_PUZZLE.solution.length)
  })
})

describe('TextPuzzleView variants', () => {
  it('shows the anagram as one tile per letter', () => {
    render(<TextPuzzleView puzzle={TOMB_PUZZLE} onSubmit={() => {}} failed={false} />)
    expect(screen.getByTestId('cipher-text').querySelectorAll('li')).toHaveLength(TOMB_PUZZLE.encoded.length)
  })

  it('starts the mirror text reversed and lets the player bring the mirror closer', async () => {
    render(<TextPuzzleView puzzle={MIRROR_PUZZLE} onSubmit={() => {}} failed={false} />)
    expect(screen.getByTestId('cipher-text')).toHaveAttribute('data-mirrored', 'true')
    await userEvent.click(screen.getByTestId('mirror-toggle'))
    expect(screen.getByTestId('cipher-text')).toHaveAttribute('data-mirrored', 'false')
  })
})
