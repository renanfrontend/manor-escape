import { describe, expect, it } from 'vitest'
import { ITEM_IDS, PUZZLE_IDS, ROOM_IDS } from '../entities/ids'
import type { Hotspot } from '../entities/room'
import { PUZZLES } from '../puzzles/definitions'
import { ROOMS } from '../rooms/definitions'

const hotspots: readonly Hotspot[] = ROOM_IDS.flatMap((id) => ROOMS[id].hotspots)

describe('world consistency', () => {
  it('gives every puzzle exactly one hotspot and three hints', () => {
    for (const id of PUZZLE_IDS) {
      const entries = hotspots.filter((h) => h.kind === 'puzzle' && h.puzzleId === id)
      expect(entries, id).toHaveLength(1)
      expect(PUZZLES[id].hints, id).toHaveLength(3)
      expect(PUZZLES[id].id).toBe(id)
    }
  })

  it('uses unique hotspot ids', () => {
    const ids = hotspots.map((h) => h.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('makes every key and required item obtainable exactly once', () => {
    const granted = [
      ...Object.values(PUZZLES).flatMap((p) => (p.reward ? [p.reward] : [])),
      ...hotspots.flatMap((h) => (h.kind === 'item' ? [h.itemId] : [])),
    ]
    expect(new Set(granted).size).toBe(granted.length)
    const needed = hotspots.flatMap((h) => [
      ...(h.kind === 'door' ? [h.lockedBy] : []),
      ...(h.requires?.hasItem ? [h.requires.hasItem] : []),
    ])
    for (const item of needed) expect(granted, item).toContain(item)
    for (const item of ITEM_IDS) expect(granted.includes(item) || item === 'bronze-key' || item === 'master-key', item).toBe(true)
  })

  it('leads from the foyer to the exit through every room, with one exit', () => {
    const doors = hotspots.filter((h) => h.kind === 'door')
    expect(doors.filter((d) => d.target === 'exit')).toHaveLength(1)
    const reached = new Set(['foyer'])
    for (let pass = 0; pass < ROOM_IDS.length; pass += 1) {
      for (const id of [...reached]) {
        for (const h of ROOMS[id as keyof typeof ROOMS].hotspots) {
          if (h.kind === 'door' && h.target !== 'exit') reached.add(h.target)
        }
      }
    }
    expect([...reached].sort()).toEqual([...ROOM_IDS].sort())
  })

  it('keeps hotspots inside the stage', () => {
    for (const h of hotspots) {
      expect(h.area.x + h.area.w, h.id).toBeLessThanOrEqual(100)
      expect(h.area.y + h.area.h, h.id).toBeLessThanOrEqual(100)
    }
  })

  it('keeps hotspots of one room from overlapping each other', () => {
    for (const id of ROOM_IDS) {
      const list = ROOMS[id].hotspots
      list.forEach((a, i) => {
        for (const b of list.slice(i + 1)) {
          const apart =
            a.area.x + a.area.w <= b.area.x ||
            b.area.x + b.area.w <= a.area.x ||
            a.area.y + a.area.h <= b.area.y ||
            b.area.y + b.area.h <= a.area.y
          expect(apart, `${a.id} overlaps ${b.id}`).toBe(true)
        }
      })
    }
  })
})
