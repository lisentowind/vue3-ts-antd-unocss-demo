<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { useMessage, useModal } from '@/hooks'
import { useAppStore, useThemeStore } from '@/store'

const appStore = useAppStore()
const themeStore = useThemeStore()

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

const updateColor = debounce((v: string) => {
  themeStore.setPrimaryColor(v)
}, 200)

watch(
  () => color.value,
  (v) => {
    console.log('🚀 ~ v:', v)
    updateColor(v)
  },
  { flush: 'post' },
)
</script>

<template>
  <div class="bg-bgPrimary h-100vh w-100vw flex items-center justify-center">
    <div
      v-glow-border="themeStore.getPrimaryColor"
      class="bg-bgPrimary h-500px w-500px flex flex flex-col cursor-pointer items-center justify-center rounded-md shadow-xl"
    >
      <ASpace class="mb-20px">
        <span class="color-textBaseColor text-30px transition-all hover:color-primary">{{
          appStore.getAppName
        }}</span>
        <CustomIcon
          class="color-textBaseColor cursor-pointer transition-all ease-in hover:color-primary"
          size="30px"
          icon="tabler:lock"
        />
        <CustomIcon
          class="color-textBaseColor cursor-pointer transition-all ease-in hover:color-primary"
          size="30px"
          icon="tabler:lock-open"
        />
        <CustomIcon
          class="color-textBaseColor cursor-pointer transition-all ease-in hover:color-primary"
          size="30px"
          icon="line-md:github"
        />
        <CustomIcon
          class="color-textBaseColor animate-duration-none cursor-pointer transition-all ease-in hover:scale-150 hover:color-primary"
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
      <ASpace>
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
