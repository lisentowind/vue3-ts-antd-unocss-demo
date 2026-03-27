<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'

import { useThemeStore } from '@/store'

import {
  findPlaygroundTab,
  getDefaultPlaygroundTabKey,
  playgroundTabs,
} from '../demo-tabs'

const activeKey = ref(getDefaultPlaygroundTabKey())

const themeStore = useThemeStore()

const title = '基础功能演示'

const activeTab = computed(() => {
  return findPlaygroundTab(activeKey.value) ?? playgroundTabs[0]
})

type SyncComponentSourceType = Parameters<typeof defineAsyncComponent>[0]

const activeDemoComponent = computed(() => {
  if (!activeTab.value) {
    return null
  }

  return defineAsyncComponent(
    activeTab.value.loadComponent as SyncComponentSourceType,
  )
})
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
        {{ title }}
      </h1>

      <ATabs v-model:active-key="activeKey" class="w-100%">
        <ATabPane
          v-for="tab in playgroundTabs"
          :key="tab.key"
          :tab="$t(tab.titleKey)"
        >
          <component
            :is="activeDemoComponent"
            v-if="tab.key === activeKey && activeDemoComponent"
          />
        </ATabPane>
      </ATabs>
    </div>
  </div>
</template>

<style scoped lang="less"></style>
