import type { Plugin } from 'vite'
import { exec } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import pc from 'picocolors'

export interface GenTypesPluginOptions {
  /**
   * 何时执行生成逻辑：
   * - "serve"：仅开发环境生效（默认）
   * - "build"：仅构建阶段执行
   * - "all"：两者都执行
   */
  mode?: 'serve' | 'build' | 'all'

  /**
   * 监听的文件或目录路径，可以传绝对或相对
   * 默认： ['src/components']
   */
  watchPaths?: string[]

  /**
   * 文件过滤器，匹配到的文件才会触发
   * 默认： /src\/components\//
   */
  filter?: RegExp

  /**
   * 执行的命令（默认：pnpm gen:types）
   */
  command?: string

  /**
   * 防抖间隔，默认 300ms
   */
  debounce?: number

  /**
   * 开发阶段是否在启动时执行一次（默认 true）
   */
  runOnStart?: boolean

  /**
   * 构建阶段是否在打包结束后执行一次（默认 false）
   */
  runOnBuildEnd?: boolean
}

/**
 * @description 自动生成组件类型的 Vite 插件
 */
export function GenTypesPlugin(options: GenTypesPluginOptions = {}): Plugin {
  const {
    mode = 'serve',
    watchPaths = ['src/components'],
    filter = /src[/\\]components[/\\]/,
    command = 'pnpm gen:types',
    debounce = 300,
    runOnStart = true,
    runOnBuildEnd = false,
  } = options

  let timer: NodeJS.Timeout | null = null
  let isRunning = false

  const runCommand = () => {
    if (isRunning)
      return
    isRunning = true

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(pc.red(`❌ [gen:types] 执行失败\n${stderr || stdout}`))
      }
      else {
        console.log(pc.green('🟢 [gen:types] 类型文件已更新'))
      }
      isRunning = false
    })
  }

  const scheduleRun = () => {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(runCommand, debounce)
  }

  const shouldApply = (hook: 'serve' | 'build') =>
    mode === 'all' || mode === hook

  return {
    name: 'vite-plugin-auto-gen-types',

    apply: mode === 'all' ? undefined : mode,

    /** dev server 启动时执行一次 */
    buildStart() {
      if (shouldApply('serve') && runOnStart) {
        console.log(pc.cyan('🚀 [gen:types] 开发启动 → 生成类型'))
        scheduleRun()
      }
    },

    /** dev 环境文件监听 */
    configureServer(server) {
      if (!shouldApply('serve'))
        return

      const resolvedPaths = watchPaths.map(p =>
        path.isAbsolute(p) ? p : path.resolve(process.cwd(), p),
      )

      server.watcher.add(resolvedPaths)

      server.watcher.on('change', (file) => {
        if (filter.test(file)) {
          console.log(pc.yellow(`🔄 文件更改,重新生成类型文件中 → ${file}`))
          scheduleRun()
        }
      })
    },

    /** build 结束执行 */
    closeBundle() {
      if (shouldApply('build') && runOnBuildEnd) {
        console.log(pc.cyan('📦 构建结束 → 生成类型...'))
        runCommand()
      }
    },
  }
}
