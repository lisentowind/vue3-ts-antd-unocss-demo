<script lang="ts" setup>
import EchartsArea from '@/components/echarts/echarts-area.vue'
import EchartsIndex from '@/components/echarts/echarts-index.vue'
import EchartsOneLine from '@/components/echarts/echarts-one-line.vue'
</script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.5, duration: 0.3, y: 35, x: 0 },
      children: false,
    }"
    direction="vertical"
    wrap
    class="m-[20px_0px]"
  >
    <EchartsIndex />
    <EchartsArea />
    <EchartsOneLine />
  </ASpace>
</template>

<style lang="less" scoped></style>
