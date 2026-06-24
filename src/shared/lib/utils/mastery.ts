/**
 * Mastery levels — Khan-inspired labeled buckets on top of a 0-100 percent.
 * The user-facing intent is to turn a bare "37%" into a meaningful narrative:
 * «Знакомо» reads warmer than a low percent alone.
 *
 *   untouched — no attempts yet (total = 0)
 *   familiar  — 0% < percent < 50%
 *   confident — 50% ≤ percent < 80%
 *   mastered  — percent ≥ 80%
 */
export type MasteryLevel = 'untouched' | 'familiar' | 'confident' | 'mastered'

export function masteryLevel(percent: number | null | undefined, total: number): MasteryLevel {
  if (!total || total <= 0) return 'untouched'
  const p = percent ?? 0
  if (p >= 80) return 'mastered'
  if (p >= 50) return 'confident'
  if (p > 0) return 'familiar'
  return 'familiar' // 0% with attempts still counts as "familiar" — they tried
}

/** Maps a level to the appropriate ProgressBar tone. */
export function masteryTone(level: MasteryLevel): 'brand' | 'success' | 'danger' {
  if (level === 'mastered') return 'success'
  if (level === 'confident') return 'brand'
  return 'danger'
}
