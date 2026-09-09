import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: Variant
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gold-400 text-ink-950 hover:bg-gold-300 disabled:bg-gold-600 disabled:text-ink-800 shadow-glow',
  ghost:
    'border border-gold-600/60 text-parchment-200 hover:border-gold-300 hover:text-gold-300 disabled:opacity-40',
  danger: 'bg-wine-500 text-parchment-100 hover:bg-wine-700',
}

export const Button = ({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) => (
  <button
    type={type}
    className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-sans text-sm font-semibold tracking-wide uppercase transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
    {...rest}
  />
)
