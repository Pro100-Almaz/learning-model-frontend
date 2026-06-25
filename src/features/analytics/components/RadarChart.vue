<script setup lang="ts">
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart as EChartsRadar } from 'echarts/charts'
import { TooltipComponent, TitleComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { TagStat } from '../composables/useTagStats'

// Side-effect: register only the pieces we actually use.
// Repeated calls are idempotent.
use([CanvasRenderer, EChartsRadar, TooltipComponent, TitleComponent])

interface Props {
  data: TagStat[]
}

const props = defineProps<Props>()

const option = computed(() => ({
  tooltip: {
    trigger: 'item' as const,
    backgroundColor: '#161427',
    borderWidth: 0,
    textStyle: { color: '#ffffff', fontFamily: 'Onest, Inter, system-ui, sans-serif' },
    formatter: (params: { value: number[]; name: string }) => {
      const lines = props.data.map((d, i) => {
        const v = params.value?.[i] ?? 0
        return `<div style="display:flex;justify-content:space-between;gap:12px"><span>${d.tag?.name ?? ''}</span><b>${v}%</b></div>`
      })
      return lines.join('')
    },
  },
  radar: {
    indicator: props.data.map((d) => ({ name: d.tag?.name ?? '', max: 100 })),
    shape: 'polygon' as const,
    radius: '65%',
    splitNumber: 4,
    name: {
      textStyle: {
        color: '#6E6B85',
        fontSize: 11,
        fontFamily: 'Onest, Inter, system-ui, sans-serif',
      },
    },
    splitArea: {
      areaStyle: {
        color: ['rgba(246,246,251,0.6)', 'rgba(232,231,240,0.4)'],
      },
    },
    axisLine: { lineStyle: { color: '#E8E7F0' } },
    splitLine: { lineStyle: { color: '#E8E7F0' } },
  },
  series: [
    {
      type: 'radar' as const,
      data: [
        {
          value: props.data.map((d) => Math.round(d.percent ?? 0)),
          name: 'Освоение',
          areaStyle: { color: 'rgba(109, 74, 255, 0.18)' },
          lineStyle: { color: '#6D4AFF', width: 2 },
          itemStyle: { color: '#6D4AFF' },
          symbol: 'circle',
          symbolSize: 5,
        },
      ],
    },
  ],
}))
</script>

<template>
  <div
    class="rounded-card bg-card border border-hairline shadow-card p-4 md:p-6"
  >
    <VChart
      :option="option"
      :autoresize="true"
      class="w-full aspect-square max-w-md mx-auto"
      role="img"
      :aria-label="`Карта освоения тем: ${data.length}`"
    />

    <!-- Screen-reader fallback — canvas is opaque to assistive tech -->
    <ul class="sr-only">
      <li
        v-for="d in data"
        :key="d.tag?.id"
      >
        {{ d.tag?.name }}: {{ Math.round(d.percent ?? 0) }}%
      </li>
    </ul>
  </div>
</template>
