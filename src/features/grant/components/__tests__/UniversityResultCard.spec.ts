import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UniversityResultCard from '../UniversityResultCard.vue'

const base = {
  universityName: 'ЕНУ им. Гумилёва',
  specialtyName: 'Программная инженерия',
  minScore: 115,
}

describe('UniversityResultCard', () => {
  it('shows passing margin badge when margin > 0', () => {
    const w = mount(UniversityResultCard, { props: { ...base, margin: 5 } })
    expect(w.text()).toContain('+5 к проходному')
    expect(w.html()).toContain('bg-success/15')
  })

  it('shows exact-threshold badge when margin = 0', () => {
    const w = mount(UniversityResultCard, { props: { ...base, margin: 0 } })
    expect(w.text()).toContain('Ровно на проходном')
    expect(w.html()).toContain('bg-brand/15')
  })

  it('shows short-by badge when margin < 0', () => {
    const w = mount(UniversityResultCard, { props: { ...base, margin: -10 } })
    expect(w.text()).toContain('10 до проходного')
    expect(w.html()).toContain('bg-danger/15')
  })

  it('renders specialty + university names + min_score', () => {
    const w = mount(UniversityResultCard, { props: { ...base, margin: 5 } })
    expect(w.text()).toContain('Программная инженерия')
    expect(w.text()).toContain('ЕНУ им. Гумилёва')
    expect(w.text()).toContain('115')
  })
})
