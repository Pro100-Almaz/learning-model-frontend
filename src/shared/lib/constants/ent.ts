/**
 * ЕНТ score structure — confirmed against the official Kazakhstan ЕНТ rules.
 * Total maximum is 140 across 5 subjects:
 *
 *   Профильная математика (tested in-app):   40
 *   Профильный предмет 2 (estimated):        40
 *   История Казахстана (estimated):          20
 *   Грамотность чтения (estimated):          20
 *   Математическая грамотность (estimated):  20
 *
 * This corresponds to `ENT_CONFIG.max_total_score` in the backend data spec.
 * If the official structure ever changes, this file is the single point of edit.
 */

export const ENT_MAX_SCORE = 140

export const SUBJECT_MAX: Readonly<Record<string, number>> = Object.freeze({
  'История Казахстана': 20,
  'Грамотность чтения': 20,
  'Математическая грамотность': 20,
  'Профильный предмет 1': 40,
  'Профильный предмет 2': 40,
  // Internal alias kept for backend `math_subject: "profile_math"` mapping;
  // not surfaced as a user-facing subject label.
  'Профильная математика': 40,
})

/** Returns the official cap for a given subject, or ENT_MAX_SCORE as a safe fallback. */
export function subjectMax(subject: string): number {
  return SUBJECT_MAX[subject] ?? ENT_MAX_SCORE
}
