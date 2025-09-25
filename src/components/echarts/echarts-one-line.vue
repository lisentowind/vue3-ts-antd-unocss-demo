<script setup lang="ts">
import type * as echarts from 'echarts'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import { useEcharts } from '@/hooks'

const myChartOneLine = useTemplateRef('myChartOneLine')
const { init, setOptions } = useEcharts()
const colorArr = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00']
const options = computed(() => {
  return {
    color: colorArr,
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
    },
    legend: {
      width: 250,
      height: 150,
      top: '16%',
      right: '0%',
    },
    grid: {
      left: '0',
      right: '40%',
    },
    xAxis: {
      show: false,
      type: 'value',
    },
    yAxis: {
      show: false,
      type: 'category',
      data: [''],
    },
    series: Array.from({ length: 5 }).map((_item, index) => {
      let topBorder = 0
      let bottomBorder = 0
      topBorder = 20
      bottomBorder = 20
      return {
        name: `item${index}`,
        type: 'bar',
        stack: 'total',
        label: {
          show: false, // 默认为false
        },
        emphasis: {
          itemStyle: {
            color: colorArr[index],
          },
        },
        barWidth: 10,

        itemStyle: {
          shadowOffsetX: 25,
          shadowColor: colorArr[index],
          borderRadius: [topBorder, bottomBorder, bottomBorder, topBorder],
        },

        data: [Math.round(Math.random() * 1000) + 1],
      } satisfies echarts.EChartsOption['series']
    }),
  } satisfies echarts.EChartsOption
})

function renderEcharts() {
  init({
    id: 'my-chart-one-line',
    el: myChartOneLine.value,
    opts: {
      renderer: 'svg',
      width: 600,
      height: 100,
    },
  })
  setOptions(options.value)
}

watch(
  () => options.value,
  (v) => {
    setOptions(v)
  },
)

onMounted(() => {
  renderEcharts()
})
</script>

<template>
  <div id="my-chart-one-line" ref="myChartOneLine"></div>
</template>
