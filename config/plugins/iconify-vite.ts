import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

/**
 * Iconify 的vite自定义插件 用于 自动引入图标  当该项目是在线模式下，则使用在线图标加载减小打包后的体积
 * 当项目处于离线模式下，则使用本地图标 但是需要安装对应的 iconify-json包
 * 比如 line-md  pnpm add @iconify-json/line-md -D 然后在插件中使用
 * plugins: [
    VitePluginIconify({
      collections: ['line-md'], // 需要支持的图标集
    }),
  ],
 */

interface IconifyPluginOptions {
  collections: string[]
}

export default function VitePluginIconify(
  options: IconifyPluginOptions,
): Plugin {
  const { collections } = options
  let isOffline = false

  return {
    name: 'vite-plugin-iconify',

    configResolved(config) {
      // eslint-disable-next-line node/prefer-global/process
      const env = loadEnv(config.mode, process.cwd()) // 根据 mode 读取 .env 文件
      isOffline = env.VITE_APP_IS_OFFLINE === 'true'

      console.log(
        `[Iconify -- 图标加载模式 🔧] mode=${config.mode} ${
          isOffline
            ? `离线模式，要本地加载的图标集合: ${collections.join(', ')}`
            : '在线模式，API方式加载图标'
        }`,
      )
    },

    async transform(code, id) {
      if (id.endsWith('main.ts') || id.endsWith('main.js')) {
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
            import { addCollection } from '@iconify/vue';
            ${imports.join('\n')}
            ${registers.join('\n')}
          `

          return {
            code: `${injectCode}\n${code}`,
            map: null,
          }
        }
      }
      return null
    },
  }
}
