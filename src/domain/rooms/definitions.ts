import type { RoomId } from '../entities/ids'
import type { Room } from '../entities/room'

export const FOYER: Room = {
  id: 'foyer',
  name: 'Saguão',
  description:
    'A porta pesada se fecha atrás de você. Poeira, um lustre apagado e o tique-taque que não existe: o relógio está parado.',
  hotspots: [
    {
      id: 'foyer-portrait',
      kind: 'inspect',
      label: 'Retrato da família',
      glyph: '🖼️',
      area: { x: 8, y: 30, w: 22, h: 34 },
      text:
        'Lorde e Lady Blackwood, cercados por três crianças. Na moldura, uma inscrição gravada:\n"O tempo parou às nove e quinze, na noite em que ela partiu."',
    },
    {
      id: 'foyer-clock',
      kind: 'puzzle',
      label: 'Relógio de pêndulo',
      glyph: '🕰️',
      area: { x: 40, y: 10, w: 18, h: 60 },
      puzzleId: 'clock',
    },
    {
      id: 'foyer-vase',
      kind: 'item',
      label: 'Vaso de porcelana',
      glyph: '🏺',
      area: { x: 68, y: 46, w: 14, h: 26 },
      itemId: 'crumpled-note',
      foundText: 'Dentro do vaso, um bilhete amassado.',
    },
    {
      id: 'foyer-library-door',
      kind: 'door',
      label: 'Porta da biblioteca',
      glyph: '🚪',
      area: { x: 84, y: 16, w: 12, h: 60 },
      target: 'library',
      lockedBy: 'bronze-key',
      lockedText: 'Trancada. A fechadura é pequena, de bronze.',
    },
  ],
}

export const LIBRARY: Room = {
  id: 'library',
  name: 'Biblioteca',
  description:
    'Estantes até o teto e o cheiro de papel antigo. Alguém desarrumou os livros de propósito.',
  hotspots: [
    {
      id: 'library-bookshelf',
      kind: 'puzzle',
      label: 'Estante desordenada',
      glyph: '📚',
      area: { x: 6, y: 12, w: 30, h: 62 },
      puzzleId: 'bookshelf',
    },
    {
      id: 'library-letter',
      kind: 'puzzle',
      label: 'Carta lacrada',
      glyph: '✉️',
      area: { x: 42, y: 52, w: 14, h: 16 },
      puzzleId: 'cipher',
    },
    {
      id: 'library-globe',
      kind: 'item',
      label: 'Globo terrestre',
      glyph: '🌍',
      area: { x: 60, y: 40, w: 16, h: 32 },
      itemId: 'iron-key',
      foundText: 'Atrás do globo, presa com fita, uma chave de ferro.',
      requires: { puzzleSolved: 'cipher' },
    },
    {
      id: 'library-study-door',
      kind: 'door',
      label: 'Porta do escritório',
      glyph: '🚪',
      area: { x: 82, y: 16, w: 12, h: 60 },
      target: 'study',
      lockedBy: 'iron-key',
      lockedText: 'Trancada. Uma fechadura grande, de ferro escuro.',
    },
  ],
}

export const STUDY: Room = {
  id: 'study',
  name: 'Escritório',
  description: 'Uma escrivaninha, um cofre embutido na parede e — finalmente — a porta dos fundos.',
  hotspots: [
    {
      id: 'study-desk',
      kind: 'inspect',
      label: 'Escrivaninha',
      glyph: '🕯️',
      area: { x: 8, y: 44, w: 26, h: 30 },
      text:
        'Cartas inacabadas, todas assinadas "E. B.". Uma delas, rasurada: "Se estiver lendo isto, a página que rasguei explica o cofre."',
    },
    {
      id: 'study-safe',
      kind: 'puzzle',
      label: 'Cofre embutido',
      glyph: '🔒',
      area: { x: 42, y: 22, w: 20, h: 30 },
      puzzleId: 'safe',
    },
    {
      id: 'study-exit-door',
      kind: 'door',
      label: 'Porta dos fundos',
      glyph: '🌙',
      area: { x: 78, y: 14, w: 14, h: 62 },
      target: 'exit',
      lockedBy: 'master-key',
      lockedText: 'Três trancas. Só uma chave mestra abriria todas.',
    },
  ],
}

export const ROOMS: Readonly<Record<RoomId, Room>> = {
  foyer: FOYER,
  library: LIBRARY,
  study: STUDY,
}

export const getRoom = (id: RoomId): Room => ROOMS[id]
