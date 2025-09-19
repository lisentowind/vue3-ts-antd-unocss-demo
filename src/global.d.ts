// 自定义组件
import type vGlowBorder from './directives/modules/v-glowBorder'
import type vGsap from './directives/modules/v-gsap'

// 全局注册组件的类型声明 方便编辑器识别类型
declare module 'vue' {
  // 全局注册组件
  export interface GlobalComponents {
    // 自定义组件
    CustomIcon: typeof import('@/components/CustomIcon/CustomIcon.vue')['default']
    CustomMouse: typeof import('@/components/other/custom-mouse.vue')['default']
    // ant-design-vue组件
    AButton: typeof import('ant-design-vue')['Button']
    AConfigProvider: typeof import('ant-design-vue')['ConfigProvider']
    AModal: typeof import('ant-design-vue')['Modal']
    ARadio: typeof import('ant-design-vue')['Radio']
    ASelect: typeof import('ant-design-vue')['Select']
    ASpace: typeof import('ant-design-vue')['Space']
    ASwitch: typeof import('ant-design-vue')['Switch']
    ATable: typeof import('ant-design-vue')['Table']
    ATooltip: typeof import('ant-design-vue')['Tooltip']
    AInput: typeof import('ant-design-vue')['Input']
    ADatePicker: typeof import('ant-design-vue')['DatePicker']
  }
  // 全局指令类型声明
  export interface ComponentCustomProperties {
    vGlowBorder: typeof vGlowBorder
    vGsap: typeof vGsap
  }
}
