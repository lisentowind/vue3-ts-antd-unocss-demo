import { theme } from 'ant-design-vue'
import { watch } from 'vue'

// 哪些颜色是动态的 然后给unocss添加自定义颜色使用 保持颜色一致
const colorArr = ['colorBgContainer', 'colorTextBase']

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
    (color: any) => {
      //   console.log('🚀 ~ useThemeColor ~ color:', color)
      // 设置antd的动态颜色
      colorArr.forEach((item) => {
        document.documentElement.style.setProperty(`--${item}`, color[item])
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
