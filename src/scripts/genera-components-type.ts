import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** 项目路径 */
const ROOT = path.resolve(__dirname, '../../src')
const COMPONENTS_INDEX = path.resolve(ROOT, 'components/index.ts')
const GLOBAL_DTS = path.resolve(ROOT, 'global.d.ts')

// 读取 index.ts 内容
const content = fs.readFileSync(COMPONENTS_INDEX, 'utf-8')

/** 生成 GlobalComponents 内部声明字符串 */
const generatedLines: string[] = []

// 1. 解析 customComponents 对象
const customComponentsMatch = content.match(
  /const\s+customComponents\s*=\s*\{([^}]+)\}/,
)
if (customComponentsMatch) {
  const customComponentsContent = customComponentsMatch[1]
  // 匹配对象中的每一行，格式如：CustomIcon, 或 CustomMouse,
  const componentNames = customComponentsContent
    .split(',')
    .map((line) => line.trim())
    .filter(Boolean)

  for (const name of componentNames) {
    // 匹配对应的 import 语句
    const importRegex = new RegExp(`import\\s+${name}\\s+from\\s+['"](.+?)['"]`)
    const importMatch = content.match(importRegex)

    if (importMatch) {
      let filePath = importMatch[1]

      // 修正路径
      if (filePath.startsWith('@/')) {
        // 保留原样
      } else if (filePath.startsWith('./') || filePath.startsWith('../')) {
        filePath = filePath
          .replace(/^\.\/?/, '@/components/')
          .replace(/^@\//, '@/')
      } else if (filePath.startsWith('@//')) {
        filePath = filePath.replace('@//', '@/')
      }

      generatedLines.push(
        `    ${name}: typeof import('${filePath}')['default']`,
      )
    }
  }
}

// 2. 解析 antdComponentNames 数组
const antdComponentNamesMatch = content.match(
  /const\s+antdComponentNames[^[]*\[([\s\S]*?)\]/,
)
if (antdComponentNamesMatch) {
  const antdComponentsContent = antdComponentNamesMatch[1]
  // 匹配数组中的每个字符串，格式如：'Alert', 或 'Button',
  const componentNames =
    antdComponentsContent
      .match(/'(\w+)'/g)
      ?.map((match) => match.replace(/'/g, ''))
      .filter(Boolean) || []

  for (const name of componentNames) {
    generatedLines.push(
      `    A${name}: typeof import('ant-design-vue')['${name}']`,
    )
  }
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
