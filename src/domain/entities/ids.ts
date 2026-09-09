export const ROOM_IDS = ['foyer', 'library', 'study'] as const
export type RoomId = (typeof ROOM_IDS)[number]

export const ITEM_IDS = ['bronze-key', 'crumpled-note', 'torn-page', 'iron-key', 'master-key'] as const
export type ItemId = (typeof ITEM_IDS)[number]

export const PUZZLE_IDS = ['clock', 'bookshelf', 'cipher', 'safe'] as const
export type PuzzleId = (typeof PUZZLE_IDS)[number]

export type HotspotId =
  | 'foyer-portrait'
  | 'foyer-clock'
  | 'foyer-vase'
  | 'foyer-library-door'
  | 'library-bookshelf'
  | 'library-letter'
  | 'library-globe'
  | 'library-study-door'
  | 'study-desk'
  | 'study-safe'
  | 'study-exit-door'

export const isRoomId = (value: string): value is RoomId => (ROOM_IDS as readonly string[]).includes(value)
export const isItemId = (value: string): value is ItemId => (ITEM_IDS as readonly string[]).includes(value)
export const isPuzzleId = (value: string): value is PuzzleId =>
  (PUZZLE_IDS as readonly string[]).includes(value)
