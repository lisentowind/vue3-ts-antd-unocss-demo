import type { App } from 'vue'
// 按需引入ant-design-vue组件
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
} from 'ant-design-vue'
// 自定义组件
import CustomIcon from '@/components/CustomIcon/CustomIcon.vue'
import CustomMouse from './other/custom-mouse.vue'

const AntdComponents = {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  Tooltip,
}

// 全局注册组件  类型提示需要去global.d.ts中添加
export default {
  install(Vue: App) {
    // 自定义组件
    Vue.component('CustomIcon', CustomIcon)
    Vue.component('CustomMouse', CustomMouse)
    // ant-design-vue组件
    Object.entries(AntdComponents).forEach(([key, component]) => {
      Vue.component(`A${key}`, component)
    })
  },
}
