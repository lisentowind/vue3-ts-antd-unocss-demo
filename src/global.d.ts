import type CustomIcon from './components/CustomIcon/CustomIcon.vue'

// 全局注册组件的类型声明 方便编辑器识别类型
declare module 'vue' {
  export interface GlobalComponents {
    CustomIcon: typeof CustomIcon
  }
}
