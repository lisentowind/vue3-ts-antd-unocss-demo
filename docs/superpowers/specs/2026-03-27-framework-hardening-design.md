# Framework Hardening Design

**Goal:** 收敛当前模板项目的主链路，实现认证状态一致、根组件职责下沉，并清理会影响持续开发的工程噪音。

**Scope**

- 打通 `user store`、认证存储工具和 `axios` 请求头之间的 token 链路。
- 把 `App.vue` 中系统初始化副作用抽离为独立运行时模块。
- 修复已知的国际化、配置和 lint 残留问题，不做大规模目录重构。

**Design**

- 认证链路以 `src/utils/modules/auth.ts` 为唯一存储入口，`user store` 在登录/退出时同步 token，请求层从统一存储读取 token。
- `App.vue` 只负责 Provider 和渲染，主题注入、刷新事件监听、版本更新检测由 `bootstrap` 模块组装并返回清理函数。
- 顺手修复 `fallbackLocale`、个人中心语言值不一致、构建配置中的未使用导入，以及现有格式问题。

**Validation**

- 新增最小 Vitest 基础设施。
- 为认证存储和运行时初始化补充回归测试。
- 最终运行 `pnpm test`、`pnpm exec eslint .`、`pnpm build`。
