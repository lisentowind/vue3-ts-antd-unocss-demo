/// <reference types="vite/client" />

type ViteEnvBoolean = 'true' | 'false'

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TOKEN_KEY: string
  readonly VITE_IS_ELE: ViteEnvBoolean
  // 环境变量是否来自外部配置文件
  readonly VITE_APP_ENV_FROM_CONFIG: ViteEnvBoolean
}

type DefaultWindow = typeof window

interface AppWindow extends DefaultWindow {
  __VITE_APP_CONFIG__: ImportMetaEnv
}
