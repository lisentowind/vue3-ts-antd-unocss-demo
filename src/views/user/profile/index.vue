<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { colord } from 'colord'
import { debounce } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks'
import { useThemeStore, useUserStore } from '@/store'
import { rgbaToHex } from '@/utils'
import { handelChangeThemeModeAnimation } from '@/utils/modules/theme-animation'

const { locale } = useI18n()
const themeStore = useThemeStore()
const userStore = useUserStore()
const { msgSuccess } = useMessage()

// 自定义主题色
const customColor = ref(rgbaToHex(themeStore.getPrimaryColor))

// 语言选项
const languageOptions = [
  { label: '简体中文', value: 'zh' },
  { label: 'English', value: 'en' },
]

// 主题模式
const isDark = useDark({
  onChanged(dark: boolean) {
    themeStore.setThemeDark(dark ? 'dark' : 'light')
  },
})
const toggleDark = useToggle(isDark)

// 当前语言
const currentLanguage = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value
    msgSuccess({ content: `语言已切换为${value === 'zh' ? '简体中文' : 'English'}` })
  },
})

// 主题颜色
const primaryColorValue = computed(() => themeStore.getPrimaryColor)

// 预设主题颜色
const presetColors = [
  { label: '蓝色', value: '#1890ff' },
  { label: '绿色', value: '#52c41a' },
  { label: '金色', value: '#faad14' },
  { label: '红色', value: '#f5222d' },
  { label: '紫色', value: '#722ed1' },
  { label: '青色', value: '#13c2c2' },
  { label: '粉色', value: '#eb2f96' },
  { label: '橙色', value: '#fa8c16' },
]

// 预设颜色变化处理
function handleColorChange(color: string) {
  const hexColor = colord(color).toHex()
  const rgbaColor = `rgba(${colord(hexColor).toRgb().r},${colord(hexColor).toRgb().g},${colord(hexColor).toRgb().b},1)`
  themeStore.setPrimaryColor(rgbaColor)
  customColor.value = hexColor
  msgSuccess({ content: '主题色已更新' })
}

// 自定义颜色变化处理（带防抖）
const updateCustomColor = debounce((color: string) => {
  const hexColor = colord(color).toHex()
  const rgbaColor = `rgba(${colord(hexColor).toRgb().r},${colord(hexColor).toRgb().g},${colord(hexColor).toRgb().b},1)`
  themeStore.setPrimaryColor(rgbaColor)
  msgSuccess({ content: '自定义主题色已更新' })
}, 200)

// 主题模式切换（带动画）
function handleChangeThemeMode(e: MouseEvent) {
  if (e) {
    handelChangeThemeModeAnimation(e.clientX, e.clientY, toggleDark)
  }
}

// 监听自定义颜色变化
watch(
  () => customColor.value,
  (newColor) => {
    updateCustomColor(newColor)
  },
  { flush: 'post' },
)

// 监听主题色变化，同步到自定义颜色输入框
watch(
  () => themeStore.getPrimaryColor,
  (newColor) => {
    customColor.value = rgbaToHex(newColor)
  },
)
</script>

<template>
  <div class="space-y-6">
    <ACard title="个人信息" :bordered="false">
      <div class="flex gap-6 items-center">
        <AAvatar :size="80" :src="userStore.userInfo?.avatar" />
        <div>
          <div class="text-xl text-gray-800 font-semibold mb-2">
            {{ userStore.userInfo?.nickname }}
          </div>
          <div class="text-gray-500">
            {{ userStore.userInfo?.username }}
          </div>
        </div>
      </div>
    </ACard>

    <ACard title="主题设置" :bordered="false">
      <ASpace direction="vertical" :size="24" class="w-full">
        <!-- 暗黑模式 -->
        <div class="flex items-center justify-between">
          <div>
            <div class="text-base text-gray-800 font-medium mb-1">
              <CustomIcon icon="material-symbols:dark-mode-outline" class="mr-2" />
              暗黑模式
            </div>
            <div class="text-sm text-gray-500">
              切换明亮/暗黑主题模式（点击按钮有切换动画）
            </div>
          </div>
          <div class="flex gap-2 items-center">
            <ASwitch v-model:checked="isDark" />
            <AButton type="primary" @click="(e) => handleChangeThemeMode(e)">
              {{ themeStore.getThemeDark === 'dark' ? '🌙 暗黑' : '☀️ 明亮' }}
            </AButton>
          </div>
        </div>

        <!-- 语言设置 -->
        <div class="flex items-center justify-between">
          <div>
            <div class="text-base text-gray-800 font-medium mb-1">
              <CustomIcon icon="material-symbols:language" class="mr-2" />
              语言设置
            </div>
            <div class="text-sm text-gray-500">
              选择界面显示语言
            </div>
          </div>
          <ASelect
            v-model:value="currentLanguage"
            :options="languageOptions"
            class="w-32"
          />
        </div>

        <!-- 主题色 -->
        <div>
          <div class="text-base text-gray-800 font-medium mb-3">
            <CustomIcon icon="material-symbols:palette-outline" class="mr-2" />
            主题色
          </div>
          <div class="text-sm text-gray-500 mb-4">
            选择喜欢的主题颜色或自定义颜色
          </div>

          <!-- 预设颜色 -->
          <div class="mb-4 flex flex-wrap gap-3">
            <div
              v-for="color in presetColors"
              :key="color.value"
              class="group flex flex-col gap-2 cursor-pointer items-center"
              @click="handleColorChange(color.value)"
            >
              <div
                class="rounded-lg flex h-12 w-12 transition-all items-center justify-center hover:scale-110"
                :style="{ backgroundColor: color.value }"
              >
                <CustomIcon
                  v-if="colord(primaryColorValue).toHex() === colord(color.value).toHex()"
                  icon="material-symbols:check"
                  class="text-xl text-white"
                />
              </div>
              <span class="text-xs text-gray-600 group-hover:text-gray-800">
                {{ color.label }}
              </span>
            </div>
          </div>

          <!-- 自定义颜色 -->
          <div class="pt-4 border-t flex gap-3 items-center">
            <div class="flex-1">
              <div class="text-sm text-gray-700 font-medium mb-1">
                自定义主题色
              </div>
              <div class="text-xs text-gray-500">
                点击色块选择任意颜色
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <AInput
                v-model:value="customColor"
                type="color"
                class="h-10 w-20 cursor-pointer"
              />
              <AInput
                v-model:value="customColor"
                placeholder="#1890ff"
                class="w-28"
                size="small"
              />
            </div>
          </div>
        </div>
      </ASpace>
    </ACard>
  </div>
</template>

<style scoped lang="less">
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
</style>
