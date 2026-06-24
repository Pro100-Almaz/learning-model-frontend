import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchSelect from '../SearchSelect.vue'

const options = [
  { value: 1, label: 'KBTU' },
  { value: 2, label: 'ЕНУ' },
  { value: 3, label: 'Назарбаев Университет' },
  { value: 4, label: 'КазНУ' },
]

describe('SearchSelect', () => {
  it('renders all options when opened with no query', async () => {
    const w = mount(SearchSelect, { props: { options, modelValue: null } })
    await w.get('input').trigger('focus')
    expect(w.findAll('[role="option"]')).toHaveLength(4)
  })

  it('filters by case-insensitive substring on input', async () => {
    const w = mount(SearchSelect, { props: { options, modelValue: null } })
    await w.get('input').trigger('focus')
    await w.get('input').setValue('каз')
    const opts = w.findAll('[role="option"]')
    expect(opts).toHaveLength(1)
    expect(opts[0]?.text()).toContain('КазНУ')
  })

  it('emits update:modelValue on option click', async () => {
    const w = mount(SearchSelect, { props: { options, modelValue: null } })
    await w.get('input').trigger('focus')
    await w.findAll('[role="option"]')[1]?.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('shows selected label in the input when closed', async () => {
    const w = mount(SearchSelect, { props: { options, modelValue: 3 } })
    const input = w.get('input').element as HTMLInputElement
    expect(input.value).toBe('Назарбаев Университет')
  })

  it('renders empty-label when there are no options matching the query', async () => {
    const w = mount(SearchSelect, {
      props: { options, modelValue: null, emptyLabel: 'Ничего' },
    })
    await w.get('input').trigger('focus')
    await w.get('input').setValue('zzzzz')
    expect(w.text()).toContain('Ничего')
  })

  it('does not open when disabled', async () => {
    const w = mount(SearchSelect, {
      props: { options, modelValue: null, disabled: true },
    })
    await w.get('input').trigger('focus')
    expect(w.findAll('[role="option"]')).toHaveLength(0)
  })

  it('emits null on clear button click', async () => {
    const w = mount(SearchSelect, { props: { options, modelValue: 1 } })
    const clearBtn = w.findAll('button').find((b) => b.attributes('aria-label') === 'Очистить')
    expect(clearBtn).toBeTruthy()
    await clearBtn?.trigger('click')
    expect(w.emitted('update:modelValue')?.[0]).toEqual([null])
  })
})
