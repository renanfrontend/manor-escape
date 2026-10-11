import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '@/presentation/components/ErrorBoundary'
import { SafeDialFallback } from '@/presentation/three/SafeDialFallback'

describe('SafeDialFallback', () => {
  it('selects a number by tapping it and marks the current one', () => {
    const onChange = vi.fn()
    render(<SafeDialFallback steps={10} value={3} onChange={onChange} />)
    expect(screen.getByRole('button', { name: 'Número 3' })).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(screen.getByRole('button', { name: 'Número 7' }))
    expect(onChange).toHaveBeenCalledWith(7)
  })

  it('selects with the keyboard', () => {
    const onChange = vi.fn()
    render(<SafeDialFallback steps={10} value={0} onChange={onChange} />)
    fireEvent.keyDown(screen.getByRole('button', { name: 'Número 9' }), { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith(9)
  })
})

describe('ErrorBoundary', () => {
  it('renders the fallback instead of unmounting the tree when a child throws', () => {
    const Boom = () => {
      throw new Error('WebGL context could not be created')
    }
    const silence = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    render(
      <ErrorBoundary fallback={<p>plano B</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('plano B')).toBeInTheDocument()
    silence.mockRestore()
  })
})
