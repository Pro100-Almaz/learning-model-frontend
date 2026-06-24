import { z } from 'zod'
import { ENT_MAX_SCORE, subjectMax } from '@/shared/lib/constants/ent'

// Re-export so existing imports keep working.
export { ENT_MAX_SCORE }

/**
 * Per-subject expected score — each subject has its own official cap
 * (e.g. История Казахстана = 20, Профильный предмет 2 = 40).
 * The zod refine consults SUBJECT_MAX so a single score field doesn't share
 * one global ceiling.
 */
export const expectedScoreSchema = z
  .object({
    subject: z.string().min(1),
    score: z
      .number({ invalid_type_error: 'Введи число' })
      .int('Введи целое число')
      .min(0, 'Минимум 0'),
  })
  .superRefine((data, ctx) => {
    const max = subjectMax(data.subject)
    if (data.score > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: max,
        type: 'number',
        inclusive: true,
        message: `Максимум ${max}`,
        path: ['score'],
      })
    }
  })

export const stepTargetSchema = z.object({
  target_university: z.number().int().positive('Выбери ВУЗ'),
  target_specialty: z.number().int().positive('Выбери специальность'),
})

export const stepScoresSchema = z.object({
  expected_scores: z
    .array(expectedScoreSchema)
    .min(1, 'Нужно заполнить хотя бы один предмет'),
})

/** Target score is the TOTAL — uses ENT_MAX_SCORE, not a per-subject cap. */
const totalScore = z
  .number({ invalid_type_error: 'Введи число' })
  .int('Введи целое число')
  .min(0, 'Минимум 0')
  .max(ENT_MAX_SCORE, `Максимум ${ENT_MAX_SCORE}`)

export const stepGoalSchema = z.object({
  target_score: totalScore.nullable(),
})

export const onboardingSchema = z.object({
  target_university: z.number().int().nullable(),
  target_specialty: z.number().int().nullable(),
  target_score: totalScore.nullable(),
  expected_scores: z.array(expectedScoreSchema).min(1),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>
export type ExpectedScoreValues = z.infer<typeof expectedScoreSchema>
