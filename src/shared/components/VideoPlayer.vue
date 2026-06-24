<script setup lang="ts">
import { computed } from 'vue'
import { buildEmbedUrl } from './video-url'
import { t } from '@/shared/lib/i18n'

interface Props {
  url: string
  provider: 'youtube' | 'vimeo'
  /** Optional accessible label; defaults to "Видеоурок" */
  title?: string
}

const props = defineProps<Props>()

const embedSrc = computed(() => buildEmbedUrl(props.url, props.provider))
</script>

<template>
  <div
    class="relative w-full aspect-video bg-ink rounded-card overflow-hidden"
    role="region"
    :aria-label="title ?? 'Видеоурок'"
  >
    <iframe
      v-if="embedSrc"
      :src="embedSrc"
      :title="title ?? 'Видеоурок'"
      class="absolute inset-0 w-full h-full border-0"
      loading="lazy"
      referrerpolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    />

    <!-- Unavailable state — centered, unobtrusive -->
    <div
      v-else
      class="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
    >
      <!-- Play icon placeholder -->
      <div class="w-14 h-14 rounded-full bg-white/10 grid place-items-center">
        <svg
          viewBox="0 0 24 24"
          class="w-6 h-6 text-white/60"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      </div>
      <p class="text-sm text-white/60 max-w-xs">
        {{ t('lesson.videoUnavailable') }}
      </p>
    </div>
  </div>
</template>
