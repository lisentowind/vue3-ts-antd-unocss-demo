import antfu from '@antfu/eslint-config'

export default antfu(
  {
    unocss: true,
    formatters: true,
    vue: {
      'vue/block-order': [
        'error',
        {
          // 块顺序
          order: ['script', 'template', 'style'],
        },
      ],
    },
    stylistic: {
      indent: 2, // 缩进 2 个空格, 2 | 4 | 'tab'
      quotes: 'single', // 使用双引号, single | 'double'
      semi: false, // 强制分号结尾, true | false
    },
    typescript: true,
    jsonc: false,
    yaml: false,
    ignores: ['dist/**', 'node_modules/**', '*.md'],
  },
  {
    rules: {
      // 你自己的规则
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/html-self-closing': [
        'warn',
        {
          html: {
            void: 'always',
            normal: 'never',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
      'no-console': 'off',
      'prefer-arrow-callback': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
    },
  },
)
