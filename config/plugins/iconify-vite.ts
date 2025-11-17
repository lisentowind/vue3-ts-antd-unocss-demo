import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import pc from 'picocolors'
import { loadEnv } from 'vite'

interface IconifyPluginOptions {
  collections: string[]
}

/**
 * @description 描述
 * @date 2025-11-17 16:48:49
 * @author tingfeng
 *
 * Iconify 的vite自定义插件 用于 自动引入图标  当该项目是在线模式下，则使用在线图标加载减小打包后的体积
 * 当项目处于离线模式下，则使用本地图标 但是需要安装对应的 iconify-json包
 * 比如 line-md  pnpm add @iconify-json/line-md -D 然后在插件中使用
 * plugins: [
    VitePluginIconify({
      collections: ['line-md'], // 需要支持的图标集
    }),
  ],
 */
export default function VitePluginIconify(
  options: IconifyPluginOptions,
): Plugin {
  const { collections } = options
  let isOffline = false

  return {
    name: 'vite-plugin-iconify',

    // 解析配置
    configResolved(config) {
      const env = loadEnv(config.mode, process.cwd())
      isOffline = env.VITE_APP_IS_OFFLINE === 'true'

      const modeStr = pc.cyan(`mode=${config.mode}`)
      const title = pc.bold(pc.green('Iconify 🔧 图标加载模式'))

      const message = isOffline
        ? pc.yellow(
            `离线模式 🧩 本地加载图标集: ${pc.magenta(collections.join(', '))}`,
          )
        : pc.blue('在线模式 🌐 通过 Iconify API 加载图标')

      console.log(`\n${title} → ${modeStr}\n${message}\n`)

      // ➕ 新增：离线模式下自动检查依赖是否安装
      if (isOffline) {
        collections.forEach((name) => {
          const pkg = `@iconify-json/${name}`
          const pkgPath = path.join(process.cwd(), 'node_modules', pkg)

          if (!fs.existsSync(pkgPath)) {
            console.error(
              pc.red(
                `❌ 未找到本地图标集 ${pc.bold(
                  name,
                )}，请安装：\n  pnpm add ${pkg} -D`,
              ),
            )
          }
        })
      }
    },

    // 转换 main.ts
    async transform(code, id) {
      // ➕ 新增：支持任意目录的 main.ts/main.js
      if (!/\/main\.(?:ts|js|tsx)$/.test(id))
        return null

      // 只有离线才注入
      if (isOffline && collections.length > 0) {
        const imports: string[] = []
        const registers: string[] = []

        collections.forEach((name, index) => {
          const varName = `icons${index}`
          imports.push(
            `import { icons as ${varName} } from '@iconify-json/${name}'`,
          )
          registers.push(`addCollection(${varName})`)
        })

        const injectCode = `
          import { addCollection } from '@iconify/vue'
          ${imports.join('\n')}
          ${registers.join('\n')}
        `

        console.log(
          pc.green(`✔ 为入口文件注入 Iconify 本地图标: ${pc.cyan(id)}`),
        )

        return {
          code: `${injectCode}\n${code}`,
          map: null,
        }
      }

      return null
    },
  }
}
