import { motion } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/presentation/components/Button'
import { FailureNote } from './FailureNote'
import type { PuzzleViewProps } from './types'

const MINUTE_STEP = 5
const wrap = (value: number, max: number) => ((value % max) + max) % max

export const ClockPuzzleView = ({ onSubmit, failed }: PuzzleViewProps<'clock'>) => {
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)

  const hourAngle = (hour % 12) * 30 + minute * 0.5
  const minuteAngle = minute * 6

  return (
    <form
      className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ hour, minute })
      }}
    >
      <svg viewBox="0 0 200 200" className="mx-auto size-52" role="img" aria-label={`Relógio marcando ${hour}:${String(minute).padStart(2, '0')}`}>
        <circle cx="100" cy="100" r="96" fill="#f3e9d2" stroke="#8f6d2a" strokeWidth="6" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="#c9a24f" strokeWidth="1" />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          const x = 100 + Math.sin(angle) * 72
          const y = 100 - Math.cos(angle) * 72
          return (
            <text key={i} x={x} y={y + 6} textAnchor="middle" fontSize="16" fontFamily="Cormorant Garamond, serif" fill="#120b0c">
              {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'][i]}
            </text>
          )
        })}
        <motion.line
          x1="100" y1="100" x2="100" y2="52"
          stroke="#120b0c" strokeWidth="6" strokeLinecap="round"
          style={{ originX: '100px', originY: '100px' }}
          animate={{ rotate: hourAngle }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        />
        <motion.line
          x1="100" y1="100" x2="100" y2="30"
          stroke="#7a1f2b" strokeWidth="4" strokeLinecap="round"
          style={{ originX: '100px', originY: '100px' }}
          animate={{ rotate: minuteAngle }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
        />
        <circle cx="100" cy="100" r="5" fill="#c9a24f" />
      </svg>

      <div className="space-y-4">
        <Stepper label="Horas" value={hour} display={String(hour)} onChange={(d) => setHour(wrap(hour - 1 + d, 12) + 1)} testId="hour" />
        <Stepper label="Minutos" value={minute} display={String(minute).padStart(2, '0')} onChange={(d) => setMinute(wrap(minute + d * MINUTE_STEP, 60))} testId="minute" />
        <Button type="submit" className="w-full" data-testid="clock-submit">
          Travar os ponteiros
        </Button>
        <FailureNote show={failed} text="O mecanismo resiste. Não é esse horário." />
      </div>
    </form>
  )
}

interface StepperProps {
  readonly label: string
  readonly value: number
  readonly display: string
  readonly onChange: (delta: 1 | -1) => void
  readonly testId: string
}

const Stepper = ({ label, value, display, onChange, testId }: StepperProps) => (
  <div className="flex items-center justify-between gap-3 rounded-md border border-gold-600/40 px-3 py-2">
    <span className="text-xs tracking-widest text-parchment-400 uppercase">{label}</span>
    <div className="flex items-center gap-3">
      <Button variant="ghost" onClick={() => onChange(-1)} aria-label={`Diminuir ${label.toLowerCase()}`} data-testid={`${testId}-dec`}>
        −
      </Button>
      <output className="w-10 text-center font-display text-3xl text-gold-300 tabular-nums" data-testid={`${testId}-value`} data-value={value}>
        {display}
      </output>
      <Button variant="ghost" onClick={() => onChange(1)} aria-label={`Aumentar ${label.toLowerCase()}`} data-testid={`${testId}-inc`}>
        +
      </Button>
    </div>
  </div>
)
