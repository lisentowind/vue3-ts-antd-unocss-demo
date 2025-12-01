<script setup lang="ts">
import { ref } from 'vue'

import { useThemeStore } from '@/store'

import ApiDemo from './components/api-demo.vue'
import BtnDemo from './components/btn-demo.vue'
import EchartsDemo from './components/echarts-demo.vue'
import IconDemo from './components/icon-demo.vue'
import LocalDemo from './components/local-demo.vue'
import UploadDemo from './components/upload-demo.vue'
import ZodApiDemo from './components/zod-api-demo.vue'
import ZodDataDemo from './components/zod-data-demo.vue'
import ZodFormDemo from './components/zod-form-demo.vue'
import ZodHooksDemo from './components/zod-hooks-demo.vue'

const activeKey = ref('1')

const themeStore = useThemeStore()

const titleArr = ['基础功能演示']
</script>

<template>
  <div
    class="p-[20px_0] bg-bgPrimary flex min-h-100vh w-100vw items-center justify-center overflow-hidden overflow-y-auto"
  >
    <div
      v-glow-border="{
        color: themeStore.getPrimaryColor,
        radius: '15px',
      }"
      class="p-30px rounded-15px bg-bgPrimary flex flex-col min-w-40vw shadow-xl items-center justify-center"
    >
      <h1
        v-gsap="{
          options: { delay: 0.1, duration: 0.3, y: 35, x: 0 },
          children: false,
        }"
        class="color-primary"
      >
        {{ titleArr.at(0) }}
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
        <ATabPane key="7" :tab="$t('app.tabs.zod-form')">
          <ZodFormDemo />
        </ATabPane>
        <ATabPane key="8" :tab="$t('app.tabs.zod-data')">
          <ZodDataDemo />
        </ATabPane>
        <ATabPane key="9" :tab="$t('app.tabs.zod-api')">
          <ZodApiDemo />
        </ATabPane>
        <ATabPane key="10" :tab="$t('app.tabs.zod-hooks')">
          <ZodHooksDemo />
        </ATabPane>
      </ATabs>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
