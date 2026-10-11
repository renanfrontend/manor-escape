import { useMemo } from 'react'

interface SafeDialFallbackProps {
  readonly steps: number
  readonly value: number
  readonly onChange: (value: number) => void
}

const RADIUS = 38
const CENTER = 50

/** 2D dial used when WebGL is unavailable or fails: tap a number to put it under the marker. */
export const SafeDialFallback = ({ steps, value, onChange }: SafeDialFallbackProps) => {
  const marks = useMemo(
    () =>
      Array.from({ length: steps }, (_, index) => {
        const angle = (index / steps) * Math.PI * 2 - Math.PI / 2
        return { index, x: CENTER + Math.cos(angle) * RADIUS, y: CENTER + Math.sin(angle) * RADIUS }
      }),
    [steps],
  )

  return (
    <svg viewBox="0 0 100 100" className="size-full bg-ink-900" role="group" aria-label="Disco do cofre" data-testid="safe-fallback">
      <circle cx={CENTER} cy={CENTER} r={46} fill="#1a1112" stroke="#b98a3e" strokeWidth={1.5} />
      <circle cx={CENTER} cy={CENTER} r={22} fill="#120b0c" stroke="#b98a3e55" />
      <text x={CENTER} y={CENTER + 6} textAnchor="middle" fontSize={18} fill="#e8c27a" fontFamily="Georgia, serif">
        {value}
      </text>
      {marks.map(({ index, x, y }) => (
        <g
          key={index}
          role="button"
          tabIndex={0}
          aria-label={`Número ${index}`}
          aria-pressed={index === value}
          className="cursor-pointer outline-none"
          onClick={() => onChange(index)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              onChange(index)
            }
          }}
        >
          <circle cx={x} cy={y} r={7} fill={index === value ? '#e8c27a' : '#2a1c1d'} stroke="#b98a3e" strokeWidth={0.8} />
          <text x={x} y={y + 2.6} textAnchor="middle" fontSize={7} fill={index === value ? '#120b0c' : '#e8c27a'} fontFamily="Georgia, serif">
            {index}
          </text>
        </g>
      ))}
    </svg>
  )
}
