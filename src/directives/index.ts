import type { App } from 'vue'

import glowBorder from './v-glowBorder'

export default {
  install(Vue: App) {
    Vue.directive('glow-border', glowBorder)
  },
}
