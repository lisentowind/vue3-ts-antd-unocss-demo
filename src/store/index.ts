import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { useAppStore } from './modules/app'
import { useThemeStore } from './modules/theme'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useAppStore, useThemeStore }

export default pinia