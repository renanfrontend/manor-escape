import type { PuzzleId } from '../entities/ids'
import type {
  ClockPuzzle,
  CombinationPuzzle,
  CryptexPuzzle,
  LightsPuzzle,
  Puzzle,
  SequencePuzzle,
  TextPuzzle,
} from '../entities/puzzle'
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
  /** Vitruvius' proportions, as Leonardo copied them: 4 fingers = 1 palm, 24 palms = the height of a man. */
  fingersPerPalm: 4,
  palmsPerMan: 24,
  /** Eleanor's initials spell her name; the acrostic on the crypt wall spells what she left behind. */
  tombName: 'ELEANOR',
  legacyWord: 'LEGADO',
  /** First terms of the spiral shell: 1, 1, 2, 3, 5, 8, 13, 21 → next is 34. */
  fibonacciNext: [3, 4],
} as const

/** Solar-system order from the Sun, the answer to the star chart. */
export const PLANET_ORDER = ['mercury', 'venus', 'earth', 'mars', 'jupiter'] as const

/** Deterministic scramble used by the anagram so the puzzle never changes between runs. */
export const scrambleLetters = (word: string, order: readonly number[]): string =>
  order.map((index) => word.charAt(index)).join('')

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
  variant: 'cipher',
  fieldLabel: 'Onde está a chave? (uma palavra)',
  submitLabel: 'Procurar',
  failureText: 'Você procura ali e não encontra nada. Releia a carta.',
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

export const VITRUVIAN_PUZZLE: TextPuzzle = {
  id: 'vitruvian',
  kind: 'text',
  title: 'O homem no círculo',
  prompt:
    'Um esboço: um homem de braços abertos, preso num círculo e num quadrado. Na margem, a pergunta do mestre: quantos dedos tem a altura inteira do homem?',
  hints: [
    'A prancha de medidas, na parede, traz as proporções.',
    'Primeiro a altura em palmas; depois cada palma em dedos.',
    '24 palmas × 4 dedos. Responda só com o número.',
  ],
  encoded: 'ALTURA DO HOMEM = ? DEDOS',
  variant: 'riddle',
  fieldLabel: 'Quantos dedos? (um número)',
  submitLabel: 'Medir',
  failureText: 'A conta não fecha. Confira a prancha de medidas.',
  solution: String(STORY.fingersPerPalm * STORY.palmsPerMan),
  accept: ['NOVENTA E SEIS'],
  reward: 'golden-compass',
}

export const MIRROR_PUZZLE: TextPuzzle = {
  id: 'mirror',
  kind: 'text',
  title: 'O caderno espelhado',
  prompt:
    'Leonardo escrevia da direita para a esquerda, e o caderno de Eleanor imita o mestre. A página só faz sentido diante de um espelho.',
  hints: [
    'Use o botão para aproximar o espelho: o texto volta ao normal.',
    'É uma adivinha. Pense em como o mestre media o tempo sem ponteiros.',
    'Um relógio de água, dos antigos gregos. Seis letras para o início, nove no total.',
  ],
  encoded: 'Não tenho ponteiros e conto as horas em gotas. Quem sou eu?',
  variant: 'mirror',
  fieldLabel: 'Quem é? (uma palavra)',
  submitLabel: 'Responder',
  failureText: 'O caderno não reage. Leia de novo, com calma.',
  solution: 'CLEPSIDRA',
  accept: ['RELOGIO DE AGUA', 'O RELOGIO DE AGUA'],
  reward: 'brass-lens',
}

/** Lit cells {1, 4, 5, 7, 8}; pressing 1, 3, 5, 6 darkens the whole board. */
export const LANTERNS_PUZZLE: LightsPuzzle = {
  id: 'lanterns',
  kind: 'lights',
  title: 'A câmara escura',
  prompt:
    'Nove lanternas num painel. Tocar numa delas inverte a própria luz e as vizinhas de cima, de baixo, da esquerda e da direita. Apague todas e a câmara escura revela a fechadura.',
  hints: [
    'A ordem dos toques não importa; tocar duas vezes na mesma lanterna desfaz o efeito.',
    'Comece pelas lanternas das bordas: elas só afetam três luzes.',
    'Toque no 2º, 4º, 6º e 7º quadrado (contando em linhas, da esquerda para a direita).',
  ],
  size: 3,
  initial: [false, true, false, false, true, true, false, true, true],
  solution: [1, 3, 5, 6],
  reward: 'crypt-key',
}

