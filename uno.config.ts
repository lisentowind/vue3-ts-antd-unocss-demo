import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
        theme: {
          mode: true, // 强制完整生成 theme 变量
        },
      },
    }),
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
      'test': 'red',
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
      // 错误色
      'error-1': `rgb(var(--colorError-value) / 0.1)`,
      'error-2': `rgb(var(--colorError-value) / 0.2)`,
      'error-3': `rgb(var(--colorError-value) / 0.3)`,
      'error-4': `rgb(var(--colorError-value) / 0.4)`,
      'error-5': `rgb(var(--colorError-value) / 0.5)`,
      'error-6': `rgb(var(--colorError-value) / 0.6)`,
      'error-7': `rgb(var(--colorError-value) / 0.7)`,
      'error-8': `rgb(var(--colorError-value) / 0.8)`,
      'error-9': `rgb(var(--colorError-value) / 0.9)`,
      // 成功色
      'success-1': `rgb(var(--colorSuccess-value) / 0.1)`,
      'success-2': `rgb(var(--colorSuccess-value) / 0.2)`,
      'success-3': `rgb(var(--colorSuccess-value) / 0.3)`,
      'success-4': `rgb(var(--colorSuccess-value) / 0.4)`,
      'success-5': `rgb(var(--colorSuccess-value) / 0.5)`,
      'success-6': `rgb(var(--colorSuccess-value) / 0.6)`,
      'success-7': `rgb(var(--colorSuccess-value) / 0.7)`,
      'success-8': `rgb(var(--colorSuccess-value) / 0.8)`,
      'success-9': `rgb(var(--colorSuccess-value) / 0.9)`,
      // 警告色
      'warning-1': `rgb(var(--colorWarning-value) / 0.1)`,
      'warning-2': `rgb(var(--colorWarning-value) / 0.2)`,
      'warning-3': `rgb(var(--colorWarning-value) / 0.3)`,
      'warning-4': `rgb(var(--colorWarning-value) / 0.4)`,
      'warning-5': `rgb(var(--colorWarning-value) / 0.5)`,
      'warning-6': `rgb(var(--colorWarning-value) / 0.6)`,
      'warning-7': `rgb(var(--colorWarning-value) / 0.7)`,
      'warning-8': `rgb(var(--colorWarning-value) / 0.8)`,
      'warning-9': `rgb(var(--colorWarning-value) / 0.9)`,
      // 提示色
      'info-1': `rgb(var(--colorInfo-value) / 0.1)`,
      'info-2': `rgb(var(--colorInfo-value) / 0.2)`,
      'info-3': `rgb(var(--colorInfo-value) / 0.3)`,
      'info-4': `rgb(var(--colorInfo-value) / 0.4)`,
      'info-5': `rgb(var(--colorInfo-value) / 0.5)`,
      'info-6': `rgb(var(--colorInfo-value) / 0.6)`,
      'info-7': `rgb(var(--colorInfo-value) / 0.7)`,
      'info-8': `rgb(var(--colorInfo-value) / 0.8)`,
      'info-9': `rgb(var(--colorInfo-value) / 0.9)`,

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
