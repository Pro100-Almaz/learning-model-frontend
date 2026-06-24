import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MasteryBadge from '../MasteryBadge.vue'

describe('MasteryBadge', () => {
  it.each([
    ['untouched', 'Не начато'],
    ['familiar', 'Знакомо'],
    ['confident', 'Уверенно'],
    ['mastered', 'Освоено'],
  ] as const)('level=%s renders "%s"', (level, label) => {
    const w = mount(MasteryBadge, { props: { level } })
    expect(w.text()).toBe(label)
  })

  it.each([
    ['mastered', 'bg-success/10'],
    ['confident', 'bg-brand/10'],
    ['familiar', 'bg-ascent/10'],
    ['untouched', 'bg-surface'],
  ] as const)('level=%s applies %s tone class', (level, expectedCls) => {
    const w = mount(MasteryBadge, { props: { level } })
    expect(w.classes().join(' ')).toContain(expectedCls)
  })

  it('renders sm size by default', () => {
    const w = mount(MasteryBadge, { props: { level: 'confident' } })
    expect(w.classes().join(' ')).toContain('text-[11px]')
  })

  it('renders md size when requested', () => {
    const w = mount(MasteryBadge, { props: { level: 'confident', size: 'md' } })
    expect(w.classes().join(' ')).toContain('text-xs')
  })
})
