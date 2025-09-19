<script lang="ts" setup>
import { theme } from 'ant-design-vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiEventHandle } from './apis/event'
import { useMessage, useModal } from './hooks'
import useLocale from './hooks/modules/useLocale'
import { useThemeColor } from './hooks/modules/useThemeColor'
import { useThemeStore } from './store'
import { AppEventEmitter } from './utils'
import 'dayjs/locale/zh-cn'

// 引入dayjs全局语言包
dayjs.locale(zhCN.locale)

// 引入全局事件监听
ApiEventHandle()

// 引入全局主题颜色
const themeStore = useThemeStore()

// 引入全局消息组件
const { msgContextHolder, destroyAll: msgDestroyAll, msgSuccess } = useMessage()

// 引入全局模态框组件 函数式的简单弹窗
const { modalContextHolder, destroyAll: modalDestroyAll } = useModal()

// 引入全局语言包
const { currentLocale } = useLocale()

const { t } = useI18n()

const isDark = computed(() => themeStore.themeMode === 'dark')

const primaryColor = computed(() => themeStore.primaryColor)

function setThemePrimaryColor(color: string) {
  document.body.style.setProperty('--color-primary', color)
}

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
  useThemeColor()
  setThemePrimaryColor(primaryColor.value)
  // 测试事件总线
  AppEventEmitter.on('refreshPage', (val) => {
    if (val.path) {
      msgSuccess({
        content: `${t('app.event.reload.front')} ${val.path} ${t(
          'app.event.reload.back',
        )}`,
      })
      setTimeout(() => {
        location.reload()
      }, 500)
    }
  })
})

onBeforeUnmount(() => {
  AppEventEmitter.off('refreshPage')
  msgDestroyAll()
  modalDestroyAll()
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
    :locale="locale"
  >
    <msgContextHolder />
    <modalContextHolder />
    <CustomMouse />
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style lang="less" scoped></style>
