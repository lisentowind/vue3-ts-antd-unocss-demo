import fs from 'node:fs'
import path from 'node:path'

/** 项目路径 */
const ROOT = path.resolve(__dirname, '../../src')
const COMPONENTS_INDEX = path.resolve(ROOT, 'components/index.ts')
const GLOBAL_DTS = path.resolve(ROOT, 'global.d.ts')

// 读取 index.ts 内容
const content = fs.readFileSync(COMPONENTS_INDEX, 'utf-8')

// 匹配自定义组件注册语句：Vue.component('CustomIcon', CustomIcon)
const customImports = Array.from(
  content.matchAll(/Vue\.component\('(\w+)',\s*(\w+)\)/g),
).map(([, name, variable]) => ({ name, variable }))

// 匹配 ant-design-vue 组件导入
const antdMatches = Array.from(
  content.matchAll(/import\s*\{([^}]+)\}\s*from\s*'ant-design-vue'/g),
)
const antdList = antdMatches
  .flatMap(([, inside]) =>
    inside
      .split(',')
      .map(v => v.trim())
      .filter(Boolean),
  )
  .map(name => ({ key: `A${name}`, importName: name }))

/** 生成 GlobalComponents 内部声明字符串 */
const generatedLines: string[] = []

for (const { name, variable } of customImports) {
  // 匹配 import 语句
  const reg = new RegExp(`import\\s+${variable}\\s+from\\s+['"](.+?)['"]`)
  const match = content.match(reg)
  if (match) {
    let filePath = match[1]

    // 修正路径
    if (filePath.startsWith('@/')) {
      // 保留原样
    }
    else if (filePath.startsWith('./') || filePath.startsWith('../')) {
      filePath = filePath
        .replace(/^\.\/?/, '@/components/')
        .replace(/^@\//, '@/')
    }
    else if (filePath.startsWith('@//')) {
      filePath = filePath.replace('@//', '@/')
    }

    generatedLines.push(`    ${name}: typeof import('${filePath}')['default']`)
  }
}

for (const { key, importName } of antdList) {
  generatedLines.push(
    `    ${key}: typeof import('ant-design-vue')['${importName}']`,
  )
}

/** 合成要插入的完整代码块 */
const newGlobalComponentsBlock = `export interface GlobalComponents {\n${generatedLines.join(
  '\n',
)}\n  }`

// 读取 global.d.ts 原始内容
const oldGlobalContent = fs.readFileSync(GLOBAL_DTS, 'utf-8')

// 替换 GlobalComponents 块
const updatedContent = oldGlobalContent.replace(
  /export\s+interface\s+GlobalComponents\s*\{[\s\S]*?\}/,
  newGlobalComponentsBlock,
)

fs.writeFileSync(GLOBAL_DTS, updatedContent, 'utf-8')

console.log(`✅ 已更新 GlobalComponents 类型声明至 ${GLOBAL_DTS}`)
