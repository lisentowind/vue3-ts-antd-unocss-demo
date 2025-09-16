<script lang="ts" setup>
import { theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useMessage, useModal } from './hooks'
import { useThemeColor } from './hooks/modules/useThemeColor'
import { useThemeStore } from './store'
import { AppEventEmitter } from './utils'
import 'dayjs/locale/zh-cn'

dayjs.locale(zhCN.locale)

const themeStore = useThemeStore()

// 引入全局消息组件
const { msgContextHolder, msgSuccess } = useMessage()
// 引入全局模态框组件 函数式的简单弹窗
const { modalContextHolder } = useModal()

const isDark = computed(() => themeStore.themeMode === 'dark')
const primaryColor = computed(() => themeStore.primaryColor)

function setThemePrimaryColor(color: string) {
  document.body.style.setProperty('--color-primary', color)
}

onMounted(() => {
  useThemeColor()
  setThemePrimaryColor(primaryColor.value)
  // 测试事件总线
  AppEventEmitter.on('refreshPage', (val) => {
    if (val.path) {
      msgSuccess({
        content: `即将刷新 ${val.path} 路由页面`,
      })
      setTimeout(() => {
        location.reload()
      }, 500)
    }
  })
})

onBeforeUnmount(() => {
  AppEventEmitter.off('refreshPage')
})
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: primaryColor,
      },
    }"
    :locale="zhCN"
  >
    <msgContextHolder />
    <modalContextHolder />
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style lang="less" scoped></style>
