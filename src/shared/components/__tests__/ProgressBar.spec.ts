import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProgressBar from '../ProgressBar.vue'

describe('ProgressBar', () => {
  it('renders width matching the percent prop', () => {
    const w = mount(ProgressBar, { props: { percent: 42 } })
    const fill = w.get('[role="progressbar"] > div')
    expect(fill.attributes('style')).toContain('width: 42%')
  })

  it('clamps values above 100', () => {
    const w = mount(ProgressBar, { props: { percent: 150 } })
    expect(w.attributes('aria-valuenow')).toBe('100')
    expect(w.get('[role="progressbar"] > div').attributes('style')).toContain('width: 100%')
  })

  it('clamps values below 0', () => {
    const w = mount(ProgressBar, { props: { percent: -25 } })
    expect(w.attributes('aria-valuenow')).toBe('0')
    expect(w.get('[role="progressbar"] > div').attributes('style')).toContain('width: 0%')
  })

  it.each([
    ['brand', 'bg-brand'],
    ['success', 'bg-success'],
    ['danger', 'bg-danger'],
  ] as const)('applies %s tone class', (tone, cls) => {
    const w = mount(ProgressBar, { props: { percent: 50, tone } })
    expect(w.get('[role="progressbar"] > div').classes()).toContain(cls)
  })

  it('uses given aria-label', () => {
    const w = mount(ProgressBar, { props: { percent: 50, label: 'Прогресс теста' } })
    expect(w.attributes('aria-label')).toBe('Прогресс теста')
  })
})
