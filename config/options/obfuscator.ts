import type vitePluginBundleObfuscator from 'vite-plugin-bundle-obfuscator'

type ObfuscatorPluginConfig = Parameters<typeof vitePluginBundleObfuscator>[0]

type ObfuscatorOptions = ObfuscatorPluginConfig extends undefined
  ? any
  : ObfuscatorPluginConfig

// 基本配置
export const obfuscatorConfig: ObfuscatorOptions = {
  enable: true,
  log: false,
  autoExcludeNodeModules: true,
  threadPool: true,
  obfuscateWorker: true, // 是否启用 worker 的 混淆
  options: {
    compact: true, // 去掉空格
    controlFlowFlattening: true, // 控制流扁平化
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: false, // 不注入无用代码（会增加体积）
    disableConsoleOutput: true, // 去掉 console
    identifierNamesGenerator: 'hexadecimal',
    selfDefending: true, // 防止简单反混淆
    stringArray: true, // 字符串数组化
    stringArrayEncoding: ['base64'], // 字符串编码
    stringArrayThreshold: 0.8, // 80% 字符串混淆
  },
}

// 全部混淆示列
// export const obfuscatorConfigAll: ObfuscatorOptions = {
//   // ------------------- 基本控制 -------------------
//   excludes: [], // 排除特定文件或目录，默认空表示全部混淆
//   enable: true, // 是否启用混淆
//   log: false, // 是否打印混淆日志
//   autoExcludeNodeModules: false,
//   // 如果设为 true，会自动排除 node_modules 中的依赖
//   // 也可以手动指定 manualChunks: ['vue'] 等
//   threadPool: false,
//   // 多线程混淆，提升大项目构建速度，可配置 size 指定线程数量

//   // ------------------- 混淆选项 -------------------
//   options: {
//     // --------- 基础混淆 ----------
//     compact: true, // 去掉空格和换行，减小体积
//     controlFlowFlattening: true,
//     // 控制流扁平化，把代码逻辑拆分重组，增强反混淆难度
//     controlFlowFlatteningThreshold: 1,
//     // 执行比例 0~1，1 表示全部控制流扁平化，越高包体积越大
//     deadCodeInjection: false,
//     // 注入无用代码，增加反混淆难度，但会显著增大包体积
//     debugProtection: false,
//     // 防止浏览器控制台调试
//     debugProtectionInterval: 0,
//     // debugProtection 的执行间隔
//     disableConsoleOutput: false,
//     // 是否移除 console.log 等输出
//     identifierNamesGenerator: 'hexadecimal',
//     // 变量名生成方式，可选：hexadecimal | mangled | random
//     renameGlobals: false,
//     // 是否混淆全局变量
//     selfDefending: true,
//     // 使混淆后的代码自我保护，防止简单反混淆
//     simplify: true,
//     // 简化控制流，使代码更难理解

//     // --------- 字符串混淆 ----------
//     stringArray: true,
//     // 启用字符串数组混淆，把字符串存进数组再按索引调用
//     stringArrayCallsTransform: true,
//     // 函数调用混淆字符串数组索引
//     stringArrayCallsTransformThreshold: 0.5,
//     // 选择性混淆比例，0~1
//     stringArrayEncoding: [],
//     // 字符串数组编码方式，可选 ['base64', 'rc4']，空表示不编码
//     stringArrayIndexShift: true,
//     // 索引偏移，增强反混淆难度
//     stringArrayRotate: true,
//     // 数组轮换
//     stringArrayShuffle: true,
//     // 数组随机打乱
//     stringArrayWrappersCount: 1,
//     // 字符串数组包装函数数量
//     stringArrayWrappersChainedCalls: true,
//     // 包装函数是否支持链式调用
//     stringArrayWrappersParametersMaxCount: 2,
//     // 包装函数参数最大数量
//     stringArrayWrappersType: 'variable',
//     // 包装类型，可选 variable | function
//     stringArrayThreshold: 0.75,
//     // 混淆比例，0~1

//     // --------- 其他 ----------
//     numbersToExpressions: false,
//     // 将数字转成数学表达式
//     splitStrings: false,
//     // 将长字符串拆分成多段
//     ignoreImports: true,
//     // 忽略 import/require 语句中的字符串
//     unicodeEscapeSequence: false,
//     // 字符串使用 Unicode 转义
//   },
// }
