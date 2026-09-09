const ALPHABET_SIZE = 26
const UPPER_A = 65
const LOWER_A = 97

const shiftCode = (code: number, base: number, shift: number): number =>
  ((((code - base + shift) % ALPHABET_SIZE) + ALPHABET_SIZE) % ALPHABET_SIZE) + base

/** Classic Caesar cipher. Non-alphabetic characters pass through untouched. */
export const caesarShift = (input: string, shift: number): string =>
  Array.from(input, (char) => {
    const code = char.charCodeAt(0)
    if (code >= UPPER_A && code < UPPER_A + ALPHABET_SIZE) {
      return String.fromCharCode(shiftCode(code, UPPER_A, shift))
    }
    if (code >= LOWER_A && code < LOWER_A + ALPHABET_SIZE) {
      return String.fromCharCode(shiftCode(code, LOWER_A, shift))
    }
    return char
  }).join('')

export const caesarEncode = (plain: string, shift: number): string => caesarShift(plain, shift)
export const caesarDecode = (cipher: string, shift: number): string => caesarShift(cipher, -shift)
