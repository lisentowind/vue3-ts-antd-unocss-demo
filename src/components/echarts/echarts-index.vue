<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useEcharts } from '@/hooks'

const { init, setOptions } = useEcharts()

const mockData = ref(
  Array.from({ length: 7 }).map(() => {
    return Array.from({ length: 7 }).map(() => {
      return Math.round(Math.random() * 1000)
    })
  }),
)

let timer: any = null

const options = computed(() => {
  return {
    title: {
      text: 'Stacked Area Chart',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
    },
    dataZoom: {
      show: true,
      type: 'inside',
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: [
      {
        name: 'Email',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: mockData.value[0],
      },
      {
        name: 'Union Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: mockData.value[1],
      },
      {
        name: 'Video Ads',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: mockData.value[2],
      },
      {
        name: 'Direct',
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: mockData.value[3],
      },
      {
        name: 'Search Engine',
        type: 'line',
        stack: 'Total',
        label: {
          show: true,
          position: 'top',
        },
        areaStyle: {},
        emphasis: {
          focus: 'series',
        },
        data: mockData.value[4],
      },
    ],
  } satisfies echarts.EChartsOption
})

function renderEcharts() {
  init({
    id: 'echarts-index',
    el: 'myChart',
    opts: {
      width: 600,
      height: 300,
    },
  })
  timer = setInterval(() => {
    mockData.value = Array.from({ length: 7 }).map(() => {
      return Array.from({ length: 7 }).map(() => {
        return Math.round(Math.random() * 1000)
      })
    })
  }, 3500)
  setOptions(options.value)
}

watch(
  () => options.value,
  (v) => {
    setOptions(v)
  },
)

onMounted(() => {
  console.log('renderEcharts')
  renderEcharts()
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div id="myChart"></div>
</template>
