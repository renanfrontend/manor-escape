import type { PuzzleId } from '../entities/ids'
import type { ClockPuzzle, CombinationPuzzle, Puzzle, SequencePuzzle, TextPuzzle } from '../entities/puzzle'
import { caesarEncode } from '../services/caesar'

/**
 * Shared numbers that thread the puzzles together. Keeping them here makes the
 * final safe combination derive from the earlier rooms instead of magic values.
 */
export const STORY = {
  stoppedHour: 9,
  stoppedMinute: 15,
  cipherShift: 3,
  bookCount: 5,
} as const

export const CLOCK_PUZZLE: ClockPuzzle = {
  id: 'clock',
  kind: 'clock',
  title: 'O relógio de pêndulo',
  prompt:
    'Os ponteiros estão soltos. Alguém parou este relógio de propósito — e o retrato parece saber quando.',
  hints: [
    'Observe a inscrição na moldura do retrato no saguão.',
    'A inscrição fala de um horário exato, com hora e minutos.',
    'Ajuste para nove horas e quinze minutos.',
  ],
  solution: { hour: STORY.stoppedHour, minute: STORY.stoppedMinute },
  reward: 'bronze-key',
}

export const BOOKSHELF_PUZZLE: SequencePuzzle = {
  id: 'bookshelf',
  kind: 'sequence',
  title: 'A estante de Eleanor',
  prompt: 'Cinco volumes fora de ordem. O bilhete dizia: "na ordem em que foram escritos".',
  hints: [
    'Cada lombada tem um ano gravado em pequeno.',
    'Não confie nos números romanos — foram trocados para confundir.',
    'Ordem correta: 1861, 1868, 1874, 1879, 1886.',
  ],
  options: [
    { id: 'vol-1879', label: 'Vol. II', detail: '1879', color: '#7f1d1d' },
    { id: 'vol-1861', label: 'Vol. IV', detail: '1861', color: '#1e3a5f' },
    { id: 'vol-1886', label: 'Vol. I', detail: '1886', color: '#3f3f46' },
    { id: 'vol-1874', label: 'Vol. V', detail: '1874', color: '#365314' },
    { id: 'vol-1868', label: 'Vol. III', detail: '1868', color: '#78350f' },
  ],
  solution: ['vol-1861', 'vol-1868', 'vol-1874', 'vol-1879', 'vol-1886'],
  reward: 'torn-page',
}

const CIPHER_PLAINTEXT = 'A CHAVE DORME ATRAS DO GLOBO'

export const CIPHER_PUZZLE: TextPuzzle = {
  id: 'cipher',
  kind: 'text',
  title: 'A carta cifrada',
  prompt:
    'Uma carta lacrada com o brasão da família. As letras foram deslocadas — "tantas casas quantos filhos tenho", diz a assinatura.',
  hints: [
    'Conte quantas crianças aparecem no retrato do saguão.',
    'É uma cifra de César: cada letra avança um número fixo de posições.',
    'Recue três posições em cada letra. A frase revela um lugar da biblioteca.',
  ],
  encoded: caesarEncode(CIPHER_PLAINTEXT, STORY.cipherShift),
  solution: 'GLOBO',
}

export const SAFE_PUZZLE: CombinationPuzzle = {
  id: 'safe',
  kind: 'combination',
  title: 'O cofre do escritório',
  prompt: 'Um disco numerado de 0 a 9. Três giros, três números. A página rasgada explica quais.',
  hints: [
    'A página rasgada lista três pistas — uma por cômodo que você já visitou.',
    'Hora do relógio, passo da cifra, quantidade de volumes na estante.',
    'A combinação é 9 · 3 · 5.',
  ],
  dialMax: 9,
  solution: [STORY.stoppedHour, STORY.cipherShift, STORY.bookCount],
  reward: 'master-key',
}

export const PUZZLES: Readonly<Record<PuzzleId, Puzzle>> = {
  clock: CLOCK_PUZZLE,
  bookshelf: BOOKSHELF_PUZZLE,
  cipher: CIPHER_PUZZLE,
  safe: SAFE_PUZZLE,
}

export const getPuzzle = (id: PuzzleId): Puzzle => PUZZLES[id]
