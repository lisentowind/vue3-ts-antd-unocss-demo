import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { getEnvData } from '@/utils'

export function useBrowserTitle() {
  const route = useRoute()
  const { title } = route.meta
  const { VITE_APP_NAME } = getEnvData()
  if (title) {
    useTitle(VITE_APP_NAME, {
      titleTemplate: `%s | ${title}`,
    })
  }
}
