// 自定义组件
import type vGlowBorder from './directives/modules/v-glowBorder'
import type vGsap from './directives/modules/v-gsap'

// 全局注册组件的类型声明 方便编辑器识别类型
declare module 'vue' {
  // 全局注册组件 通过运行 pnpm gen:types 脚本自动生成
  export interface GlobalComponents {
    CustomIcon: typeof import('@/components/CustomIcon/CustomIcon.vue')['default']
    CustomMouse: typeof import('@/components/other/custom-mouse.vue')['default']
    CustomUpload: typeof import('@/components/upload/customUpload.vue')['default']
    CustomModal: typeof import('@/components/modal/index.vue')['default']
    AButton: typeof import('ant-design-vue')['Button']
    ACol: typeof import('ant-design-vue')['Col']
    AConfigProvider: typeof import('ant-design-vue')['ConfigProvider']
    ADatePicker: typeof import('ant-design-vue')['DatePicker']
    AImage: typeof import('ant-design-vue')['Image']
    AInput: typeof import('ant-design-vue')['Input']
    AModal: typeof import('ant-design-vue')['Modal']
    AProgress: typeof import('ant-design-vue')['Progress']
    ARadio: typeof import('ant-design-vue')['Radio']
    ARow: typeof import('ant-design-vue')['Row']
    ASelect: typeof import('ant-design-vue')['Select']
    ASpace: typeof import('ant-design-vue')['Space']
    ASwitch: typeof import('ant-design-vue')['Switch']
    ATable: typeof import('ant-design-vue')['Table']
    ATabPane: typeof import('ant-design-vue')['TabPane']
    ATabs: typeof import('ant-design-vue')['Tabs']
    ATooltip: typeof import('ant-design-vue')['Tooltip']
    ATypographyText: typeof import('ant-design-vue')['TypographyText']
    AUpload: typeof import('ant-design-vue')['Upload']
  }
  // 全局指令类型声明
  export interface ComponentCustomProperties {
    vGlowBorder: typeof vGlowBorder
    vGsap: typeof vGsap
  }
}

declare module 'base64-file'

declare module 'vue-cropper'
