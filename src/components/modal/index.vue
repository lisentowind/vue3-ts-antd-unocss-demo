<script lang="ts" setup>
import type { ModalProps } from 'ant-design-vue'
import { computed, onBeforeUnmount, useSlots, watch } from 'vue'
import { useModal } from '@/hooks'

// ====================== Props ======================
/**
 * 继承 AntD Modal 的所有 props，并扩展自定义 props
 * 使用 Partial<ModalProps> 使所有原生 props 可选
 */
interface CustomModalProps extends /* @vue-ignore */ Partial<ModalProps> {
  /** 二次确认 - 关闭前弹出确认框 */
  verify?: boolean
  /** 异步操作标识 */
  async?: boolean
}

const props = withDefaults(defineProps<CustomModalProps>(), {
  verify: false,
  async: false,
  width: 500,
  centered: true,
  maskClosable: false,
  destroyOnClose: true,
})

// ====================== Emits ======================
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// ====================== v-model ======================
/**
 * 同时支持 v-model (modelValue) 和 v-model:open
 * 保持向后兼容
 */
const modelValue = defineModel<boolean>('modelValue', { default: undefined })
const openModel = defineModel<boolean>('open', { default: undefined })

// 合并两种 v-model 方式，优先使用 modelValue 保持向后兼容
const visible = computed({
  get: () => modelValue.value ?? openModel.value ?? false,
  set: (val) => {
    if (modelValue.value !== undefined) {
      modelValue.value = val
    }
    else {
      openModel.value = val
    }
  },
})

// ====================== Slots ======================
const slots = useSlots()

const { modalWarning } = useModal()

// ====================== Computed ======================
/**
 * 透传给 AModal 的 props
 * 过滤掉自定义的扩展属性
 */
const modalProps = computed(() => {
  const { verify, async, ...rest } = props
  return rest
})

// ====================== Methods ======================
function handleOk(e: MouseEvent) {
  if (!visible.value)
    return

  visible.value = false
  emit('confirm')
  props.onOk?.(e)
}

function handleCancel(e: MouseEvent) {
  if (props.verify) {
    modalWarning({
      title: '正在编辑中,是否取消？',
      onOk() {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        visible.value = false
        emit('cancel')
        props.onCancel?.(e)
      },
    })
    return
  }

  window.removeEventListener('beforeunload', handleBeforeUnload)
  visible.value = false
  emit('cancel')
  props.onCancel?.(e)
}

function handleBeforeUnload(e: BeforeUnloadEvent) {
  const activeElement = document.activeElement as HTMLAnchorElement

  // 下载链接不拦截
  if (activeElement?.tagName === 'A') {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return
  }

  if (performance.navigation.type === 1) {
    const confirmationMessage = '你确定要离开此页面吗？'
    e.returnValue = confirmationMessage
    return confirmationMessage
  }
}

// ====================== Watch ======================
watch(
  () => [visible.value, props.verify],
  ([v, verify]) => {
    if (v && verify) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }
    else {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  },
)

// ====================== 生命周期 ======================
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <AModal
    v-bind="modalProps"
    :open="visible"
    @update:open="visible = $event"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <!-- 透传默认插槽 -->
    <slot></slot>

    <!-- 透传 title 插槽 -->
    <template v-if="slots.title" #title>
      <slot name="title"></slot>
    </template>

    <!-- 透传 footer 插槽，同时支持 modal-footer（向后兼容）和 footer -->
    <template v-if="slots['modal-footer'] || slots.footer" #footer>
      <slot name="modal-footer" :on-ok="handleOk" :on-cancel="handleCancel">
        <slot name="footer" :on-ok="handleOk" :on-cancel="handleCancel"></slot>
      </slot>
    </template>

    <!-- 透传 closeIcon 插槽 -->
    <template v-if="slots.closeIcon" #closeIcon>
      <slot name="closeIcon"></slot>
    </template>

    <!-- 透传 modalRender 插槽 -->
    <template v-if="slots.modalRender" #modalRender="scope">
      <slot name="modalRender" v-bind="scope"></slot>
    </template>
  </AModal>
</template>

<style lang="less" scoped>
:deep(.arco-scrollbar-track-direction-vertical) {
  right: -15px;
}

:deep(.arco-form) {
  width: 98% !important;
}
</style>
