import { describe, it, expect } from 'vitest'
import { masteryLevel, masteryTone } from '../mastery'

describe('masteryLevel', () => {
  it('returns "untouched" when total is 0 (no attempts)', () => {
    expect(masteryLevel(0, 0)).toBe('untouched')
    expect(masteryLevel(50, 0)).toBe('untouched') // percent ignored if total=0
    expect(masteryLevel(null, 0)).toBe('untouched')
    expect(masteryLevel(undefined, 0)).toBe('untouched')
  })

  it.each([
    [0, 1, 'familiar'], // 0% but with attempts — they tried
    [1, 1, 'familiar'],
    [49, 1, 'familiar'],
    [50, 1, 'confident'],
    [79, 1, 'confident'],
    [80, 1, 'mastered'],
    [100, 1, 'mastered'],
  ] as const)('percent=%i (total>0) → %s', (percent, total, expected) => {
    expect(masteryLevel(percent, total)).toBe(expected)
  })

  it('treats negative total as untouched', () => {
    expect(masteryLevel(80, -1)).toBe('untouched')
  })

  it('handles null percent with total>0 as familiar', () => {
    expect(masteryLevel(null, 5)).toBe('familiar')
  })
})

describe('masteryTone', () => {
  it.each([
    ['mastered', 'success'],
    ['confident', 'brand'],
    ['familiar', 'danger'],
    ['untouched', 'danger'],
  ] as const)('%s → %s', (level, tone) => {
    expect(masteryTone(level)).toBe(tone)
  })
})
