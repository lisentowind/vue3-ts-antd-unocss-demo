# Framework Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 收敛模板项目的认证链路和根组件初始化职责，并补齐基础测试与工程校验。

**Architecture:** 通过统一的认证存储工具作为 token 单一来源，让 `user store` 与请求层围绕它协作；再把 `App.vue` 中运行时副作用提取到独立 bootstrap 模块，降低根组件复杂度。测试只覆盖新增边界清晰的纯逻辑和可注入逻辑。

**Tech Stack:** Vue 3, Pinia, Axios, Vitest, TypeScript, Vite

---

### Task 1: Establish Test Baseline

**Files:**

- Modify: `package.json`
- Create: `vitest.config.ts`
- Test: `tests/auth-storage.test.ts`
- Test: `tests/app-runtime.test.ts`

- [ ] Step 1: 添加 Vitest 运行基础
- [ ] Step 2: 为认证存储写失败测试
- [ ] Step 3: 为运行时初始化写失败测试
- [ ] Step 4: 运行 `pnpm test` 验证当前失败原因正确

### Task 2: Unify Authentication Flow

**Files:**

- Modify: `src/utils/modules/auth.ts`
- Modify: `src/store/modules/user.ts`
- Modify: `src/apis/index.ts`

- [ ] Step 1: 抽出可测试的认证存储工厂
- [ ] Step 2: 在用户登录/退出时同步 token 存储
- [ ] Step 3: 在 axios 请求拦截器中读取 token 并设置请求头
- [ ] Step 4: 运行 `pnpm test`

### Task 3: Extract App Runtime Bootstrap

**Files:**

- Create: `src/bootstrap/app-runtime.ts`
- Modify: `src/App.vue`

- [ ] Step 1: 抽取运行时初始化函数并支持清理
- [ ] Step 2: 在 `App.vue` 中接入 bootstrap
- [ ] Step 3: 运行 `pnpm test`

### Task 4: Clean Remaining Framework Debt

**Files:**

- Modify: `src/locale/index.ts`
- Modify: `src/views/user/profile/index.vue`
- Modify: `config/vite.config.prod.ts`
- Modify: formatting-affected files reported by ESLint

- [ ] Step 1: 修复国际化 fallback 和语言值不一致
- [ ] Step 2: 清理未使用导入与格式问题
- [ ] Step 3: 运行 `pnpm exec eslint .`
- [ ] Step 4: 运行 `pnpm build`
