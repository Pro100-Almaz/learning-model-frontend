import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../EmptyState.vue'

describe('EmptyState', () => {
  it('renders the title', () => {
    const wrapper = mount(EmptyState, { props: { title: 'Пусто' } })
    expect(wrapper.text()).toContain('Пусто')
  })

  it('renders body when given', () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'Пусто', body: 'Пройди первый тест' },
    })
    expect(wrapper.text()).toContain('Пройди первый тест')
  })

  it('does not render a CTA button without ctaLabel', () => {
    const wrapper = mount(EmptyState, { props: { title: 'X' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('emits "cta" on CTA click', async () => {
    const wrapper = mount(EmptyState, {
      props: { title: 'X', ctaLabel: 'Действие' },
    })
    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('cta')).toHaveLength(1)
  })
})
