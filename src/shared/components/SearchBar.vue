<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useGlobalSearch, type SearchHit } from '@/shared/composables/useGlobalSearch'
import { t } from '@/shared/lib/i18n'

const router = useRouter()
const { query, results, activate } = useGlobalSearch()

const rootEl = ref<HTMLDivElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const mobileExpanded = ref(false)

const showResults = computed(() => focused.value && query.value.trim().length > 0)

const grouped = computed(() => {
  const modules = results.value.filter((r): r is SearchHit & { kind: 'module' } => r.kind === 'module')
  const lessons = results.value.filter((r): r is SearchHit & { kind: 'lesson' } => r.kind === 'lesson')
  return { modules, lessons }
})

onClickOutside(rootEl, () => {
  focused.value = false
  if (mobileExpanded.value) collapseMobile()
})

function onFocus(): void {
  focused.value = true
  activate()
}

async function expandMobile(): Promise<void> {
  mobileExpanded.value = true
  activate()
  await nextTick()
  inputEl.value?.focus()
}

function collapseMobile(): void {
  mobileExpanded.value = false
  query.value = ''
  focused.value = false
}

function onSelect(hit: SearchHit): void {
  if (hit.kind === 'module') {
    void router.push({ name: 'module', params: { moduleId: hit.id } })
  } else {
    void router.push({ name: 'lesson', params: { id: hit.id } })
  }
  query.value = ''
  focused.value = false
  if (mobileExpanded.value) collapseMobile()
}

// Close the results panel and collapse mobile expand on route change.
watch(() => router.currentRoute.value.fullPath, () => {
  focused.value = false
  if (mobileExpanded.value) collapseMobile()
})

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    query.value = ''
    if (mobileExpanded.value) collapseMobile()
    inputEl.value?.blur()
  }
}
</script>

<template>
  <div
    ref="rootEl"
    class="relative"
  >
    <!-- Mobile: collapsed icon button -->
    <button
      v-if="!mobileExpanded"
      type="button"
      class="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-button text-muted hover:bg-surface hover:text-ink transition-colors"
      :aria-label="t('header.searchOpen')"
      @click="expandMobile"
    >
      <svg
        viewBox="0 0 20 20"
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle
          cx="9"
          cy="9"
          r="6"
        />
        <path d="M14 14l4 4" />
      </svg>
    </button>

    <!--
      Search input.
        - Desktop: inline, always visible, anchored within header.
        - Mobile: hidden until `mobileExpanded`; then takes over the header row.
      Both share the same input + results panel below.
    -->
    <div
      class="flex items-center gap-2"
      :class="[
        mobileExpanded
          ? 'absolute inset-x-0 top-0 -mx-4 px-4 h-14 bg-card md:bg-transparent md:relative md:inset-auto md:top-auto md:m-0 md:p-0 md:h-auto'
          : 'hidden md:flex',
      ]"
    >
      <div class="relative flex-1">
        <span
          class="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 20 20"
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle
              cx="9"
              cy="9"
              r="6"
            />
            <path d="M14 14l4 4" />
          </svg>
        </span>
        <input
          ref="inputEl"
          v-model="query"
          type="search"
          autocomplete="off"
          spellcheck="false"
          :placeholder="t('header.searchPlaceholder')"
          :aria-label="t('header.search')"
          class="w-full h-10 pl-9 pr-3 rounded-button bg-surface border border-hairline text-sm text-ink placeholder:text-muted focus:outline-none focus:border-brand/40 focus:bg-card transition-colors"
          @focus="onFocus"
          @keydown="onKeydown"
        >
      </div>
      <button
        v-if="mobileExpanded"
        type="button"
        class="md:hidden shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-button text-muted hover:text-ink transition-colors"
        :aria-label="t('header.searchClose')"
        @click="collapseMobile"
      >
        <svg
          viewBox="0 0 20 20"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </button>
    </div>

    <!-- Results panel -->
    <div
      v-if="showResults"
      class="absolute left-0 right-0 top-full mt-2 rounded-card bg-card border border-hairline shadow-elevated overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
      role="listbox"
    >
      <div
        v-if="results.length === 0"
        class="px-4 py-5 text-sm text-muted"
      >
        {{ t('header.searchEmpty') }}
      </div>

      <template v-else>
        <section v-if="grouped.modules.length > 0">
          <p
            class="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider font-semibold text-muted"
          >
            {{ t('header.searchGroupModules') }}
          </p>
          <button
            v-for="hit in grouped.modules"
            :key="`m-${hit.id}`"
            type="button"
            class="w-full text-left px-4 py-2.5 hover:bg-surface transition-colors focus:outline-none focus:bg-surface"
            role="option"
            @click="onSelect(hit)"
          >
            <p class="text-sm font-medium text-ink truncate">
              {{ hit.title }}
            </p>
          </button>
        </section>

        <section v-if="grouped.lessons.length > 0">
          <p
            class="px-4 pt-3 pb-1 text-[11px] uppercase tracking-wider font-semibold text-muted"
          >
            {{ t('header.searchGroupLessons') }}
          </p>
          <button
            v-for="hit in grouped.lessons"
            :key="`l-${hit.id}`"
            type="button"
            class="w-full text-left px-4 py-2.5 hover:bg-surface transition-colors focus:outline-none focus:bg-surface"
            role="option"
            @click="onSelect(hit)"
          >
            <p class="text-sm font-medium text-ink truncate">
              {{ hit.title }}
            </p>
            <p class="text-xs text-muted truncate mt-0.5">
              {{ hit.moduleTitle }}
            </p>
          </button>
        </section>
      </template>
    </div>
  </div>
</template>
