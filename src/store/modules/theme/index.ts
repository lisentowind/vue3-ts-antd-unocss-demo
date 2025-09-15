import { defineStore } from 'pinia'

type ThemeMode = 'light' | 'dark'

export interface ThemeStoreState {
  themeMode: ThemeMode
}

/**
 * @description 描述 主题仓库
 * @date 2025-09-15 14:06:10
 * @author tingfeng
 */
export const useThemeStore = defineStore('theme', {
  state: (): ThemeStoreState => ({
    themeMode: 'light',
  }),
  getters: {
    getThemeDark: state => state.themeMode,
  },
  persist: {
    storage: localStorage,
  },
  actions: {
    setThemeDark(value: ThemeStoreState['themeMode']) {
      this.themeMode = value
      document.body.setAttribute('data-theme', value)
    },
  },
})
