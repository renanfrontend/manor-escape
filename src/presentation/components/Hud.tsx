import { GAME_RULES, remainingSeconds, useGame, useGameActor } from '@/application'
import { ROOM_IDS, getRoom } from '@/domain'
import { formatSeconds } from '@/presentation/hooks/useFormattedTime'

export const Hud = () => {
  const actor = useGameActor()
  const remaining = useGame((s) => remainingSeconds(s.context))
  const hintsLeft = useGame((s) => GAME_RULES.maxHints - s.context.hintsUsed)
  const room = useGame((s) => s.context.room)
  const unlocked = useGame((s) => s.context.unlockedRooms)
  const urgent = remaining <= 5 * 60

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-600/30 px-4 py-3 sm:px-6">
      <nav aria-label="Cômodos" className="flex gap-1">
        {ROOM_IDS.map((id) => {
          const isUnlocked = unlocked.includes(id)
          const isCurrent = id === room
          return (
            <button
              key={id}
              type="button"
              disabled={!isUnlocked}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => actor.send({ type: 'GO_TO_ROOM', roomId: id })}
              className={`rounded-md px-3 py-1 font-display text-lg transition-colors ${
                isCurrent
                  ? 'bg-gold-400/15 text-gold-300'
                  : isUnlocked
                    ? 'text-parchment-400 hover:text-gold-300'
                    : 'text-ink-600'
              }`}
            >
              {getRoom(id).name}
            </button>
          )
        })}
      </nav>

      <div className="flex items-center gap-5 font-sans text-sm">
        <span className="text-parchment-400" data-testid="hints-left">
          Dicas: <strong className="text-gold-300">{hintsLeft}</strong>
        </span>
        <time
          className={`font-display text-3xl tabular-nums ${urgent ? 'animate-pulse text-wine-500' : 'text-gold-300'}`}
          aria-label="Tempo restante"
          data-testid="timer"
        >
          {formatSeconds(remaining)}
        </time>
      </div>
    </header>
  )
}
