/** Uppercases, strips diacritics and collapses whitespace so players are not punished by accents. */
export const normalizeAnswer = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
