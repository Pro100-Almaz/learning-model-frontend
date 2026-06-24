import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StreakFlame from '../StreakFlame.vue'

describe('StreakFlame', () => {
  it.each([
    [1, 'день'],
    [2, 'дня'],
    [5, 'дней'],
    [7, 'дней'],
    [11, 'дней'],
    [21, 'день'],
  ])('renders "%i {form}" with correct pluralisation', (days, form) => {
    const w = mount(StreakFlame, { props: { days, activeToday: false } })
    expect(w.text()).toContain(`${days} ${form}`)
  })

  it('applies the pulse class only when activeToday is true', () => {
    const on = mount(StreakFlame, { props: { days: 7, activeToday: true } })
    expect(on.html()).toContain('flame-pulse')

    const off = mount(StreakFlame, { props: { days: 7, activeToday: false } })
    expect(off.html()).not.toContain('flame-pulse')
  })

  it('shows the appropriate status copy', () => {
    const on = mount(StreakFlame, { props: { days: 7, activeToday: true } })
    expect(on.text()).toContain('Сегодня в строю')

    const off = mount(StreakFlame, { props: { days: 7, activeToday: false } })
    expect(off.text()).toContain('Сегодня ещё не занимался')
  })
})
