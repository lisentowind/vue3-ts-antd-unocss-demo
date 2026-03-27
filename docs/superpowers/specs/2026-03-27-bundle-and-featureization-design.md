# Bundle And Featureization Design

**Goal:** 在不大改业务实现的前提下，降低重型 demo 页面带来的初始路由负担，并把异步路由改成按业务域组织。

**Scope**

- 将组件演示页从“同步引入全部 demo 组件”改成“按 tab 按需加载”。
- 新增 `src/features` 目录，把异步路由拆成 dashboard、system、content、readonly、user、playground 等 feature 模块。
- 保持原有页面行为和权限模型不变，不触碰真实业务逻辑。

**Design**

- `playground` feature 维护 demo tab 注册表和页面视图，页面只在当前 tab 激活时加载对应 demo 组件。
- `router/routes/async.ts` 只负责聚合 feature 路由数组，路由定义落到各 feature 自己的 `routes.ts`。
- 通过 build 验证路由切分后的产物变化，用一次针对 demo tab 注册表的测试锁住新辅助模块行为。

**Validation**

- 新增 playground tab 注册表测试。
- 运行 `pnpm test`、`pnpm exec eslint .`、`pnpm build`。
