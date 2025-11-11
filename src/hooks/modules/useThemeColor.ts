import type { GlobalToken } from 'ant-design-vue/es/theme'
import { theme } from 'ant-design-vue'
import { watch } from 'vue'
import { toRgbVar } from '@/utils'

export interface MyGlobalToken extends GlobalToken {
  [key: string]: any
}

// 哪些颜色是动态的 然后给unocss添加自定义颜色使用 保持颜色一致 (除了主题色 其余颜色从antd动态获取并且添加到unocss的规则中)
const colorArr = [
  'colorBgContainer',
  'colorTextBase',
  'colorError',
  'colorSuccess',
  'colorWarning',
  'colorInfo',
]

/**
 * @description 描述 获取antd的动态颜色
 * @date 2025-09-15 18:16:09
 * @author tingfeng
 *
 * @export
 */
export function useThemeColor() {
  const { useToken } = theme
  const { token } = useToken()

  watch(
    () => token.value,
    (color: MyGlobalToken) => {
      // 设置antd的动态颜色
      colorArr.forEach((item) => {
        // 获取颜色值  纯字符串数值 方便在unocss中进行定义颜色规则
        const colorValueStr = toRgbVar(color[item] ?? '')
        document.documentElement.style.setProperty(`--${item}`, color[item])
        document.documentElement.style.setProperty(
          `--${item}-value`,
          colorValueStr,
        )
      })
    },
    {
      deep: 1,
      immediate: true,
      flush: 'post',
    },
  )

  return {
    token,
  }
}
