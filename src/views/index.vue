<script setup lang="ts">
import { ref } from 'vue'

import { useThemeStore } from '@/store'

import ApiDemo from './components/api-demo.vue'
import BtnDemo from './components/btn-demo.vue'
import EchartsDemo from './components/echarts-demo.vue'
import IconDemo from './components/icon-demo.vue'
import LocalDemo from './components/local-demo.vue'
import UploadDemo from './components/upload-demo.vue'

const activeKey = ref('1')

const themeStore = useThemeStore()
</script>

<template>
  <div
    class="min-h-100vh w-100vw flex items-center justify-center overflow-hidden overflow-y-auto bg-bgPrimary p-[20px_0]"
  >
    <div
      v-glow-border="{
        color: themeStore.getPrimaryColor,
        radius: '15px',
      }"
      class="min-w-40vw flex flex-col items-center justify-center rounded-15px bg-bgPrimary p-30px shadow-xl"
    >
      <h1
        v-gsap="{
          options: { delay: 0.1, duration: 0.3, y: 35, x: 0 },
          children: false,
        }"
        class="color-primary"
      >
        基础功能演示
      </h1>

      <ATabs v-model:active-key="activeKey" class="w-100%">
        <ATabPane key="1" :tab="$t('app.tabs.button')">
          <BtnDemo />
        </ATabPane>
        <ATabPane key="2" :tab="$t('app.tabs.icon')">
          <IconDemo />
        </ATabPane>
        <ATabPane key="3" :tab="$t('app.tabs.locale')">
          <LocalDemo />
        </ATabPane>
        <ATabPane key="4" :tab="$t('app.tabs.api')">
          <ApiDemo />
        </ATabPane>
        <ATabPane key="5" :tab="$t('app.tabs.echarts')">
          <EchartsDemo />
        </ATabPane>
        <ATabPane key="6" :tab="$t('app.tabs.upload')">
          <UploadDemo />
        </ATabPane>
      </ATabs>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
