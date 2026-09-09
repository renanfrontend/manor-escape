import { describe, expect, it } from 'vitest'
import { caesarDecode, caesarEncode } from '../services/caesar'

describe('caesar cipher', () => {
  it('shifts letters and preserves everything else', () => {
    expect(caesarEncode('ABC xyz, 1!', 3)).toBe('DEF abc, 1!')
  })

  it('round-trips with the same shift', () => {
    const plain = 'A CHAVE DORME ATRAS DO GLOBO'
    expect(caesarDecode(caesarEncode(plain, 7), 7)).toBe(plain)
  })

  it('handles negative and oversized shifts', () => {
    expect(caesarEncode('A', -1)).toBe('Z')
    expect(caesarEncode('A', 27)).toBe('B')
  })
})
