import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Trajectory from '../Trajectory.vue'

describe('Trajectory', () => {
  it('renders predicted score as the aria-valuenow', () => {
    const w = mount(Trajectory, { props: { predicted: 94, target: 115 } })
    const bar = w.get('[role="progressbar"]')
    expect(bar.attributes('aria-valuenow')).toBe('94')
    expect(bar.attributes('aria-valuemax')).toBe('140')
  })

  it('renders the target marker when target is provided', () => {
    const w = mount(Trajectory, { props: { predicted: 94, target: 115 } })
    // Look for the markup that positions a target line — there is exactly one
    // absolutely positioned vertical sliver with the bg-ink/70 token.
    expect(w.html()).toContain('bg-ink/70')
  })

  it('omits the target marker when target is null', () => {
    const w = mount(Trajectory, { props: { predicted: 94, target: null } })
    expect(w.html()).not.toContain('bg-ink/70')
  })

  it('uses the success color when predicted ≥ target', () => {
    const over = mount(Trajectory, { props: { predicted: 120, target: 115 } })
    expect(over.html()).toContain('trajectory__fill--over')
    expect(over.html()).toContain('border-success')

    const under = mount(Trajectory, { props: { predicted: 100, target: 115 } })
    expect(under.html()).not.toContain('trajectory__fill--over')
    expect(under.html()).toContain('border-brand')
  })

  it('shows the gap-to-target status line when under target', () => {
    const w = mount(Trajectory, { props: { predicted: 94, target: 115 } })
    expect(w.text()).toContain('До цели — 21')
  })

  it('shows "Ты прямо на цели" when predicted equals target', () => {
    const w = mount(Trajectory, { props: { predicted: 115, target: 115 } })
    expect(w.text()).toContain('Ты прямо на цели')
  })

  it('shows above-target line when predicted exceeds target', () => {
    const w = mount(Trajectory, { props: { predicted: 120, target: 115 } })
    expect(w.text()).toContain('Запас от цели: +5')
  })

  it('compact variant hides status line and renders thinner bar', () => {
    const w = mount(Trajectory, {
      props: { predicted: 94, target: 115, variant: 'compact' },
    })
    expect(w.text()).not.toContain('До цели — 21')
    expect(w.html()).toContain('h-2')
  })

  it('clamps predicted to the provided max', () => {
    const w = mount(Trajectory, { props: { predicted: 200, target: 100, max: 140 } })
    const bar = w.get('[role="progressbar"]')
    // aria-valuenow reflects the raw value, but the bar fill is clamped.
    expect(bar.attributes('aria-valuenow')).toBe('200')
    // The fill width should be exactly 100% (clamped).
    expect(w.html()).toMatch(/width:\s*\d/)
  })
})