export const TOMB_PUZZLE: TextPuzzle = {
  id: 'tomb',
  kind: 'text',
  title: 'A lápide embaralhada',
  prompt:
    'O escultor trocou as letras de propósito. "Quem dorme aqui assinava as cartas com duas iniciais", diz um riscado a giz.',
  hints: [
    'As duas iniciais das cartas são E. B. Pense em Blackwood.',
    'É um anagrama: as mesmas letras, em outra ordem. O nome tem sete letras.',
    'O primeiro nome de Lady Blackwood, o mesmo que abre a página do diário.',
  ],
  encoded: scrambleLetters(STORY.tombName, [4, 6, 3, 1, 2, 0, 5]),
  variant: 'anagram',
  fieldLabel: 'Quem repousa aqui? (um nome)',
  submitLabel: 'Gravar o nome',
  failureText: 'A pedra continua muda. Esse não é o nome.',
  solution: STORY.tombName,
  reward: 'silver-ring',
}

export const CRYPTEX_PUZZLE: CryptexPuzzle = {
  id: 'cryptex',
  kind: 'cryptex',
  title: 'O criptex lacrado',
  prompt:
    'Um cilindro de latão com seis rodas de letras e um sulco do tamanho do anel de prata. A estrofe da parede é o mapa; as primeiras letras de cada verso são a senha.',
  hints: [
    'Leia a estrofe gravada na parede da cripta.',
    'Junte a primeira letra de cada verso, de cima para baixo.',
    'A palavra tem seis letras e fala do que Eleanor deixou.',
  ],
  wheels: STORY.legacyWord.length,
  solution: STORY.legacyWord,
  reward: 'observatory-key',
}

export const FIBONACCI_PUZZLE: CombinationPuzzle = {
  id: 'fibonacci',
  kind: 'combination',
  title: 'O astrolábio',
  prompt:
    'O disco do astrolábio pede dois números. A concha em espiral, no canto da sala, cresce seguindo uma regra simples.',
  hints: [
    'Olhe a concha: 1, 1, 2, 3, 5, 8, 13, 21…',
    'Cada número é a soma dos dois anteriores.',
    '13 + 21 = 34. Marque 3 e depois 4.',
  ],
  dialMax: 9,
  solution: [...STORY.fibonacciNext],
}

export const PLANETS_PUZZLE: SequencePuzzle = {
  id: 'planets',
  kind: 'sequence',
  title: 'O mapa das esferas',
  prompt:
    'O compasso de ouro aponta para o Sol. Cinco esferas de latão estão soltas sobre o mapa: coloque-as na ordem em que se afastam da luz.',
  hints: [
    'O compasso começa no Sol; a primeira esfera é a mais próxima dele.',
    'Mercúrio, Vênus, o nosso mundo, o planeta vermelho e o gigante.',
    'Ordem: Mercúrio, Vênus, Terra, Marte, Júpiter.',
  ],
  options: [
    { id: 'mars', label: 'Marte', detail: 'o vermelho', color: '#7f1d1d' },
    { id: 'jupiter', label: 'Júpiter', detail: 'o gigante', color: '#78350f' },
    { id: 'mercury', label: 'Mercúrio', detail: 'o veloz', color: '#52525b' },
    { id: 'earth', label: 'Terra', detail: 'o nosso mundo', color: '#1e3a5f' },
    { id: 'venus', label: 'Vênus', detail: 'a estrela da manhã', color: '#a16207' },
  ],
  presentation: {
    shape: 'orb',
    axisHint: 'Arraste ou use as setas · esquerda = mais perto do Sol',
    submitLabel: 'Alinhar as esferas',
    failureText: 'As esferas giram e voltam. Ainda não é a ordem das órbitas.',
  },
  solution: [...PLANET_ORDER],
  reward: 'star-key',
}

export const PUZZLES: Readonly<Record<PuzzleId, Puzzle>> = {
  clock: CLOCK_PUZZLE,
  bookshelf: BOOKSHELF_PUZZLE,
  cipher: CIPHER_PUZZLE,
  safe: SAFE_PUZZLE,
  vitruvian: VITRUVIAN_PUZZLE,
  mirror: MIRROR_PUZZLE,
  lanterns: LANTERNS_PUZZLE,
  tomb: TOMB_PUZZLE,
  cryptex: CRYPTEX_PUZZLE,
  fibonacci: FIBONACCI_PUZZLE,
  planets: PLANETS_PUZZLE,
}

export const getPuzzle = (id: PuzzleId): Puzzle => PUZZLES[id]
