import type { App } from 'vue'

import glowBorder from './modules/v-glowBorder'
import useGsap from './modules/v-gsap'

export default {
  install(Vue: App) {
    Vue.directive('glow-border', glowBorder)
    Vue.directive('gsap', useGsap)
  },
}
