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
    AAlert: typeof import('ant-design-vue')['Alert']
    AAvatar: typeof import('ant-design-vue')['Avatar']
    ABadge: typeof import('ant-design-vue')['Badge']
    AButton: typeof import('ant-design-vue')['Button']
    ACard: typeof import('ant-design-vue')['Card']
    ACol: typeof import('ant-design-vue')['Col']
    AConfigProvider: typeof import('ant-design-vue')['ConfigProvider']
    ADatePicker: typeof import('ant-design-vue')['DatePicker']
    ADropdown: typeof import('ant-design-vue')['Dropdown']
    AForm: typeof import('ant-design-vue')['Form']
    AFormItem: typeof import('ant-design-vue')['FormItem']
    AImage: typeof import('ant-design-vue')['Image']
    AInput: typeof import('ant-design-vue')['Input']
    AInputNumber: typeof import('ant-design-vue')['InputNumber']
    AInputPassword: typeof import('ant-design-vue')['InputPassword']
    ALayout: typeof import('ant-design-vue')['Layout']
    ALayoutContent: typeof import('ant-design-vue')['LayoutContent']
    ALayoutFooter: typeof import('ant-design-vue')['LayoutFooter']
    ALayoutHeader: typeof import('ant-design-vue')['LayoutHeader']
    ALayoutSider: typeof import('ant-design-vue')['LayoutSider']
    AList: typeof import('ant-design-vue')['List']
    AListItem: typeof import('ant-design-vue')['ListItem']
    AMenu: typeof import('ant-design-vue')['Menu']
    AMenuDivider: typeof import('ant-design-vue')['MenuDivider']
    AMenuItem: typeof import('ant-design-vue')['MenuItem']
    AModal: typeof import('ant-design-vue')['Modal']
    AProgress: typeof import('ant-design-vue')['Progress']
    ARadio: typeof import('ant-design-vue')['Radio']
    ARadioGroup: typeof import('ant-design-vue')['RadioGroup']
    ARow: typeof import('ant-design-vue')['Row']
    ASelect: typeof import('ant-design-vue')['Select']
    ASelectOption: typeof import('ant-design-vue')['SelectOption']
    ASpace: typeof import('ant-design-vue')['Space']
    ASwitch: typeof import('ant-design-vue')['Switch']
    ATable: typeof import('ant-design-vue')['Table']
    ATabPane: typeof import('ant-design-vue')['TabPane']
    ATabs: typeof import('ant-design-vue')['Tabs']
    ATag: typeof import('ant-design-vue')['Tag']
    ATextarea: typeof import('ant-design-vue')['Textarea']
    ATimeline: typeof import('ant-design-vue')['Timeline']
    ATimelineItem: typeof import('ant-design-vue')['TimelineItem']
    ATooltip: typeof import('ant-design-vue')['Tooltip']
    ATypographyText: typeof import('ant-design-vue')['TypographyText']
    AUpload: typeof import('ant-design-vue')['Upload']
    AInputSearch: typeof import('ant-design-vue')['InputSearch']
    ADrawer: typeof import('ant-design-vue')['Drawer']
  }
  // 全局指令类型声明
  export interface ComponentCustomProperties {
    vGlowBorder: typeof vGlowBorder
    vGsap: typeof vGsap
  }
}

declare module 'base64-file'

declare module 'vue-cropper'
