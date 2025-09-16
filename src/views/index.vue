<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage, useModal } from '@/hooks'
import { useAppStore, useThemeStore } from '@/store'
import { AppEventEmitter } from '@/utils'

const appStore = useAppStore()
const themeStore = useThemeStore()
const route = useRoute()

const color = ref(themeStore.getPrimaryColor)

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

function handelRefreshPage() {
  AppEventEmitter.emit('refreshPage', {
    path: route.path,
  })
}

const updateColor = debounce((v: string) => {
  themeStore.setPrimaryColor(v)
}, 200)

watch(
  () => color.value,
  (v) => {
    updateColor(v)
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="h-100vh w-100vw flex items-center justify-center bg-bgPrimary">
    <div
      v-glow-border="themeStore.getPrimaryColor"
      class="h-500px w-500px flex flex-col cursor-pointer items-center justify-center rounded-md bg-bgPrimary shadow-xl"
    >
      <ASpace class="mb-20px">
        <span
          class="text-30px color-textBaseColor transition-all hover:color-primary"
        >{{ appStore.getAppName }}</span>
        <CustomIcon size="30px" icon="tabler:lock" />
        <CustomIcon size="30px" icon="tabler:lock-open" />
        <CustomIcon size="30px" icon="line-md:github" />
        <CustomIcon size="30px" icon="line-md:my-location" />

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
      <ASpace>
        <AButton type="primary" @click="handelRefreshPage">
          事件总线刷新页面
        </AButton>
        <AInput v-model:value="color" type="color" class="h-50px w-40px" />
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
