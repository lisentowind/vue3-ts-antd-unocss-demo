/**
 * @description 描述 当前环境变量
 * @date 2025-09-23 16:17:58
 * @author tingfeng
 *
 * @export
 */
export function getEnvData(): ImportMetaEnv {
  const { PROD, VITE_APP_ENV_FROM_CONFIG } = import.meta.env

  if (PROD && VITE_APP_ENV_FROM_CONFIG === 'true') {
    const AppWindow = window as AppWindow
    return {
      ...import.meta.env,
      ...AppWindow.__VITE_APP_CONFIG__,
    }
  }
  return {
    ...import.meta.env,
  }
}
