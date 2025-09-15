<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { useMessage, useModal } from '@/hooks'
import { useAppStore, useThemeStore } from '@/store'

const appStore = useAppStore()
const themeStore = useThemeStore()

// 主题
const isDark = useDark({
  onChanged(dark: boolean) {
    themeStore.setThemeDark(dark ? 'dark' : 'light')
  },
})

const toggleDark = useToggle(isDark)

const { msgSuccess } = useMessage()
function handelMsg() {
  msgSuccess({
    content: 'Hello  msgSuccess!',
  })
}

const { modalConfirm } = useModal()
function handelModal() {
  modalConfirm({
    title: 'modalWarning',
    content: 'Hello modalWarning!',
  })
}

function handelChangeThemeMode() {
  toggleDark()
}
</script>

<template>
  <div class="h-100vh w-100vw flex items-center justify-center">
    <div
      v-glow-border
      class="h-500px w-500px flex cursor-pointer items-center justify-center rounded-md shadow-xl"
    >
      <ASpace>
        <span class="text-30px text-black" hover:color-green>{{
          appStore.getAppName
        }}</span>
        <CustomIcon
          class="cursor-pointer color-black transition-all ease-in hover:color-green"
          size="30px"
          icon="tabler:lock"
        />
        <CustomIcon
          class="cursor-pointer color-black transition-all ease-in hover:color-green"
          size="30px"
          icon="tabler:lock-open"
        />
        <CustomIcon
          class="cursor-pointer color-black transition-all ease-in hover:color-green"
          size="30px"
          icon="line-md:github"
        />
        <CustomIcon
          class="animate-duration-none cursor-pointer color-black transition-all ease-in hover:scale-150 hover:color-green"
          size="30px"
          icon="line-md:my-location"
        />

        <AButton type="primary" @click="handelChangeThemeMode">
          {{ themeStore.getThemeDark }}
        </AButton>
        <AButton type="primary" @click="handelMsg">
          消息
        </AButton>
        <AButton type="primary" @click="handelModal">
          函数弹窗
        </AButton>
      </ASpace>
    </div>
  </div>
</template>

<style scoped lang="less">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
