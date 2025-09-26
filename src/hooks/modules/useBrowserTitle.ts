import { useTitle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import { getEnvData } from '@/utils'

export function useBrowserTitle() {
  const { VITE_APP_NAME } = getEnvData()
  const titleRef = useTitle(VITE_APP_NAME) // 只初始化一次

  const setBrowserTitle = (title?: string) => {
    titleRef.value = title ? `${VITE_APP_NAME} | ${title}` : VITE_APP_NAME
  }

  const routeTitleSet = () => {
    const route = useRoute()
    const { title } = route.meta
    if (title) {
      titleRef.value = `${VITE_APP_NAME} | ${title}`
    }
    else {
      titleRef.value = VITE_APP_NAME
    }
  }

  return {
    setBrowserTitle,
    routeTitleSet,
  }
}
