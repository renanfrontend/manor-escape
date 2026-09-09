import { createActor } from 'xstate'
import { describe, expect, it, vi } from 'vitest'
import { BOOKSHELF_PUZZLE, FOYER, LIBRARY, STUDY, type DoorHotspot, type ItemHotspot } from '@/domain'
import { GAME_RULES, gameMachine } from '../machine/gameMachine'

const hotspot = <T extends { id: string }>(list: readonly T[], id: string): T => {
  const found = list.find((h) => h.id === id)
  if (!found) throw new Error(`hotspot ${id} missing`)
  return found
}

const libraryDoor = hotspot(FOYER.hotspots, 'foyer-library-door') as DoorHotspot
const vase = hotspot(FOYER.hotspots, 'foyer-vase') as ItemHotspot
const globe = hotspot(LIBRARY.hotspots, 'library-globe') as ItemHotspot
const studyDoor = hotspot(LIBRARY.hotspots, 'library-study-door') as DoorHotspot
const exitDoor = hotspot(STUDY.hotspots, 'study-exit-door') as DoorHotspot

const start = () => {
  const actor = createActor(gameMachine, { input: { tickIntervalMs: 60_000 } }).start()
  actor.send({ type: 'START' })
  return actor
}

describe('gameMachine', () => {
  it('starts in the foyer with an empty inventory', () => {
    const actor = start()
    expect(actor.getSnapshot().matches({ playing: 'exploring' })).toBe(true)
    expect(actor.getSnapshot().context.room).toBe('foyer')
    expect(actor.getSnapshot().context.inventory).toEqual([])
    actor.stop()
  })

  it('keeps doors locked without the key and consumes it on first use', () => {
    const actor = start()
    actor.send({ type: 'USE_DOOR', hotspot: libraryDoor })
    expect(actor.getSnapshot().context.room).toBe('foyer')

    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'clock' })
    actor.send({ type: 'SUBMIT_ANSWER', puzzleId: 'clock', answer: { hour: 9, minute: 15 } })
    expect(actor.getSnapshot().context.inventory).toContain('bronze-key')
    actor.send({ type: 'CLOSE_PUZZLE' })

    actor.send({ type: 'USE_DOOR', hotspot: libraryDoor })
    expect(actor.getSnapshot().context.room).toBe('library')
    expect(actor.getSnapshot().context.inventory).not.toContain('bronze-key')

    actor.send({ type: 'GO_TO_ROOM', roomId: 'foyer' })
    actor.send({ type: 'USE_DOOR', hotspot: libraryDoor })
    expect(actor.getSnapshot().context.room).toBe('library')
    actor.stop()
  })

  it('marks wrong answers without solving', () => {
    const actor = start()
    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'clock' })
    actor.send({ type: 'SUBMIT_ANSWER', puzzleId: 'clock', answer: { hour: 3, minute: 0 } })
    const { context } = actor.getSnapshot()
    expect(context.lastAttemptFailed).toBe(true)
    expect(context.solved).toEqual([])
    actor.stop()
  })

  it('collects items only once and gates them behind requirements', () => {
    const actor = start()
    actor.send({ type: 'COLLECT_ITEM', hotspot: vase })
    actor.send({ type: 'COLLECT_ITEM', hotspot: vase })
    expect(actor.getSnapshot().context.inventory).toEqual(['crumpled-note'])

    actor.send({ type: 'COLLECT_ITEM', hotspot: globe })
    expect(actor.getSnapshot().context.inventory).not.toContain('iron-key')
    actor.stop()
  })

  it('charges a time penalty per hint and caps the total', () => {
    const actor = start()
    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'cipher' })
    for (let i = 0; i < GAME_RULES.maxHints + 2; i += 1) actor.send({ type: 'USE_HINT', puzzleId: 'cipher' })
    const { context } = actor.getSnapshot()
    expect(context.hintsUsed).toBe(GAME_RULES.maxHints)
    expect(context.elapsedSeconds).toBe(GAME_RULES.maxHints * GAME_RULES.hintPenaltySeconds)
    actor.stop()
  })

  it('completes the full walkthrough and wins', () => {
    const actor = start()
    actor.send({ type: 'COLLECT_ITEM', hotspot: vase })
    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'clock' })
    actor.send({ type: 'SUBMIT_ANSWER', puzzleId: 'clock', answer: { hour: 9, minute: 15 } })
    actor.send({ type: 'CLOSE_PUZZLE' })
    actor.send({ type: 'USE_DOOR', hotspot: libraryDoor })

    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'bookshelf' })
    actor.send({ type: 'SUBMIT_ANSWER', puzzleId: 'bookshelf', answer: BOOKSHELF_PUZZLE.solution })
    actor.send({ type: 'CLOSE_PUZZLE' })
    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'cipher' })
    actor.send({ type: 'SUBMIT_ANSWER', puzzleId: 'cipher', answer: 'globo' })
    actor.send({ type: 'CLOSE_PUZZLE' })
    actor.send({ type: 'COLLECT_ITEM', hotspot: globe })
    actor.send({ type: 'USE_DOOR', hotspot: studyDoor })
    expect(actor.getSnapshot().context.room).toBe('study')

    actor.send({ type: 'USE_DOOR', hotspot: exitDoor })
    expect(actor.getSnapshot().matches('won')).toBe(false)

    actor.send({ type: 'OPEN_PUZZLE', puzzleId: 'safe' })
    actor.send({ type: 'SUBMIT_ANSWER', puzzleId: 'safe', answer: [9, 3, 5] })
    actor.send({ type: 'CLOSE_PUZZLE' })
    actor.send({ type: 'USE_DOOR', hotspot: exitDoor })
    expect(actor.getSnapshot().matches('won')).toBe(true)
    actor.stop()
  })

  it('loses when the timer runs out', () => {
    vi.useFakeTimers()
    const actor = createActor(gameMachine, { input: { tickIntervalMs: 10 } }).start()
    actor.send({ type: 'START' })
    vi.advanceTimersByTime(GAME_RULES.timeLimitSeconds * 10)
    expect(actor.getSnapshot().matches('lost')).toBe(true)
    actor.stop()
    vi.useRealTimers()
  })
})
