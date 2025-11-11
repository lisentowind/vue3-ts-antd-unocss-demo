<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import { useModal } from '@/hooks'

// ====================== Props ======================
interface Props {
  title: string
  verify?: boolean // 二次确认
  width?: number
  height?: string
  async?: boolean // 异步操作
  footer?: boolean // 页脚
  bodyStyle?: CSSProperties
  loading?: boolean
  customClass?: string
}

// 默认值
const props = withDefaults(defineProps<Props>(), {
  verify: false,
  async: false,
  loading: false,
  width: 500,
})

// ====================== Emits ======================
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

// ====================== v-model ======================
/**
 * Vue 3.5 新特性
 * 自动声明 modelValue props & update:modelValue emit
 */
const visible = defineModel<boolean>('modelValue')

const { modalWarning } = useModal()

// ====================== Methods ======================
function handleBeforeOk() {
  if (!visible.value) {
    return (visible.value = false)
  }
  visible.value = false
  emit('confirm')
}

function handleBeforeCancel() {
  if (props.verify) {
    modalWarning({
      title: '正在编辑中,是否取消？',
      onOk() {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        visible.value = false
        emit('cancel')
      },
    })
    return (visible.value = false)
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
  return (visible.value = false)
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
    v-model:open="visible"
    :body-style="props.bodyStyle"
    :mask-closable="false"
    :ok-loading="props.loading"
    :title="props.title"
    :width="props.width"
    :class="props.customClass"
    title-align="start"
    unmount-on-close
    centered
    @ok="handleBeforeOk"
    @cancel="handleBeforeCancel"
  >
    <slot></slot>

    <template #footer>
      <slot
        name="modal-footer"
        :on-ok="handleBeforeOk"
        :on-cancel="handleBeforeCancel"
      ></slot>
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
