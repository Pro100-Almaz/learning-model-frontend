import { z } from 'zod'

/**
 * Maximum total ЕНТ score — `ENT_CONFIG.max_total_score` in the data spec.
 * Currently a placeholder (140); confirm against the current-year rules
 * before shipping the grant calculator (README blocker #2).
 */
export const ENT_MAX_SCORE = 140

const integerInRange = z
  .number({ invalid_type_error: 'Введи число' })
  .int('Введи целое число')
  .min(0, `Минимум 0`)
  .max(ENT_MAX_SCORE, `Максимум ${ENT_MAX_SCORE}`)

export const expectedScoreSchema = z.object({
  subject: z.string().min(1),
  score: integerInRange,
})

export const stepTargetSchema = z.object({
  target_university: z.number().int().positive('Выбери ВУЗ'),
  target_specialty: z.number().int().positive('Выбери специальность'),
})

export const stepScoresSchema = z.object({
  expected_scores: z.array(expectedScoreSchema).min(1, 'Нужно заполнить хотя бы один предмет'),
})

export const stepGoalSchema = z.object({
  target_score: integerInRange.nullable(),
})

export const onboardingSchema = z.object({
  target_university: z.number().int().nullable(),
  target_specialty: z.number().int().nullable(),
  target_score: integerInRange.nullable(),
  expected_scores: z.array(expectedScoreSchema).min(1),
})

export type OnboardingValues = z.infer<typeof onboardingSchema>
export type ExpectedScoreValues = z.infer<typeof expectedScoreSchema>
