# Vue 3 + TypeScript + Vite

- vue3-ts-antd-unocss-demo 快速启动项目 克隆后 删除当前模版仓库链接 不要推送代码
- 使用pnpm@10.15.1 以及以上版本

## 启动项目

## 安装依赖

```bash

    pnpm i

```

## 启动项目

```bash

    pnpm dev

```

## 构建项目

```bash

    pnpm build

    pnpm preview

```

## 技术栈说明

- **UnoCSS**
  按需生成的原子化 CSS 引擎，类似 Tailwind，但更灵活、可配置。

- **Iconify**
  统一的图标解决方案，支持数千个图标库，按需加载使用。

- **antfu eslint**
  由 Vue 核心成员 antfu 维护的 ESLint 预设，内置 Vue/TS/JS 常用规范。

- **Prettier**
  代码格式化工具，统一代码风格（缩进、引号、分号等）。

- **Husky**
  管理 Git hooks，可在提交前运行 lint/测试，避免不合规范的提交。

- **Commitlint**
  校验 Git 提交信息是否符合规范（如 Angular 提交规范），保持提交记录一致。

- **vue-i18n**
  Vue 官方国际化插件，用于多语言切换和翻译管理。

- **vue-request**
  基于 Vue 3 组合式 API 的请求管理库，支持缓存、轮询、错误重试等。

- **mitt**
  轻量级事件总线（发布-订阅），用于跨组件通信。

- **@vueuse/core**
  Vue 3 实用工具函数集合（如 `useMouse`, `useDark`），提升开发效率。

- **ant-design-vue**
  Ant Design 的 Vue 实现，提供丰富的 UI 组件库，常用于后台管理系统。

- **axios**
  流行的 HTTP 请求库，支持拦截器、取消请求、错误处理等功能。
