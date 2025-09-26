<script setup lang="ts">
import type * as echarts from 'echarts'
import { computed, onMounted, useTemplateRef, watch } from 'vue'
import { useEcharts } from '@/hooks'

const myChartOneLine = useTemplateRef('myChartOneLine')
const { init, setOptions } = useEcharts()
const colorArr = ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00']
// const totalArr = Array.from({ length: 5 }).map(() => {
//   return [Math.round(Math.random() * 1000) + 1]
// })
const totalArr = [[0], [100], [20], [60], [80]]
const sum = totalArr.reduce((acc, cur) => (acc += cur[0]), 0) || 100
const minRate = 0.12
const newArr = totalArr.map(item =>
  item[0] / sum < minRate ? [Math.ceil(sum * minRate)] : item,
)

const options = computed(() => {
  return {
    color: colorArr,
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'none',
      },
      formatter: (params: any) => {
        return `
            <div class="custom-tooltip-style">
            <span>${params.marker}</span>
             <span>${params.seriesName}</span>
             <div>${totalArr[params.seriesIndex][0]}</div>
          </div>
          `
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
      splitNumber: 100,
      minInterval: 40,
    },
    yAxis: {
      show: false,
      type: 'category',
      data: [''],
    },
    series: totalArr.map((_item, index) => {
      let topBorder = 10
      let bottomBorder = 10
      topBorder = 10
      bottomBorder = 10
      return {
        name: `item${index}`,
        type: 'bar',
        stack: 'total',
        label: {
          show: false, // 默认为false
        },
        emphasis: {
          itemStyle: {
            color: colorArr[index % 5],
          },
        },
        barWidth: 20,
        itemStyle: {
          shadowOffsetX: 14.5,
          shadowColor: colorArr[index % 5],
          borderRadius: [topBorder, bottomBorder, bottomBorder, topBorder],
        },
        data: newArr[index],
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
