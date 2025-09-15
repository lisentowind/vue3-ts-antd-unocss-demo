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
  theme: {
    colors: {
      // 动态主题色
      primary: `var(--color-primary)`,
      // 从antd获取的变量值
      bgPrimary: `var(--colorBgContainer)`,
      textBaseColor: `var(--colorTextBase)`,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
  },
})
