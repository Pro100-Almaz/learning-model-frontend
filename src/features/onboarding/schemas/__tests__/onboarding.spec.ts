import { describe, it, expect } from 'vitest'
import {
  stepTargetSchema,
  stepScoresSchema,
  stepGoalSchema,
  onboardingSchema,
  ENT_MAX_SCORE,
} from '../onboarding'

describe('stepTargetSchema', () => {
  it('accepts valid uni + specialty', () => {
    expect(stepTargetSchema.safeParse({ target_university: 1, target_specialty: 11 }).success).toBe(true)
  })

  it('rejects null uni', () => {
    const r = stepTargetSchema.safeParse({ target_university: null, target_specialty: 11 })
    expect(r.success).toBe(false)
  })

  it('rejects null specialty', () => {
    const r = stepTargetSchema.safeParse({ target_university: 1, target_specialty: null })
    expect(r.success).toBe(false)
  })

  it('rejects negative ids', () => {
    expect(stepTargetSchema.safeParse({ target_university: -1, target_specialty: 11 }).success).toBe(false)
  })
})

describe('stepScoresSchema', () => {
  it('accepts a non-empty array of valid expected scores', () => {
    expect(
      stepScoresSchema.safeParse({
        expected_scores: [
          { subject: 'История Казахстана', score: 18 },
          { subject: 'Грамотность чтения', score: 15 },
        ],
      }).success,
    ).toBe(true)
  })

  it('rejects empty array', () => {
    expect(stepScoresSchema.safeParse({ expected_scores: [] }).success).toBe(false)
  })

  it('rejects score below 0', () => {
    expect(
      stepScoresSchema.safeParse({ expected_scores: [{ subject: 'X', score: -1 }] }).success,
    ).toBe(false)
  })

  it(`rejects score above ${ENT_MAX_SCORE}`, () => {
    expect(
      stepScoresSchema.safeParse({
        expected_scores: [{ subject: 'X', score: ENT_MAX_SCORE + 1 }],
      }).success,
    ).toBe(false)
  })

  it('rejects non-integer score', () => {
    expect(
      stepScoresSchema.safeParse({ expected_scores: [{ subject: 'X', score: 18.5 }] }).success,
    ).toBe(false)
  })

  it('rejects empty subject', () => {
    expect(
      stepScoresSchema.safeParse({ expected_scores: [{ subject: '', score: 18 }] }).success,
    ).toBe(false)
  })
})

describe('stepGoalSchema', () => {
  it('accepts null (optional skip)', () => {
    expect(stepGoalSchema.safeParse({ target_score: null }).success).toBe(true)
  })

  it.each([0, 1, 50, ENT_MAX_SCORE])('accepts %i', (n) => {
    expect(stepGoalSchema.safeParse({ target_score: n }).success).toBe(true)
  })

  it.each([-1, ENT_MAX_SCORE + 1, 10.5])('rejects %i', (n) => {
    expect(stepGoalSchema.safeParse({ target_score: n }).success).toBe(false)
  })
})

describe('onboardingSchema (full)', () => {
  it('accepts the full happy-path payload', () => {
    const r = onboardingSchema.safeParse({
      target_university: 1,
      target_specialty: 11,
      target_score: 115,
      expected_scores: [{ subject: 'История Казахстана', score: 18 }],
    })
    expect(r.success).toBe(true)
  })

  it('accepts null target_score (optional)', () => {
    expect(
      onboardingSchema.safeParse({
        target_university: 1,
        target_specialty: 11,
        target_score: null,
        expected_scores: [{ subject: 'X', score: 10 }],
      }).success,
    ).toBe(true)
  })

  it('rejects when expected_scores is empty', () => {
    expect(
      onboardingSchema.safeParse({
        target_university: 1,
        target_specialty: 11,
        target_score: 115,
        expected_scores: [],
      }).success,
    ).toBe(false)
  })
})
