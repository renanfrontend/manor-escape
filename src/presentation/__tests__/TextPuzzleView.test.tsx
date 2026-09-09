import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CIPHER_PUZZLE } from '@/domain'
import { TextPuzzleView } from '../puzzles/TextPuzzleView'

describe('TextPuzzleView', () => {
  it('shows the encoded letter and submits the typed answer', async () => {
    const onSubmit = vi.fn()
    render(<TextPuzzleView puzzle={CIPHER_PUZZLE} onSubmit={onSubmit} failed={false} />)

    expect(screen.getByTestId('cipher-text')).toHaveTextContent(CIPHER_PUZZLE.encoded)
    expect(screen.getByTestId('cipher-submit')).toBeDisabled()

    await userEvent.type(screen.getByLabelText(/onde está a chave/i), 'globo')
    await userEvent.click(screen.getByTestId('cipher-submit'))
    expect(onSubmit).toHaveBeenCalledWith('globo')
  })

  it('renders the failure note as an alert', () => {
    render(<TextPuzzleView puzzle={CIPHER_PUZZLE} onSubmit={() => {}} failed />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
