import { createActor } from 'xstate'
import { describe, expect, it, vi } from 'vitest'
import {
  ATELIER,
  BOOKSHELF_PUZZLE,
  CRYPT,
  FOYER,
  LIBRARY,
  OBSERVATORY,
  PLANETS_PUZZLE,
  STUDY,
  type DoorHotspot,
  type PuzzleId,
  type ItemHotspot,
} from '@/domain'
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
const secretDoor = hotspot(STUDY.hotspots, 'study-secret-door') as DoorHotspot
const cryptDoor = hotspot(ATELIER.hotspots, 'atelier-crypt-door') as DoorHotspot
const stairs = hotspot(CRYPT.hotspots, 'crypt-stairs') as DoorHotspot
const exitDoor = hotspot(OBSERVATORY.hotspots, 'observatory-exit-door') as DoorHotspot

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
    // Each puzzle has three hints, so alternate to reach the global cap.
    for (let i = 0; i < GAME_RULES.maxHints + 2; i += 1) {
      actor.send({ type: 'USE_HINT', puzzleId: i % 2 === 0 ? 'cipher' : 'clock' })
    }
    const { context } = actor.getSnapshot()
    expect(context.hintsUsed).toBe(GAME_RULES.maxHints)
    expect(context.elapsedSeconds).toBe(GAME_RULES.maxHints * GAME_RULES.hintPenaltySeconds)
    actor.stop()
  })

  it('completes the full walkthrough across six rooms and wins', () => {
    const actor = start()
    const solve = (puzzleId: PuzzleId, answer: unknown) => {
      actor.send({ type: 'OPEN_PUZZLE', puzzleId })
      actor.send({ type: 'SUBMIT_ANSWER', puzzleId, answer: answer as never })
      actor.send({ type: 'CLOSE_PUZZLE' })
    }
    const room = () => actor.getSnapshot().context.room

    actor.send({ type: 'COLLECT_ITEM', hotspot: vase })
    solve('clock', { hour: 9, minute: 15 })
    actor.send({ type: 'USE_DOOR', hotspot: libraryDoor })
    solve('bookshelf', BOOKSHELF_PUZZLE.solution)
    solve('cipher', 'globo')
    actor.send({ type: 'COLLECT_ITEM', hotspot: globe })
    actor.send({ type: 'USE_DOOR', hotspot: studyDoor })
    expect(room()).toBe('study')

    actor.send({ type: 'USE_DOOR', hotspot: secretDoor })
    expect(room()).toBe('study')
    solve('safe', [9, 3, 5])
    actor.send({ type: 'USE_DOOR', hotspot: secretDoor })
    expect(room()).toBe('atelier')

    solve('vitruvian', '96')
    solve('mirror', 'clepsidra')
    actor.send({ type: 'USE_DOOR', hotspot: cryptDoor })
    expect(room()).toBe('atelier')
    solve('lanterns', [1, 3, 5, 6])
    actor.send({ type: 'USE_DOOR', hotspot: cryptDoor })
    expect(room()).toBe('crypt')

    solve('tomb', 'Eleanor')
    solve('cryptex', 'LEGADO')
    actor.send({ type: 'USE_DOOR', hotspot: stairs })
    expect(room()).toBe('observatory')

    solve('planets', PLANETS_PUZZLE.solution)
    actor.send({ type: 'USE_DOOR', hotspot: exitDoor })
    expect(actor.getSnapshot().matches('won')).toBe(false)
    solve('fibonacci', [3, 4])
    actor.send({ type: 'USE_DOOR', hotspot: exitDoor })
    expect(actor.getSnapshot().matches('won')).toBe(true)
    expect(actor.getSnapshot().context.solved).toHaveLength(11)
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
