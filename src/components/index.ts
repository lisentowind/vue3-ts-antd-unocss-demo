import type { App } from 'vue'
// 自定义组件
import CustomIcon from './CustomIcon/CustomIcon.vue'
import CustomModal from './modal/index.vue'
import CustomMouse from './other/custom-mouse.vue'
import CustomUpload from './upload/customUpload.vue'

// ==================== 配置区：只需要在这里维护一次 ====================

// 需要注册的自定义组件 (组件名 -> 组件对象)
const customComponents = {
  CustomIcon,
  CustomMouse,
  CustomUpload,
  CustomModal,
}

// ==================== 以下代码自动处理，无需修改 ====================

// 全局注册组件  类型提示通过运行 pnpm gen:types 脚本自动生成
export default {
  install(Vue: App) {
    // 注册自定义组件
    Object.entries(customComponents).forEach(([name, component]) => {
      Vue.component(name, component)
    })
  },
}
