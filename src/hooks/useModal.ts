import type { ModalFuncProps } from 'ant-design-vue'
import type { MaybeRef } from 'ant-design-vue/es/_util/type'
import { Modal } from 'ant-design-vue'

type ModalHooksProps = MaybeRef<ModalFuncProps>

const [modal, contextHolder] = Modal.useModal()

const baseProps: ModalHooksProps = {
  centered: true,
  okText: '确定',
  cancelText: '取消',
  okButtonProps: { type: 'primary' },
  cancelButtonProps: { type: 'default' },
  class: 'custom-use-modal-hooks',
}

const defaultProps: ModalHooksProps = {
  ...baseProps,
  // 返回promise时resolve后自动关闭
  onCancel() {
    return Promise.resolve('onCancel')
  },
  // 返回promise时resolve后自动关闭
  onOk() {
    return Promise.resolve('onOk')
  },
}

/**
 * @description 描述 模态框hooks
 * @date 2025-09-15 10:40:14
 * @author tingfeng
 *
 * @export
 */
export function useModal() {
  const merge = (props?: ModalHooksProps) =>
    ({ ...defaultProps, ...props } as ModalHooksProps)
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
  }
}
