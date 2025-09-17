import eslintPlugin from '@nabla/vite-plugin-eslint'
import { mergeConfig } from 'vite'
// import vueDevTools from 'vite-plugin-vue-devtools'
import baseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'development',
    server: {
      open: false,
      host: '0.0.0.0',
      port: 6868,
      fs: {
        strict: true,
      },
    },
    plugins: [
      eslintPlugin({
        eslintOptions: {
          cache: false,
        },
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
