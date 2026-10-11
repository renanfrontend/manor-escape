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
    description: 'Fria e sem dentes à vista. Serve para a passagem secreta atrás do cofre.',
    glyph: '🔐',
  },
  'brass-lens': {
    id: 'brass-lens',
    name: 'Lente de latão',
    description: 'Guardada no caderno do mestre. Faz a luz comum obedecer.',
    glyph: '🔍',
  },
  'golden-compass': {
    id: 'golden-compass',
    name: 'Compasso de ouro',
    description: 'As duas pontas ainda desenham um círculo perfeito.',
    glyph: '🧭',
  },
  'crypt-key': {
    id: 'crypt-key',
    name: 'Chave da cripta',
    description: 'Úmida e escura. Cheira a pedra e a cera.',
    glyph: '🗝️',
  },
  'silver-ring': {
    id: 'silver-ring',
    name: 'Anel de prata',
    description: 'Gravado por dentro com duas letras: E. B.',
    glyph: '💍',
  },
  'observatory-key': {
    id: 'observatory-key',
    name: 'Chave do observatório',
    description: 'Fina como um ponteiro. Abre a escada em caracol.',
    glyph: '🔑',
  },
  'star-key': {
    id: 'star-key',
    name: 'Chave das estrelas',
    description: 'Uma estrela de oito pontas em latão. Só pode abrir uma coisa.',
    glyph: '⭐',
  },
}
