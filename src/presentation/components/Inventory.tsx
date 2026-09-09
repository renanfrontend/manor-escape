import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '@/application'
import { ITEMS } from '@/domain'
import { useUiStore } from '@/composition'
import { Modal } from './Modal'

export const Inventory = () => {
  const inventory = useGame((s) => s.context.inventory)
  const inspecting = useUiStore((s) => s.inspectingItem)
  const inspectItem = useUiStore((s) => s.inspectItem)
  const item = inspecting ? ITEMS[inspecting] : null

  return (
    <>
      <footer
        className="flex items-center gap-3 border-t border-gold-600/30 px-4 py-3 sm:px-6"
        aria-label="Inventário"
        data-testid="inventory"
      >
        <span className="font-sans text-xs tracking-widest text-parchment-400 uppercase">Inventário</span>
        <ul className="flex min-h-12 flex-1 items-center gap-2">
          <AnimatePresence initial={false}>
            {inventory.length === 0 && (
              <motion.li
                key="empty"
                className="text-sm text-ink-600 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                bolsos vazios
              </motion.li>
            )}
            {inventory.map((id) => {
              const definition = ITEMS[id]
              return (
                <motion.li
                  key={id}
                  layout
                  initial={{ scale: 0.4, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                >
                  <button
                    type="button"
                    onClick={() => inspectItem(id)}
                    title={definition.name}
                    aria-label={definition.name}
                    data-testid={`item-${id}`}
                    className="flex size-12 items-center justify-center rounded-md border border-gold-600/50 bg-ink-800 text-2xl hover:border-gold-300"
                  >
                    {definition.glyph}
                  </button>
                </motion.li>
              )
            })}
          </AnimatePresence>
        </ul>
      </footer>

      <AnimatePresence>
        {item && (
          <Modal key={item.id} title={item.name} onClose={() => inspectItem(null)} testId="item-modal">
            <p className="text-parchment-400">{item.description}</p>
            {item.content && (
              <blockquote className="mt-4 rounded-md border border-gold-600/40 bg-parchment-100 p-5 font-display text-lg whitespace-pre-line text-ink-900 italic">
                {item.content}
              </blockquote>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
