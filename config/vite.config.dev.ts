import { mergeConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

import baseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: true,
      host: '0.0.0.0',
      port: 8888,
      fs: {
        strict: true,
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
        emitWarning: false,
      }),
      // vue开发工具非必要不要开 有性能问题
      // vueDevTools({
      //   // 默认打开vscode 可以设置为其他编辑器进行联动
      //   launchEditor: 'code',
      // }),
    ],
  },

  baseConfig,
)
