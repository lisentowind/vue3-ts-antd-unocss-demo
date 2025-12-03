/// <reference types="vite/client" />

type ViteEnvBoolean = 'true' | 'false'

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_UPLOAD_URL: string
  readonly VITE_APP_TOKEN_KEY: string
  readonly VITE_IS_ELE: ViteEnvBoolean
  // 环境变量是否来自外部配置文件
  readonly VITE_APP_ENV_FROM_CONFIG: ViteEnvBoolean
  // 是否内网模式下的应用 不能访问外网的情况下
  readonly VITE_APP_IS_OFFLINE: ViteEnvBoolean
}

type DefaultWindow = typeof window

interface AppWindow extends DefaultWindow {
  __VITE_APP_CONFIG__: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<any, any, any>
  export default component
}
