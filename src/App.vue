<script lang="ts" setup>
import { message, theme } from 'ant-design-vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiEventHandle } from './apis/event'
import { setupAppRuntime } from './bootstrap/app-runtime'
import { useMessage, useModal } from './hooks'
import useLocale from './hooks/modules/useLocale'
import { useThemeColor } from './hooks/modules/useThemeColor'
import { useThemeStore } from './store'
import { AppEventEmitter, useUpdateDetector } from './utils'
import 'dayjs/locale/zh-cn'

// 引入dayjs全局语言包
dayjs.locale(zhCN.locale)

// 引入全局事件监听
ApiEventHandle()

// 引入全局主题颜色
const themeStore = useThemeStore()

// 引入全局消息组件
const { destroyAll: msgDestroyAll, msgSuccess } = useMessage()

// 引入全局模态框组件 函数式的简单弹窗
const { modalContextHolder: ModalContextHolder, destroyAll: modalDestroyAll }
  = useModal()

// 引入全局语言包
const { currentLocale } = useLocale()

const { t } = useI18n()

const isDark = computed(() => themeStore.themeMode === 'dark')

const primaryColor = computed(() => themeStore.primaryColor)

function setThemePrimaryColor(color: string) {
  themeStore.setPrimaryColor(color)
}

const useCustomMouse = ref(false)
let cleanupAppRuntime: (() => void) | undefined

const locale = computed(() => {
  switch (currentLocale.value) {
    case 'zh-CN':
      return zhCN
    case 'en-US':
      return enUS
    default:
      return zhCN
  }
})

onMounted(() => {
  cleanupAppRuntime = setupAppRuntime({
    primaryColor: primaryColor.value,
    applyThemeColors: () => {
      useThemeColor()
    },
    setPrimaryColor: setThemePrimaryColor,
    subscribeRefreshPage: (handler) => {
      AppEventEmitter.on('refreshPage', handler)
      return () => AppEventEmitter.off('refreshPage', handler)
    },
    notifyRefreshPage: (content) => {
      msgSuccess({ content })
    },
    reloadPage: () => {
      location.reload()
    },
    startUpdateDetector: () => {
      const detector = useUpdateDetector({
        url: '/', // 可选，默认 '/'
        onUpdate: () => {
          message.info('有新版本可用，请点击右上角刷新页面')
        },
      })

      return detector.stop
    },
    destroyMessages: msgDestroyAll,
    destroyModals: modalDestroyAll,
    t,
    scheduleReload: (reload) => {
      setTimeout(() => {
        reload()
      }, 500)
    },
  })
})

onBeforeUnmount(() => {
  cleanupAppRuntime?.()
})
</script>

<template>
  <AConfigProvider
    :locale="locale"
    :theme="{
      algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: primaryColor,
      },
    }"
  >
    <ModalContextHolder />
    <CustomMouse v-if="useCustomMouse" />
    <RouterView v-slot="{ Component }">
      <Transition mode="out-in" name="zoom-fade">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </AConfigProvider>
</template>

<style lang="less" scoped></style>
