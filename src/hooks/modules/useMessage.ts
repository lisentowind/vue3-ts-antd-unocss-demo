import type { MessageType } from 'ant-design-vue/es/message'
import type { JointContent } from 'ant-design-vue/es/message/interface'
import { message } from 'ant-design-vue'

interface MsgHooksConfig {
  content: JointContent
  duration?: number
  onClose?: () => void
}

function mergeConfig(defaults: MsgHooksConfig, overrides: MsgHooksConfig) {
  return { ...defaults, ...overrides }
}

/**
 * @description 全局消息提示封装（无 hooks 版本）
 * @date 2025-09-15
 */
export function useMessage() {
  const baseConfig: MsgHooksConfig = {
    content: '默认消息',
    duration: 3,
    onClose: () => {},
  }

  // info
  const msgInfo = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return message.info(content, duration, onClose)
  }

  // success
  const msgSuccess = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return message.success(content, duration, onClose)
  }

  // error
  const msgError = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return message.error(content, duration, onClose)
  }

  // warning
  const msgWarning = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return message.warning(content, duration, onClose)
  }

  // loading
  const msgLoading = async (cfg: MsgHooksConfig): Promise<MessageType> => {
    const { content, duration, onClose } = mergeConfig(baseConfig, cfg)
    return message.loading(content, duration, onClose)
  }

  return {
    msgInfo,
    msgSuccess,
    msgError,
    msgWarning,
    msgLoading,
    destroyAll: () => message.destroy(),
  }
}
