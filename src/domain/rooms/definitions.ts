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
  description:
    'Uma escrivaninha, um cofre embutido na parede e, se a chave certa girar, algo atrás do painel de carvalho.',
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
      id: 'study-secret-door',
      kind: 'door',
      label: 'Passagem secreta',
      glyph: '🕳️',
      area: { x: 74, y: 14, w: 18, h: 62 },
      target: 'atelier',
      lockedBy: 'master-key',
      lockedText: 'Um painel de madeira com três trancas. Só uma chave mestra abriria todas.',
      requires: { puzzleSolved: 'safe' },
    },
  ],
}

export const ATELIER: Room = {
  id: 'atelier',
  name: 'Ateliê',
  description:
    'Uma oficina escondida atrás do escritório. Esboços presos por tachas, engrenagens, um espelho de mão e o cheiro de óleo de linhaça: Eleanor admirava Leonardo.',
  hotspots: [
    {
      id: 'atelier-board',
      kind: 'inspect',
      label: 'Prancha de medidas',
      glyph: '📐',
      area: { x: 5, y: 12, w: 24, h: 34 },
      text:
        'As proporções do homem, copiadas do mestre:\n• 4 dedos = 1 palma\n• 4 palmas = 1 pé\n• 6 palmas = 1 côvado\n• 24 palmas = a altura de um homem\nNa margem, a letra de Eleanor: "Meça com paciência. A beleza é só aritmética bem-vestida."',
    },
    {
      id: 'atelier-vitruvian',
      kind: 'puzzle',
      label: 'Esboço do homem no círculo',
      glyph: '🎨',
      area: { x: 5, y: 52, w: 24, h: 32 },
      puzzleId: 'vitruvian',
    },
    {
      id: 'atelier-codex',
      kind: 'puzzle',
      label: 'Caderno espelhado',
      glyph: '📖',
      area: { x: 35, y: 58, w: 18, h: 24 },
      puzzleId: 'mirror',
    },
    {
      id: 'atelier-lanterns',
      kind: 'puzzle',
      label: 'Painel de lanternas',
      glyph: '💡',
      area: { x: 38, y: 12, w: 24, h: 34 },
      puzzleId: 'lanterns',
      requires: { hasItem: 'brass-lens' },
    },
    {
      id: 'atelier-crypt-door',
      kind: 'door',
      label: 'Alçapão da cripta',
      glyph: '🚪',
      area: { x: 80, y: 16, w: 14, h: 60 },
      target: 'crypt',
      lockedBy: 'crypt-key',
      lockedText: 'Um alçapão de ferro no chão do ateliê, com um cadeado coberto de limo.',
    },
  ],
}

export const CRYPT: Room = {
  id: 'crypt',
  name: 'Cripta',
  description:
    'Pedra fria, velas de cera preta e um sarcófago com o nome raspado. Alguém gravou uma estrofe na parede, como quem esconde um recado à vista de todos.',
  hotspots: [
    {
      id: 'crypt-poem',
      kind: 'inspect',
      label: 'Estrofe na parede',
      glyph: '📜',
      area: { x: 5, y: 12, w: 28, h: 42 },
      text:
        'Luz que não toca a pedra\nEsconde-se no que é frio;\nGuarda o nome de quem parte,\nA memória é um rio\nDesce sem voltar à fonte:\nO que fica é o que se escreve.\nAbaixo, em letra miúda: "O começo de cada verso é a porta."',
    },
    {
      id: 'crypt-tomb',
      kind: 'puzzle',
      label: 'Sarcófago sem nome',
      glyph: '⚰️',
      area: { x: 36, y: 46, w: 28, h: 34 },
      puzzleId: 'tomb',
    },
    {
      id: 'crypt-cryptex',
      kind: 'puzzle',
      label: 'Criptex lacrado',
      glyph: '⚱️',
      area: { x: 40, y: 8, w: 20, h: 28 },
      puzzleId: 'cryptex',
      requires: { hasItem: 'silver-ring' },
    },
    {
      id: 'crypt-stairs',
      kind: 'door',
      label: 'Escada em caracol',
      glyph: '🪜',
      area: { x: 80, y: 14, w: 14, h: 62 },
      target: 'observatory',
      lockedBy: 'observatory-key',
      lockedText: 'Uma grade de ferro corta a escada. A fechadura é fina como um ponteiro.',
    },
  ],
}

export const OBSERVATORY: Room = {
  id: 'observatory',
  name: 'Observatório',
  description:
    'No alto da mansão, uma cúpula aberta ao céu. Um astrolábio de bronze, mapas estelares e a certeza de que a saída está logo acima.',
  hotspots: [
    {
      id: 'observatory-spiral',
      kind: 'inspect',
      label: 'Concha em espiral',
      glyph: '🐚',
      area: { x: 5, y: 14, w: 24, h: 36 },
      text:
        'Uma concha de nautilus, e ao lado, riscado a lápis:\n1, 1, 2, 3, 5, 8, 13, 21, …\n"Cada passo carrega o peso dos dois anteriores. O próximo é o que abre o astrolábio."',
    },
    {
      id: 'observatory-astrolabe',
      kind: 'puzzle',
      label: 'Astrolábio de bronze',
      glyph: '🧮',
      area: { x: 36, y: 14, w: 22, h: 36 },
      puzzleId: 'fibonacci',
    },
    {
      id: 'observatory-planets',
      kind: 'puzzle',
      label: 'Mapa das esferas',
      glyph: '🪐',
      area: { x: 8, y: 56, w: 30, h: 28 },
      puzzleId: 'planets',
      requires: { hasItem: 'golden-compass' },
    },
    {
      id: 'observatory-exit-door',
      kind: 'door',
      label: 'Alçapão do telhado',
      glyph: '🌙',
      area: { x: 76, y: 14, w: 18, h: 62 },
      target: 'exit',
      lockedBy: 'star-key',
      lockedText: 'O alçapão para o telhado tem uma fechadura em forma de estrela de oito pontas.',
      requires: { puzzleSolved: 'fibonacci' },
    },
  ],
}

export const ROOMS: Readonly<Record<RoomId, Room>> = {
  foyer: FOYER,
  library: LIBRARY,
  study: STUDY,
  atelier: ATELIER,
  crypt: CRYPT,
  observatory: OBSERVATORY,
}

export const getRoom = (id: RoomId): Room => ROOMS[id]
