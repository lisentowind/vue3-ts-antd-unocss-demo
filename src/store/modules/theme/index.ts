import { defineStore } from 'pinia'
import { toRgb, toRgbVar } from '@/utils'

type ThemeMode = 'light' | 'dark'

export interface ThemeStoreState {
  themeMode: ThemeMode
  primaryColor: string
}

/**
 * @description 描述 主题仓库
 * @date 2025-09-15 14:06:10
 * @author tingfeng
 */
export const useThemeStore = defineStore('theme', {
  state: (): ThemeStoreState => ({
    themeMode: 'light',
    primaryColor: 'rgba(20,143,22,1)',
  }),
  getters: {
    getThemeDark: state => state.themeMode,
    getPrimaryColor: state => state.primaryColor,
  },
  persist: true,
  actions: {
    setThemeDark(value: ThemeStoreState['themeMode']) {
      this.themeMode = value
      document.documentElement.setAttribute('data-theme', value)
    },
    setPrimaryColor(value: ThemeStoreState['primaryColor']) {
      const finalColor = toRgb(value)
      const colorValueStr = toRgbVar(value)
      this.primaryColor = finalColor
      document.documentElement.style.setProperty('--color-primary', finalColor)
      document.documentElement.style.setProperty(
        '--color-primary-value',
        colorValueStr,
      )
    },
  },
})
