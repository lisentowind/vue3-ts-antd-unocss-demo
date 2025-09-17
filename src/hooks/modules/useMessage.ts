import type { MessageType } from 'ant-design-vue/es/message'
import type { JointContent } from 'ant-design-vue/es/message/interface'
import { message } from 'ant-design-vue'

const [messageApi, contextHolder] = message.useMessage()

interface MsgHooksConfig {
  content: JointContent
  duration?: number
  onClose?: () => void
}

function mergeConfig(defaults: MsgHooksConfig, overrides: MsgHooksConfig) {
  return { ...defaults, ...overrides }
}

/**
 * @description 描述 全局消息提示封装
 * @date 2025-09-15 10:25:02
 * @author tingfeng
 *
 * @export
 */
export function useMessage() {
  const baseConfig: MsgHooksConfig = {
    content: '默认消息',
    duration: 3,
    onClose: () => {},
  }

  const msgInfo = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return messageApi.info(content, duration, onClose)
  }

  const msgSuccess = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return messageApi.success(content, duration, onClose)
  }

  const msgError = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return messageApi.error(content, duration, onClose)
  }

  const msgWarning = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return messageApi.warning(content, duration, onClose)
  }

  const msgLoading = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return messageApi.loading(content, duration, onClose)
  }

  return {
    msgApi: messageApi,
    msgInfo,
    msgSuccess,
    msgError,
    msgWarning,
    msgLoading,
    msgContextHolder: contextHolder,
    destroyAll: () => message.destroy(),
  }
}
