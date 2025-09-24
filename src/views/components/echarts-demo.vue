<script lang="ts" setup>
import EchartsArea from '@/components/echarts/echarts-area.vue'
import EchartsIndex from '@/components/echarts/echarts-index.vue'
</script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.5, duration: 0.3, y: 35, x: 0 },
      children: false,
    }"
    wrap
    class="m-[20px_0px]"
  >
    <EchartsIndex />
    <EchartsArea />
  </ASpace>
</template>

<style lang="less" scoped></style>
