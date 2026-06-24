import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OptionButton from '../OptionButton.vue'

describe('OptionButton', () => {
  it('renders text', () => {
    const w = mount(OptionButton, { props: { text: 'log2(8) = 3', state: 'idle' } })
    expect(w.text()).toContain('log2(8) = 3')
  })

  it.each([
    ['idle', false],
    ['selected', false],
    ['correct', true],
    ['wrong', true],
    ['disabled', true],
  ] as const)('state=%s → disabled=%s', (state, isDisabled) => {
    const w = mount(OptionButton, { props: { text: 'x', state } })
    expect(w.attributes('disabled') !== undefined).toBe(isDisabled)
  })

  it('aria-pressed reflects selected state', () => {
    const idle = mount(OptionButton, { props: { text: 'x', state: 'idle' } })
    expect(idle.attributes('aria-pressed')).toBe('false')
    const sel = mount(OptionButton, { props: { text: 'x', state: 'selected' } })
    expect(sel.attributes('aria-pressed')).toBe('true')
  })

  it('emits click only when idle or selected', async () => {
    const idle = mount(OptionButton, { props: { text: 'x', state: 'idle' } })
    await idle.trigger('click')
    expect(idle.emitted('click')).toBeTruthy()

    // For native button[disabled], browsers suppress click — jsdom + Vue Test Utils
    // mirrors this: triggering click on a disabled button does not fire the listener.
    const correct = mount(OptionButton, { props: { text: 'x', state: 'correct' } })
    await correct.trigger('click')
    expect(correct.emitted('click')).toBeFalsy()
  })
})
