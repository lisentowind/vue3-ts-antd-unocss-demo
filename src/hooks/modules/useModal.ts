import type { ModalFuncProps } from 'ant-design-vue'
import type { MaybeRef } from 'ant-design-vue/es/_util/type'
import { Modal } from 'ant-design-vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type ModalHooksProps = MaybeRef<ModalFuncProps>

const [modal, contextHolder] = Modal.useModal()

const baseProps: ModalHooksProps = {
  centered: true,
  okButtonProps: { type: 'primary' },
  cancelButtonProps: { type: 'default' },
  class: 'custom-use-modal-hooks',
}

/**
 * @description 描述 模态框hooks(用与vue组件中 不可以放在纯ts中)
 * @date 2025-09-15 10:40:14
 * @author tingfeng
 *
 * @export
 */
export function useModal() {
  const { t } = useI18n()

  const defaultProps: ModalHooksProps = computed(() => ({
    ...baseProps,
    okText: t('app.action.confirm'),
    cancelText: t('app.action.cancel'),
    // 返回promise时resolve后自动关闭
    onCancel() {
      return Promise.resolve('onCancel')
    },
    // 返回promise时resolve后自动关闭
    onOk() {
      return Promise.resolve('onOk')
    },
  }))
  const merge = (props?: ModalHooksProps) =>
    ({ ...defaultProps.value, ...props } as ModalHooksProps)
  const modalInfo = (props: ModalHooksProps) => modal.info({ ...merge(props) })

  const modalSuccess = (props: ModalHooksProps) =>
    modal.success({ ...merge(props) })

  const modalError = (props: ModalHooksProps) =>
    modal.error({ ...merge(props) })

  const modalWarning = (props: ModalHooksProps) =>
    modal.warning({ ...merge(props) })

  const modalConfirm = (props: ModalHooksProps) =>
    modal.confirm({ ...merge(props) })

  return {
    modalApi: modal,
    modalInfo,
    modalSuccess,
    modalError,
    modalWarning,
    modalConfirm,
    modalContextHolder: contextHolder,
    destroyAll: () => Modal.destroyAll(),
  }
}
