import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTypography(),
    presetIcons({
      /* options */
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  rules: [
    // 样式规则
  ],
  shortcuts: [
    {
      // 默认图标样式
      'icon-default':
        'color-textBaseColor transition-all ease-in active:scale-80 hover:color-primary',
    },
  ],
  theme: {
    colors: {
      // 动态主题色
      'primary': `var(--color-primary)`,
      'primary-1': `rgb(var(--color-primary-value) / 0.1)`,
      'primary-2': `rgb(var(--color-primary-value) / 0.2)`,
      'primary-3': `rgb(var(--color-primary-value) / 0.3)`,
      'primary-4': `rgb(var(--color-primary-value) / 0.4)`,
      'primary-5': `rgb(var(--color-primary-value) / 0.5)`,
      'primary-6': `rgb(var(--color-primary-value) / 0.6)`,
      'primary-7': `rgb(var(--color-primary-value) / 0.7)`,
      'primary-8': `rgb(var(--color-primary-value) / 0.8)`,
      'primary-9': `rgb(var(--color-primary-value) / 0.9)`,
      // 从antd获取的变量值
      'bgPrimary': `var(--colorBgContainer)`,
      'textBaseColor': `var(--colorTextBase)`,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
})
