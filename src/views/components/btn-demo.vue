<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage, useModal } from '@/hooks'
import { useThemeStore } from '@/store'
import { AppEventEmitter, rgbaToHex } from '@/utils'
import { handelChangeThemeModeAnimation } from '@/utils/modules/theme-animation'

const themeStore = useThemeStore()
const route = useRoute()
const date = ref()
const color = ref(rgbaToHex(themeStore.getPrimaryColor))

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

function handelChangeThemeMode(e: MouseEvent) {
  if (e) {
    handelChangeThemeModeAnimation(e.clientX, e.clientY, toggleDark)
  }
}

function handelRefreshPage() {
  AppEventEmitter.emit('refreshPage', {
    path: route.path,
  })
}

watch(
  () => color.value,
  (v) => {
    updateColor(v)
  },
  { flush: 'post' },
)

// 监听主题色变化，同步到颜色输入框
watch(
  () => themeStore.getPrimaryColor,
  (newColor) => {
    color.value = rgbaToHex(newColor)
  },
)
</script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.3, duration: 0.3, y: 35, x: 0 },
    }"
    wrap
  >
    <AButton type="primary" @click="(e) => handelChangeThemeMode(e)">
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
  </ASpace>
</template>

<style lang="less" scoped></style>
