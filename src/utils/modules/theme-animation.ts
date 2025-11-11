interface ThemeAnimationOptions {
  duration?: number
  easing?: string
}

export function handelChangeThemeModeAnimation(
  x: number,
  y: number,
  toggleDark: () => void,
  options: ThemeAnimationOptions = {},
) {
  // 浏览器兼容性检查
  if (!document.startViewTransition) {
    return toggleDark()
  }

  const duration = options.duration ?? 500
  const easing = options.easing ?? 'ease-in'

  // 启动视图过渡
  const transition = document.startViewTransition(() => {
    toggleDark()
  })

  transition.ready.then(() => {
    // 计算最大半径：从按钮中心到屏幕最远角落的距离
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    // 裁剪路径动画，从按钮中心开始扩散
    const clipPathAnimation = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]

    document.documentElement.animate(
      {
        clipPath: clipPathAnimation,
      },
      {
        duration,
        easing,
        pseudoElement: '::view-transition-new(root)',
      },
    )
  })
}
