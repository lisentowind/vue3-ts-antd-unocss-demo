import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAppStore } from './modules/app'
import { usePermissionStore } from './modules/permission'
import { useThemeStore } from './modules/theme'
import { useUserStore } from './modules/user'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useAppStore, usePermissionStore, useThemeStore, useUserStore }

export default pinia
