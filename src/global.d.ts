// 自定义组件
import type vGlowBorder from './directives/modules/v-glowBorder'
import type vGsap from './directives/modules/v-gsap'

// 全局注册组件的类型声明 方便编辑器识别类型
declare module 'vue' {
  export interface ComponentCustomProperties {
    vGlowBorder: typeof vGlowBorder
    vGsap: typeof vGsap
  }
}

declare module 'base64-file'

declare module 'vue-cropper'
