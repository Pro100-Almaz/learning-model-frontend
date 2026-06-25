<script setup lang="ts" generic="T extends string | number">
import { ref, computed, nextTick, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

export interface SearchSelectOption<TValue extends string | number = string | number> {
  value: TValue
  label: string
  /** Optional secondary text shown to the right of the label. */
  hint?: string
}

const props = defineProps<{
  options: SearchSelectOption<T>[]
  modelValue: T | null
  placeholder?: string
  emptyLabel?: string
  disabled?: boolean
  /** ARIA label for the input — set when no visible <label> wraps the component. */
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: T | null): void
}>()

const rootEl = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const open = ref(false)
const query = ref('')
const activeIndex = ref(-1)

const selectedOption = computed<SearchSelectOption<T> | null>(
  () => props.options.find((o) => o.value === props.modelValue) ?? null,
)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.options
  return props.options.filter((o) => o.label.toLowerCase().includes(q))
})

// Keep the input's display in sync with the selected value when not editing.
const inputDisplay = computed(() => {
  if (open.value) return query.value
  return selectedOption.value?.label ?? ''
})

onClickOutside(rootEl, () => {
  if (open.value) close()
})

async function openPanel(): Promise<void> {
  if (props.disabled) return
  open.value = true
  query.value = ''
  activeIndex.value = -1
  await nextTick()
  inputEl.value?.focus()
}

function close(): void {
  open.value = false
  query.value = ''
  activeIndex.value = -1
}

function select(option: SearchSelectOption<T>): void {
  emit('update:modelValue', option.value)
  close()
}

function clear(): void {
  emit('update:modelValue', null)
  query.value = ''
}

function onInput(e: Event): void {
  query.value = (e.target as HTMLInputElement).value
  if (!open.value) open.value = true
  activeIndex.value = filtered.value.length > 0 ? 0 : -1
}

function onKeydown(e: KeyboardEvent): void {
  if (props.disabled) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (!open.value) {
      void openPanel()
      return
    }
    activeIndex.value = Math.min(activeIndex.value + 1, filtered.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    if (open.value && activeIndex.value >= 0) {
      e.preventDefault()
      const opt = filtered.value[activeIndex.value]
      if (opt) select(opt)
    }
  } else if (e.key === 'Escape') {
    if (open.value) {
      e.preventDefault()
      close()
      inputEl.value?.blur()
    }
  }
}

watch(() => props.disabled, (d) => {
  if (d && open.value) close()
})
</script>

<template>
  <!--
    When open, the root takes z-50 to win the local stacking battle. Otherwise
    a later sibling (e.g. the specialty SearchSelect below the university one)
    can paint over the dropdown options on some browsers / paint paths.
  -->
  <div
    ref="rootEl"
    class="relative"
    :class="open ? 'z-50' : ''"
  >
    <div
      class="flex items-center gap-2 h-12 px-3.5 rounded-button bg-card border transition-colors"
      :class="[
        disabled ? 'border-hairline bg-surface opacity-60 cursor-not-allowed' : 'border-hairline',
        open ? 'border-brand/40 ring-2 ring-brand/15' : '',
      ]"
    >
      <input
        ref="inputEl"
        :value="inputDisplay"
        :placeholder="placeholder"
        :aria-label="ariaLabel"
        :disabled="disabled"
        role="combobox"
        :aria-expanded="open"
        aria-autocomplete="list"
        autocomplete="off"
        spellcheck="false"
        class="flex-1 min-w-0 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
        @focus="openPanel"
        @input="onInput"
        @keydown="onKeydown"
      >
      <button
        v-if="selectedOption && !disabled"
        type="button"
        class="shrink-0 w-6 h-6 rounded-full grid place-items-center text-muted hover:text-ink hover:bg-surface transition-colors"
        aria-label="Очистить"
        @click="clear"
      >
        <svg
          viewBox="0 0 16 16"
          class="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          aria-hidden="true"
        >
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
      <svg
        viewBox="0 0 16 16"
        class="shrink-0 w-4 h-4 text-muted transition-transform duration-150"
        :class="open ? 'rotate-180' : ''"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 6l4 4 4-4" />
      </svg>
    </div>

    <div
      v-if="open"
      class="absolute left-0 right-0 top-full mt-2 z-50 rounded-card bg-card border border-hairline shadow-elevated overflow-hidden max-h-72 overflow-y-auto"
      role="listbox"
    >
      <div
        v-if="filtered.length === 0"
        class="px-4 py-3 text-sm text-muted"
      >
        {{ emptyLabel ?? 'Ничего не найдено.' }}
      </div>
      <button
        v-for="(opt, i) in filtered"
        :key="String(opt.value)"
        type="button"
        class="w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors"
        :class="i === activeIndex ? 'bg-surface' : 'hover:bg-surface'"
        role="option"
        :aria-selected="opt.value === modelValue"
        @click="select(opt)"
        @mouseenter="activeIndex = i"
      >
        <span class="text-sm text-ink truncate">{{ opt.label }}</span>
        <span
          v-if="opt.hint"
          class="shrink-0 text-xs text-muted tabular-nums"
        >
          {{ opt.hint }}
        </span>
      </button>
    </div>
  </div>
</template>
