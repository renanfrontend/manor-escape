import { motion } from 'framer-motion'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { useUiStore } from '@/composition'

interface ModalProps {
  readonly title: string
  readonly onClose: () => void
  readonly children: ReactNode
  readonly wide?: boolean
  readonly testId?: string
}

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'

/** Accessible dialog: focus trap, Escape to close, labelled by its title. */
export const Modal = ({ title, onClose, children, wide = false, testId }: ModalProps) => {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useUiStore((s) => s.reducedMotion)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-testid={testId}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-lg border border-gold-600/50 bg-ink-800 p-6 shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-xl'}`}
        initial={reducedMotion ? false : { y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-3xl font-semibold text-gold-300">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-md px-2 text-2xl leading-none text-parchment-400 hover:text-gold-300"
          >
            ×
          </button>
        </header>
        {children}
      </motion.div>
    </motion.div>
  )
}
