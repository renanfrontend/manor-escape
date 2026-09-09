import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore } from '@/composition'

const TONE: Record<'info' | 'success' | 'error', string> = {
  info: 'border-gold-600/60 text-parchment-100',
  success: 'border-moss-500 text-parchment-100',
  error: 'border-wine-500 text-parchment-100',
}

export const Toasts = () => {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismissToast)

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-16 z-50 flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      role="status"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.button
            key={toast.id}
            type="button"
            onClick={() => dismiss(toast.id)}
            className={`pointer-events-auto max-w-md rounded-md border bg-ink-800/95 px-4 py-2 text-sm shadow-lg ${TONE[toast.tone]}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {toast.text}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
