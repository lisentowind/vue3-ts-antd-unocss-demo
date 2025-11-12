import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from '@/hooks'
import { ApiEventEmitter } from '@/utils'

const { msgError } = useMessage()

export function ApiEventHandle() {
  const { t } = useI18n()
  const resErrMap = computed((): Record<number, string> => {
    return {
      // 2xx
      200: t('api.res.success.200'),
      201: t('api.res.success.201'),

      // 3xx
      301: t('api.res.err.301'),
      302: t('api.res.err.302'),
      304: t('api.res.err.304'),

      // 4xx
      400: t('api.res.err.400'),
      401: t('api.res.err.401'),
      403: t('api.res.err.403'),
      404: t('api.res.err.404'),
      405: t('api.res.err.405'),
      408: t('api.res.err.408'),
      409: t('api.res.err.409'),
      410: t('api.res.err.410'),
      413: t('api.res.err.413'),
      414: t('api.res.err.414'),
      415: t('api.res.err.415'),
      429: t('api.res.err.429'),

      // 5xx
      500: t('api.res.err.500'),
      501: t('api.res.err.501'),
      502: t('api.res.err.502'),
      503: t('api.res.err.503'),
      504: t('api.res.err.504'),
      505: t('api.res.err.505'),
      507: t('api.res.err.507'),
      511: t('api.res.err.511'),

      // 请求取消
      0: t('api.res.err.cancel'),
    }
  })
  const startListen = () => {
    // 响应的 code 不在白名单中，视为失败
    ApiEventEmitter.on('noInCodeWhiteErr', (data) => {
      console.log('🚀 ~ noInCodeWhiteErr ~ data:', data)
      msgError({
        content: data.res.statusText,
      })
    })

    // 响应错误处理
    ApiEventEmitter.on('responseErr', (data) => {
      console.log('🚀 ~ responseErr ~ data:', data)

      if (data.res.name === 'CanceledError') {
        msgError({
          content: data.res.message || resErrMap.value[0],
        })
        return
      }

      if (data.res.status) {
        msgError({
          content: resErrMap.value[data.res.status],
        })
      }
    })
  }

  const stopListen = () => {
    ApiEventEmitter.off('noInCodeWhiteErr')
    ApiEventEmitter.off('responseErr')
  }

  onMounted(() => {
    startListen()
  })

  onBeforeUnmount(() => {
    stopListen()
  })
}
