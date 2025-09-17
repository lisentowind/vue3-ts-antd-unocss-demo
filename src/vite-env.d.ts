/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TOKEN_KEY: string
  readonly VITE_IS_ELE: 'true' | 'false'
}
