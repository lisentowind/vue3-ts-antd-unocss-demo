import * as echarts from 'echarts'
import { debounce } from 'lodash'
import { nanoid } from 'nanoid'
import { onUnmounted, ref, shallowRef, watch } from 'vue'
import { useThemeStore } from '@/store'
import { myDarkConfig } from '../config/echarts-my-dark'

export type EchartsInitParams = Parameters<typeof echarts.init>

export type EchartsInitOptions = {
  id: string
  el: string | EchartsInitParams[0]
  theme?: EchartsInitParams[1]
  opts?: EchartsInitParams[2]
}

export interface EchartsInfo
  extends Partial<Pick<EchartsInitOptions, 'theme' | 'opts'>> {
  id: string
  el: string | EchartsInitParams[0]
  echarts?: echarts.ECharts
}

echarts.registerTheme('myDark', { ...myDarkConfig })

/**
 * @description 描述 创建echarts
 * @date 2025-09-19 14:24:20
 * @author tingfeng
 *
 * @export
 */
export function useEcharts() {
  const themeStore = useThemeStore()
  const echartsInfo = ref<EchartsInfo | null>(null)
  const instance = shallowRef<echarts.ECharts>()

  function init(options: EchartsInitOptions): echarts.ECharts {
    const { id = nanoid(), el, theme, opts } = options
    const finalEl = typeof el === 'string' ? document.getElementById(el) : el
    if (!finalEl) {
      throw new Error(`Element with id "${el}" not found`)
    }

    const chart = echarts.init(finalEl, theme, opts)
    echartsInfo.value = { id, el: finalEl, theme, opts, echarts: chart }
    instance.value = chart
    reSizeListener()
    return chart
  }

  const resizeHandler = debounce(() => {
    if (instance.value && !instance.value.isDisposed()) {
      instance.value.resize()
    }
  }, 500)

  function setOptions(options: echarts.EChartsOption) {
    instance.value?.setOption({ backgroundColor: 'transparent', ...options })
  }

  function reSizeListener() {
    window.addEventListener('resize', resizeHandler)
  }

  function destroyReSizeListener() {
    window.removeEventListener('resize', resizeHandler)
  }

  function setThemeMode(ThemeMode: typeof themeStore.getThemeDark) {
    if (instance.value && !instance.value.isDisposed()) {
      instance.value.setTheme(ThemeMode === 'dark' ? 'dark' : 'default')
    }
  }

  function destroy() {
    if (instance.value && !instance.value.isDisposed()) {
      destroyReSizeListener()
      echarts.dispose(instance.value)
      echartsInfo.value = null
      instance.value = undefined
    }
  }
  watch(
    () => themeStore.getThemeDark,
    (v) => {
      setThemeMode(v)
    },
    {
      immediate: true,
      deep: 1,
      flush: 'post',
    },
  )
  watch(
    () => instance.value,
    (v) => {
      v && setThemeMode(themeStore.getThemeDark)
    },
    {
      immediate: true,
      deep: 1,
      flush: 'post',
    },
  )

  onUnmounted(() => {
    destroy()
  })

  return {
    echartsInfo,
    instance,
    init,
    destroy,
    setOptions,
  }
}
