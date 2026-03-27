# Bundle And Featureization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把组件演示页改成按需加载，并把异步路由拆成按业务域维护的 feature 模块。

**Architecture:** 新增 `playground` feature 来收口 demo tab 注册和页面视图，通过异步组件只加载当前 tab；同时将集中式异步路由拆成多个 feature `routes.ts`，再由 router 层聚合。这样既减轻单一路由入口体积，也让目录结构更接近业务域。

**Tech Stack:** Vue 3, Vue Router, Vite, Vitest, TypeScript

---

### Task 1: Add Playground Registry Test

**Files:**

- Create: `tests/playground-tabs.test.ts`
- Create: `src/features/playground/demo-tabs.ts`

- [ ] Step 1: 为 demo tab 注册表写失败测试
- [ ] Step 2: 运行 `pnpm test tests/playground-tabs.test.ts` 确认失败
- [ ] Step 3: 实现最小 tab 注册表模块
- [ ] Step 4: 运行 `pnpm test tests/playground-tabs.test.ts` 确认通过

### Task 2: Lazy Load Playground Tabs

**Files:**

- Create: `src/features/playground/views/index.vue`
- Modify: `src/router/routes/async.ts`
- Delete: `src/views/index.vue`

- [ ] Step 1: 基于 tab 注册表重写 playground 页面
- [ ] Step 2: 确保当前激活 tab 才加载对应 demo 组件
- [ ] Step 3: 运行 `pnpm test`

### Task 3: Split Async Routes By Feature

**Files:**

- Create: `src/features/dashboard/routes.ts`
- Create: `src/features/system/routes.ts`
- Create: `src/features/content/routes.ts`
- Create: `src/features/readonly/routes.ts`
- Create: `src/features/user/routes.ts`
- Create: `src/features/playground/routes.ts`
- Modify: `src/router/routes/async.ts`

- [ ] Step 1: 按业务域拆分路由定义
- [ ] Step 2: 让 router 聚合 feature 路由
- [ ] Step 3: 运行 `pnpm exec eslint .`

### Task 4: Verify Bundle Impact

**Files:**

- Modify: none required beyond build config already in repo

- [ ] Step 1: 运行 `pnpm build`
- [ ] Step 2: 对比关键 chunk 输出并确认 demo 路由切分生效
