import { assign, fromCallback, setup } from 'xstate'
import {
  getPuzzle,
  validateAnswer,
  type AnswerOf,
  type DoorHotspot,
  type Hotspot,
  type ItemHotspot,
  type ItemId,
  type Puzzle,
  type PuzzleId,
  type RoomId,
} from '@/domain'

export const GAME_RULES = {
  timeLimitSeconds: 30 * 60,
  maxHints: 3,
  hintPenaltySeconds: 60,
} as const

export interface GameContext {
  readonly room: RoomId
  readonly inventory: readonly ItemId[]
  readonly collected: readonly ItemId[]
  readonly unlockedRooms: readonly RoomId[]
  readonly solved: readonly PuzzleId[]
  readonly activePuzzle: PuzzleId | null
  readonly hintsUsed: number
  readonly revealedHints: Readonly<Record<PuzzleId, number>>
  readonly elapsedSeconds: number
  readonly lastAttemptFailed: boolean
  /** Injected so tests can run the timer faster. */
  readonly tickIntervalMs: number
}

export type GameEvent =
  | { type: 'START' }
  | { type: 'TICK' }
  | { type: 'OPEN_PUZZLE'; puzzleId: PuzzleId }
  | { type: 'CLOSE_PUZZLE' }
  | { type: 'SUBMIT_ANSWER'; puzzleId: PuzzleId; answer: AnswerOf<Puzzle> }
  | { type: 'COLLECT_ITEM'; hotspot: ItemHotspot }
  | { type: 'USE_DOOR'; hotspot: DoorHotspot }
  | { type: 'GO_TO_ROOM'; roomId: RoomId }
  | { type: 'USE_HINT'; puzzleId: PuzzleId }
  | { type: 'RESET' }

const EMPTY_HINTS: Readonly<Record<PuzzleId, number>> = { clock: 0, bookshelf: 0, cipher: 0, safe: 0 }

export const initialContext: GameContext = {
  room: 'foyer',
  inventory: [],
  collected: [],
  unlockedRooms: ['foyer'],
  solved: [],
  activePuzzle: null,
  hintsUsed: 0,
  revealedHints: EMPTY_HINTS,
  elapsedSeconds: 0,
  lastAttemptFailed: false,
  tickIntervalMs: 1000,
}

export const remainingSeconds = (ctx: Pick<GameContext, 'elapsedSeconds'>): number =>
  Math.max(0, GAME_RULES.timeLimitSeconds - ctx.elapsedSeconds)

export const canInteract = (ctx: GameContext, hotspot: Hotspot): boolean => {
  const { requires } = hotspot
  if (!requires) return true
  if (requires.puzzleSolved && !ctx.solved.includes(requires.puzzleSolved)) return false
  if (requires.hasItem && !ctx.inventory.includes(requires.hasItem)) return false
  return true
}

const ticker = fromCallback<GameEvent, { intervalMs: number }>(({ sendBack, input }) => {
  const id = setInterval(() => sendBack({ type: 'TICK' }), input.intervalMs)
  return () => clearInterval(id)
})

