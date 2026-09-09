import type { HotspotId, ItemId, PuzzleId, RoomId } from './ids'

/** Percentage-based bounding box so scenes stay responsive. */
export interface HotspotArea {
  readonly x: number
  readonly y: number
  readonly w: number
  readonly h: number
}

export interface HotspotRequirement {
  readonly puzzleSolved?: PuzzleId
  readonly hasItem?: ItemId
}

interface HotspotBase<K extends string> {
  readonly id: HotspotId
  readonly kind: K
  readonly label: string
  readonly glyph: string
  readonly area: HotspotArea
  /** Hotspot only becomes interactive once the requirement is met. */
  readonly requires?: HotspotRequirement
}

export interface InspectHotspot extends HotspotBase<'inspect'> {
  readonly text: string
}

export interface PuzzleHotspot extends HotspotBase<'puzzle'> {
  readonly puzzleId: PuzzleId
}

export interface ItemHotspot extends HotspotBase<'item'> {
  readonly itemId: ItemId
  readonly foundText: string
}

export interface DoorHotspot extends HotspotBase<'door'> {
  readonly target: RoomId | 'exit'
  readonly lockedBy: ItemId
  readonly lockedText: string
}

export type Hotspot = InspectHotspot | PuzzleHotspot | ItemHotspot | DoorHotspot

export interface Room {
  readonly id: RoomId
  readonly name: string
  readonly description: string
  readonly hotspots: readonly Hotspot[]
}
