<script setup lang="ts">
import type CustomIcon from '@/components/CustomIcon/CustomIcon.vue'
import { useDark, useToggle } from '@vueuse/core'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import { getPostInfo } from '@/apis/modules/mock'
import EchartsArea from '@/components/echarts/echarts-area.vue'
import EchartsIndex from '@/components/echarts/echarts-index.vue'
import { useMessage, useModal } from '@/hooks'
import useLocale from '@/hooks/modules/useLocale'
import { LOCALE_OPTIONS } from '@/locale'
import { useAppStore, useThemeStore } from '@/store'
import { AppEventEmitter } from '@/utils'

const appStore = useAppStore()
const themeStore = useThemeStore()
const route = useRoute()
const { currentLocale, changeLocale } = useLocale()
const color = ref(themeStore.getPrimaryColor)
const date = ref()
const localeLanguage = ref(currentLocale.value)
// 主题
const isDark = useDark({
  onChanged(dark: boolean) {
    themeStore.setThemeDark(dark ? 'dark' : 'light')
  },
})
const toggleDark = useToggle(isDark)
const { msgSuccess } = useMessage()
const updateColor = debounce((v: string) => {
  themeStore.setPrimaryColor(v)
}, 200)
const { modalConfirm } = useModal()

const { run, loading } = useRequest(getPostInfo, {
  manual: true,
  onSuccess(res) {
    if (res.data) {
      msgSuccess({
        content: '接口响应成功!',
      })
    }
  },
})

function handelMsg() {
  msgSuccess({
    content: 'Hello  msgSuccess!',
  })
}

function handelModal() {
  modalConfirm({
    title: 'modalWarning',
    content: 'Hello modalWarning!',
  })
}

function handelChangeThemeMode() {
  toggleDark()
}

function handelRefreshPage() {
  AppEventEmitter.emit('refreshPage', {
    path: route.path,
  })
}

function handelFetch() {
  run('1')
}

watch(
  () => color.value,
  (v) => {
    updateColor(v)
  },
  { flush: 'post' },
)

watch(
  () => localeLanguage.value,
  (v) => {
    changeLocale(v)
  },
)
</script>

<template>
  <div class="h-100vh w-100vw flex items-center justify-center bg-bgPrimary">
    <div
      v-glow-border="{
        color: themeStore.getPrimaryColor,
        radius: '15px',
      }"
      class="flex flex-col items-center justify-center rounded-15px bg-bgPrimary p-30px shadow-xl"
    >
      <h1
        v-gsap="{
          options: { delay: 0.1, duration: 0.3, y: 35, x: 0 },
        }"
        class="color-primary"
      >
        基础功能演示
      </h1>
      <ASpace
        v-gsap="{
          options: { delay: 0.1, duration: 0.3, y: 35, x: 0 },
        }"
      >
        <CustomIcon size="30px" icon="tabler:lock-open" />
        <CustomIcon size="30px" icon="line-md:github" />
        <CustomIcon size="30px" icon="line-md:my-location" />
      </ASpace>

      <ASpace
        v-gsap="{
          options: { delay: 0.3, duration: 0.3, y: 35, x: 0 },
          children: false,
        }"
        wrap
        class="m-[20px_0px]"
      >
        <span
          class="text-30px color-textBaseColor transition-all hover:color-primary"
        >{{ appStore.getAppName }}</span>
        <CustomIcon
          :has-default-class="false"
          class="color-primary"
          size="30px"
          icon="tabler:lock"
        />
        <CustomIcon size="30px" icon="tabler:lock-open" />
        <CustomIcon size="30px" icon="line-md:github" />
        <CustomIcon size="30px" icon="line-md:my-location" />
        <AButton type="primary" @click="handelChangeThemeMode">
          {{ themeStore.getThemeDark }} {{ $t('app.theme') }}
        </AButton>
        <AButton type="primary" @click="handelMsg">
          {{ $t('app.btn.msg') }}
        </AButton>
        <AButton type="primary" @click="handelModal">
          {{ $t('app.btn.modal') }}
        </AButton>
        <AButton type="primary" @click="handelRefreshPage">
          {{ $t('app.event.reload') }}
        </AButton>
        <AInput
          v-model:value="color"
          type="color"
          class="h-40px w-40px"
          placeholder="自定义主色"
        />
        <ADatePicker v-model:value="date" class="w-150px" />
        <ASelect
          v-model:value="localeLanguage"
          :options="LOCALE_OPTIONS"
          class="w-150px"
        />
        <AButton type="primary" :loading="loading" @click="handelFetch">
          {{ $t('app.event.fetch') }}
        </AButton>
      </ASpace>
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
    </div>
  </div>
</template>

<style scoped lang="less"></style>
