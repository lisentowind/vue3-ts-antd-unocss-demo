import legacy from '@vitejs/plugin-legacy'
import { mergeConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'

import baseConfig from './vite.config.base'

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      compression({
        algorithms: ['gzip'],
      }),
      legacy({
        targets: ['> 0.2%', 'not dead', 'not op_mini all'],
      }),
    ],
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console.log()
          drop_console: true,
          drop_debugger: true,
        },
      },
      //   关闭文件计算
      reportCompressedSize: false,
      //   关闭生成map文件 可以达到缩小打包体积
      sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
      rollupOptions: {
        output: {
          // 开启后可以手动分包但是遇到单个库大的包会很大
          manualChunks(id: any) {
            if (id.includes('node_modules')) {
              return (
                id
                  .toString()
                  .match(/node_modules\/(?!.pnpm)(?<moduleName>[^/]*)\//)
                  ?.groups!.moduleName ?? 'vendor'
              )
            }
          },
          // 核心配置：按类型分目录
          assetFileNames: (assetInfo: { name: string }) => {
            // 将 CSS 文件放入 css 目录
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name]-[hash][extname]'
            }
            // 其他资源文件（图片、字体等）放入 assets 目录
            return 'assets/[name]-[hash][extname]'
          },
          // JS 文件分两类存放
          chunkFileNames: 'js/chunks/[name]-[hash].js', // 代码分割产生的 chunk
          entryFileNames: 'js/entries/[name]-[hash].js', // 入口文件
        },
      },
      chunkSizeWarningLimit: 500,
      // 輸出目錄
      outDir: 'dist',
    },
  },
  baseConfig,
)
