import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'

import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// 手动定义 __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
    ],
    extensions: ['.ts', '.js'],
  },
  // 启用 Web Worker 支持
  worker: {
    format: 'es',
  },
  // 确保 Web Worker 可以使用模块
  optimizeDeps: {
    include: [],
    // exclude: ['@/workers/boundary-worker'],
  },
})