export const gameMachine = setup({
  types: {
    context: {} as GameContext,
    events: {} as GameEvent,
    input: {} as { tickIntervalMs?: number } | undefined,
  },
  actors: { ticker },
  guards: {
    isCorrect: ({ context }, params: { puzzleId: PuzzleId; answer: AnswerOf<Puzzle> }) => {
      if (context.solved.includes(params.puzzleId)) return true
      const puzzle = getPuzzle(params.puzzleId)
      // The UI always submits the answer shape matching the open puzzle kind.
      return validateAnswer(puzzle, params.answer as AnswerOf<typeof puzzle>)
    },
    canPassDoor: ({ context }, params: { hotspot: DoorHotspot }) =>
      params.hotspot.target !== 'exit' &&
      (context.unlockedRooms.includes(params.hotspot.target) ||
        context.inventory.includes(params.hotspot.lockedBy)),
    roomUnlocked: ({ context }, params: { roomId: RoomId }) =>
      context.unlockedRooms.includes(params.roomId),
    canExit: ({ context }, params: { hotspot: DoorHotspot }) =>
      params.hotspot.target === 'exit' && context.inventory.includes(params.hotspot.lockedBy),
    canCollect: ({ context }, params: { hotspot: ItemHotspot }) =>
      !context.collected.includes(params.hotspot.itemId) && canInteract(context, params.hotspot),
    hintsAvailable: ({ context }, params: { puzzleId: PuzzleId }) =>
      context.hintsUsed < GAME_RULES.maxHints &&
      context.revealedHints[params.puzzleId] < getPuzzle(params.puzzleId).hints.length,
    timeIsUp: ({ context }) => context.elapsedSeconds + 1 >= GAME_RULES.timeLimitSeconds,
  },
  actions: {
    tick: assign({ elapsedSeconds: ({ context }) => context.elapsedSeconds + 1 }),
    openPuzzle: assign({
      activePuzzle: (_, params: { puzzleId: PuzzleId }) => params.puzzleId,
      lastAttemptFailed: false,
    }),
    closePuzzle: assign({ activePuzzle: null, lastAttemptFailed: false }),
    markFailed: assign({ lastAttemptFailed: true }),
    solvePuzzle: assign(({ context }, params: { puzzleId: PuzzleId }) => {
      const puzzle = getPuzzle(params.puzzleId)
      const alreadySolved = context.solved.includes(params.puzzleId)
      const reward = puzzle.reward
      const grant = reward !== undefined && !alreadySolved && !context.collected.includes(reward)
      return {
        solved: alreadySolved ? context.solved : [...context.solved, params.puzzleId],
        inventory: grant && reward ? [...context.inventory, reward] : context.inventory,
        collected: grant && reward ? [...context.collected, reward] : context.collected,
        lastAttemptFailed: false,
      }
    }),
    collectItem: assign(({ context }, params: { hotspot: ItemHotspot }) => ({
      inventory: [...context.inventory, params.hotspot.itemId],
      collected: [...context.collected, params.hotspot.itemId],
    })),
    passDoor: assign(({ context }, params: { hotspot: DoorHotspot }) => {
      const target = params.hotspot.target
      if (target === 'exit') return {}
      const alreadyUnlocked = context.unlockedRooms.includes(target)
      return {
        room: target,
        unlockedRooms: alreadyUnlocked ? context.unlockedRooms : [...context.unlockedRooms, target],
        // The key is consumed the first time the door is unlocked.
        inventory: alreadyUnlocked
          ? context.inventory
          : context.inventory.filter((item) => item !== params.hotspot.lockedBy),
      }
    }),
    goToRoom: assign({ room: (_, params: { roomId: RoomId }) => params.roomId }),
    revealHint: assign(({ context }, params: { puzzleId: PuzzleId }) => ({
      hintsUsed: context.hintsUsed + 1,
      revealedHints: {
        ...context.revealedHints,
        [params.puzzleId]: context.revealedHints[params.puzzleId] + 1,
      },
      elapsedSeconds: context.elapsedSeconds + GAME_RULES.hintPenaltySeconds,
    })),
    reset: assign(({ context }) => ({ ...initialContext, tickIntervalMs: context.tickIntervalMs })),
  },
}).createMachine({
  id: 'manorEscape',
  context: ({ input }) => ({ ...initialContext, tickIntervalMs: input?.tickIntervalMs ?? 1000 }),
  initial: 'idle',
  states: {
    idle: {
      on: { START: { target: 'playing', actions: 'reset' } },
    },
    playing: {
      invoke: {
        src: 'ticker',
        input: ({ context }) => ({ intervalMs: context.tickIntervalMs }),
      },
      initial: 'exploring',
      on: {
        TICK: [{ guard: 'timeIsUp', target: 'lost', actions: 'tick' }, { actions: 'tick' }],
        RESET: { target: 'idle', actions: 'reset' },
      },
      states: {
        exploring: {
          on: {
            OPEN_PUZZLE: {
              target: 'solving',
              actions: { type: 'openPuzzle', params: ({ event }) => ({ puzzleId: event.puzzleId }) },
            },
            COLLECT_ITEM: {
              guard: { type: 'canCollect', params: ({ event }) => ({ hotspot: event.hotspot }) },
              actions: { type: 'collectItem', params: ({ event }) => ({ hotspot: event.hotspot }) },
            },
            USE_DOOR: [
              {
                guard: { type: 'canExit', params: ({ event }) => ({ hotspot: event.hotspot }) },
                target: '#manorEscape.won',
              },
              {
                guard: { type: 'canPassDoor', params: ({ event }) => ({ hotspot: event.hotspot }) },
                actions: { type: 'passDoor', params: ({ event }) => ({ hotspot: event.hotspot }) },
              },
            ],
            GO_TO_ROOM: {
              guard: { type: 'roomUnlocked', params: ({ event }) => ({ roomId: event.roomId }) },
              actions: { type: 'goToRoom', params: ({ event }) => ({ roomId: event.roomId }) },
            },
          },
        },
        solving: {
          on: {
            CLOSE_PUZZLE: { target: 'exploring', actions: 'closePuzzle' },
            SUBMIT_ANSWER: [
              {
                guard: {
                  type: 'isCorrect',
                  params: ({ event }) => ({ puzzleId: event.puzzleId, answer: event.answer }),
                },
                actions: { type: 'solvePuzzle', params: ({ event }) => ({ puzzleId: event.puzzleId }) },
              },
              { actions: 'markFailed' },
            ],
            USE_HINT: {
              guard: { type: 'hintsAvailable', params: ({ event }) => ({ puzzleId: event.puzzleId }) },
              actions: { type: 'revealHint', params: ({ event }) => ({ puzzleId: event.puzzleId }) },
            },
          },
        },
      },
    },
    won: {
      on: { RESET: { target: 'idle', actions: 'reset' } },
    },
    lost: {
      on: { RESET: { target: 'idle', actions: 'reset' } },
    },
  },
})

export type GameMachine = typeof gameMachine
