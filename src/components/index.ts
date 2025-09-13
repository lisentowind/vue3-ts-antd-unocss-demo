import type { App } from 'vue'
import CustomIcon from '@/components/CustomIcon/CustomIcon.vue'

// 全局注册图标组件

export default {
  install(Vue: App) {
    Vue.component('CustomIcon', CustomIcon)
  },
}
