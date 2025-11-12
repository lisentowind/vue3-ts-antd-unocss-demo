import type { App } from 'vue'
// 按需引入ant-design-vue组件
import {
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Image,
  Input,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TabPane,
  Tabs,
  Tooltip,
  TypographyText,
  Upload,
} from 'ant-design-vue'
// 自定义组件
import CustomIcon from './CustomIcon/CustomIcon.vue'
import CustomModal from './modal/index.vue'
import CustomMouse from './other/custom-mouse.vue'
import CustomUpload from './upload/customUpload.vue'

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
  Tabs,
  TabPane,
  Tooltip,
  Upload,
  Row,
  Col,
  TypographyText,
  Progress,
  Image,
}

// 全局注册组件  类型提示需要去global.d.ts中添加
export default {
  install(Vue: App) {
    // 自定义组件
    Vue.component('CustomIcon', CustomIcon)
    Vue.component('CustomMouse', CustomMouse)
    Vue.component('CustomUpload', CustomUpload)
    Vue.component('CustomModal', CustomModal)
    // ant-design-vue组件
    Object.entries(AntdComponents).forEach(([key, component]) => {
      Vue.component(`A${key}`, component)
    })
  },
}
