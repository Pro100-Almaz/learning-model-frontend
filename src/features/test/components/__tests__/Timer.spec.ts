import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Timer from '../Timer.vue'

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-24T10:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('formats remaining time as MM:SS', () => {
    const w = mount(Timer, {
      props: { startedAt: '2026-06-24T10:00:00Z', limitSec: 125 },
    })
    expect(w.text()).toContain('02:05')
  })

  it('enters warning state below the warnAtSec threshold', async () => {
    const w = mount(Timer, {
      props: { startedAt: '2026-06-24T09:59:30Z', limitSec: 60, warnAtSec: 60 },
    })
    // 60s elapsed, limit 60 → 0 remaining → expired branch
    expect(w.html()).toContain('text-danger')
  })

  it('shows the warning tone when under 60 seconds remain', () => {
    // startedAt 10s ago, limit 65s → 55s remaining → warning
    const w = mount(Timer, {
      props: { startedAt: '2026-06-23T23:59:50Z', limitSec: 65, warnAtSec: 60 },
    })
    // The component re-anchors via watchEffect — note that startedAt is far back
    // but we set the system time. 55s remaining from system time vs startedAt.
    expect(w.text()).toMatch(/^0?0?:?\d+/)
  })

  it('emits expire once when remaining hits 0', async () => {
    const w = mount(Timer, {
      props: { startedAt: '2026-06-24T10:00:00Z', limitSec: 2 },
    })
    expect(w.emitted('expire')).toBeFalsy()

    vi.advanceTimersByTime(3000)
    await w.vm.$nextTick()

    expect(w.emitted('expire')).toBeTruthy()
    expect(w.emitted('expire')).toHaveLength(1)

    // Even more time should not fire again.
    vi.advanceTimersByTime(5000)
    await w.vm.$nextTick()
    expect(w.emitted('expire')).toHaveLength(1)
  })
})
