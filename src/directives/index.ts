import type { App } from 'vue'

import glowBorder from './modules/v-glowBorder'

export default {
  install(Vue: App) {
    Vue.directive('glow-border', glowBorder)
  },
}
