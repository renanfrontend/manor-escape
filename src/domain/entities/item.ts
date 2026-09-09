import type { ItemId } from './ids'

export interface Item {
  readonly id: ItemId
  readonly name: string
  readonly description: string
  /** Emoji glyph used as a lightweight icon (no asset pipeline needed). */
  readonly glyph: string
  /** Free-form content revealed when the player inspects the item. */
  readonly content?: string
}

export const ITEMS: Readonly<Record<ItemId, Item>> = {
  'bronze-key': {
    id: 'bronze-key',
    name: 'Chave de bronze',
    description: 'Pequena e ornamentada. O relógio a guardava há décadas.',
    glyph: '🗝️',
  },
  'crumpled-note': {
    id: 'crumpled-note',
    name: 'Bilhete amassado',
    description: 'Escrito às pressas, com tinta já desbotada.',
    glyph: '📜',
    content:
      'Escondi a verdade nos livros. Leia-os na ordem em que foram escritos e a estante cederá.\n— E. B.',
  },
  'torn-page': {
    id: 'torn-page',
    name: 'Página rasgada',
    description: 'Arrancada de um diário. A letra é a mesma do bilhete.',
    glyph: '📄',
    content:
      'O cofre do escritório obedece a três números:\nI. a hora em que o tempo parou;\nII. o passo que usei para cifrar minhas cartas;\nIII. quantos volumes guardam minha história.',
  },
  'iron-key': {
    id: 'iron-key',
    name: 'Chave de ferro',
    description: 'Pesada e fria. Abre a porta do escritório.',
    glyph: '🔑',
  },
  'master-key': {
    id: 'master-key',
    name: 'Chave mestra',
    description: 'A única chave capaz de abrir a porta dos fundos da mansão.',
    glyph: '🔐',
  },
}
