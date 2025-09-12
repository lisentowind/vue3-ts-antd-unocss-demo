module.exports = {
  htmlWhitespaceSensitivity: 'strict', // html空格敏感度
  // vueIndentScriptAndStyle: true, // vue文件中script和style标签缩进
  proseWrap: 'always', // markdown文件换行
  printWidth: 80, // 单行长度
  tabWidth: 2, // 缩进长度
  useTabs: false, // 使用空格代替tab缩进
  semi: false, // 句末使用分号
  singleQuote: true, // 使用单引号
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  jsxSingleQuote: true, // jsx中使用单引号
  trailingComma: 'all', // 多行时尽可能打印尾随逗号
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  jsxBracketSameLine: false, // 多属性html标签的‘>’折行放置 不要放在最后一行的末尾
  bracketSameLine: true, // 单行时将>放置在最后一行末尾
  arrowParens: 'always', // 箭头函数单参数时包裹圆括号
  requirePragma: false, // 无需顶部注释即可格式化
  insertPragma: false, // 在已被preitter格式化的文件顶部加上标注
  endOfLine: 'auto', // 不检查结束行形式
  embeddedLanguageFormatting: 'auto', // 对引用代码进行格式化
}
