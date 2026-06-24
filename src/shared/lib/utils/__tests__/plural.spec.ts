import { describe, it, expect } from 'vitest'
import { pluralRu } from '../plural'

const ONE = 'день'
const FEW = 'дня'
const MANY = 'дней'
const p = (n: number): string => pluralRu(n, ONE, FEW, MANY)

describe('pluralRu', () => {
  it.each([
    [0, MANY],
    [1, ONE],
    [2, FEW],
    [3, FEW],
    [4, FEW],
    [5, MANY],
    [10, MANY],
    [11, MANY],
    [12, MANY],
    [14, MANY],
    [15, MANY],
    [20, MANY],
    [21, ONE],
    [22, FEW],
    [25, MANY],
    [100, MANY],
    [101, ONE],
    [111, MANY],
    [122, FEW],
  ])('p(%i) → %s', (n, expected) => {
    expect(p(n)).toBe(expected)
  })

  it('handles negatives via abs', () => {
    expect(p(-1)).toBe(ONE)
    expect(p(-2)).toBe(FEW)
    expect(p(-5)).toBe(MANY)
  })

  it('handles non-integer input by truncation', () => {
    expect(p(1.7)).toBe(ONE)
    expect(p(2.9)).toBe(FEW)
  })
})
