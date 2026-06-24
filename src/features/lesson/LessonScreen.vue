<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLesson } from './composables/useLesson'
import VideoPlayer from '@/shared/components/VideoPlayer.vue'
import LoadingSkeleton from '@/shared/components/LoadingSkeleton.vue'
import ErrorState from '@/shared/components/ErrorState.vue'
import { t } from '@/shared/lib/i18n'

const route = useRoute()
const router = useRouter()
const lessonId = computed(() => route.params.id as string | undefined)

const { data: lesson, isPending, isError, error, refetch } = useLesson(lessonId)

const hasTest = computed(() => lesson.value?.micro_test_id != null)

function goToTest(): void {
  if (lesson.value?.micro_test_id != null) {
    void router.push({ name: 'test', params: { id: lesson.value.micro_test_id } })
  }
}
</script>

<template>
  <!--
    pb-32 on mobile clears the sticky CTA (h-14 = 56px) + gap + AppShell's
    BottomNav padding. md:pb-10 restores normal spacing on desktop where the
    CTA is inline.
  -->
  <section class="px-4 md:px-8 py-6 md:py-10 max-w-3xl mx-auto pb-32 md:pb-10">

    <!-- Loading: video skeleton first, then two text rows -->
    <template v-if="isPending">
      <LoadingSkeleton :rows="1" variant="video" />
      <div class="mt-5">
        <LoadingSkeleton :rows="2" variant="row" />
      </div>
    </template>

    <ErrorState
      v-else-if="isError"
      :body="error?.message"
      @retry="refetch()"
    />

    <article v-else-if="lesson" class="space-y-5">
      <!--
        Video is the primary surface — no decorative chrome around it.
        The VideoPlayer component owns its 16:9 container.
      -->
      <VideoPlayer
        :url="lesson.video_url ?? ''"
        :provider="(lesson.video_provider ?? 'youtube') as 'youtube' | 'vimeo'"
        :title="lesson.title"
      />

      <!-- Title — supporting matter below the video -->
      <header class="pt-1">
        <h1 class="font-display text-2xl md:text-3xl font-bold text-ink leading-snug">
          {{ lesson.title }}
        </h1>
      </header>

      <!--
        Description — sustained reading block.
        16px body type at 1.7 line-height per spec §3 typography rationale.
        No card chrome: the video already frames the lesson; extra boxes compete.
      -->
      <div
        v-if="lesson.description"
        class="border-l-2 border-hairline pl-4"
      >
        <p class="text-base text-ink/80 leading-[1.7] whitespace-pre-line">
          {{ lesson.description }}
        </p>
      </div>
    </article>

    <!--
      Sticky CTA — rendered as soon as lesson data exists so the user can
      always see the next action. On mobile it floats above the BottomNav
      (AppShell already adds the 72px + safe-area padding to the scroll
      container, so we only need to clear our own CTA height here via pb-32).
      On desktop (md+) it sits in normal flow below the article.
    -->
    <div
      v-if="lesson"
      class="sticky bottom-4 md:static md:mt-8 z-30"
    >
      <button
        type="button"
        class="group w-full inline-flex items-center justify-center gap-2 h-14 px-6 rounded-button font-semibold text-base transition-all duration-150 shadow-elevated"
        :class="
          hasTest
            ? 'bg-brand text-white hover:bg-brand-press active:scale-[0.98]'
            : 'bg-card text-muted border border-hairline cursor-not-allowed opacity-60'
        "
        :disabled="!hasTest"
        :aria-disabled="!hasTest"
        @click="goToTest"
      >
        {{ hasTest ? t('lesson.ctaTakeTest') : t('lesson.ctaDisabled') }}
        <!-- Arrow icon only shown when action is available -->
        <svg
          v-if="hasTest"
          viewBox="0 0 20 20"
          class="w-4 h-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </button>
    </div>

  </section>
</template>
