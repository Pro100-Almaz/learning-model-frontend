import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Stepper from '../Stepper.vue'

describe('Stepper', () => {
  it('renders N segments', () => {
    const w = mount(Stepper, { props: { step: 1, total: 4 } })
    const segments = w.findAll('[role="progressbar"] > span')
    expect(segments).toHaveLength(4)
  })

  it('marks segments up to and including current step as brand', () => {
    const w = mount(Stepper, { props: { step: 2, total: 3 } })
    const segments = w.findAll('[role="progressbar"] > span')
    expect(segments[0]?.classes()).toContain('bg-brand')
    expect(segments[1]?.classes()).toContain('bg-brand')
    expect(segments[2]?.classes()).toContain('bg-hairline')
  })

  it('shows "Шаг X из N" label', () => {
    const w = mount(Stepper, { props: { step: 2, total: 3 } })
    expect(w.text()).toContain('Шаг 2 из 3')
  })

  it('sets aria-valuenow / aria-valuemax', () => {
    const w = mount(Stepper, { props: { step: 1, total: 5 } })
    const bar = w.get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('1')
    expect(bar.attributes('aria-valuemax')).toBe('5')
  })
})
