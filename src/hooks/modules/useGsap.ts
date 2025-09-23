import gsap from 'gsap'

export type UseGsapParams = {
  el: Element | string | Element[] | NodeListOf<Element>
  options?: gsap.TweenVars
  children?: boolean
}

/**
 * 单个元素/容器动画
 */
export async function useGsap({
  el,
  options = {},
  children = true,
}: UseGsapParams): Promise<boolean> {
  if (typeof window === 'undefined')
    return false // SSR 兼容

  // 统一处理传入类型
  let ele: Element | null = null
  if (typeof el === 'string') {
    ele = document.querySelector(el)
  }
  else if (el instanceof Element) {
    ele = el
  }
  else if (Array.isArray(el) || el instanceof NodeList) {
    ele = el[0] ?? null
  }

  if (!ele)
    return Promise.reject(new Error('element not found'))

  // 确保渲染完成再执行动画（避免抖动）
  await new Promise(r => requestAnimationFrame(r))

  const childs
    = Array.isArray(el) || el instanceof NodeList
      ? Array.from(el)
      : children
        ? Array.from(ele.children)
        : [ele]

  // 性能优化：只在动画时启用 will-change
  gsap.set(ele, { willChange: 'transform, opacity' })

  return new Promise((resolve, reject) => {
    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(ele!, { willChange: 'auto' })
        resolve(true)
        timeline.kill()
      },
      onReverseComplete: () => {
        gsap.set(ele!, { willChange: 'auto' })
        reject(new Error('animation reversed'))
        timeline.kill()
      },
    })

    timeline.from(childs, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      // 动态 stagger，子元素越多，间隔越小，避免大列表动画过慢
      stagger: Math.min(0.1, 2 / childs.length),
      ...options,
    })
  })
}

/**
 * 批量元素动画（推荐大列表使用）
 */
export async function useGsapBatch(
  els: Element[] | NodeListOf<Element> | string,
  options: gsap.TweenVars = {},
): Promise<boolean> {
  if (typeof window === 'undefined')
    return false

  let nodes: Element[] = []
  if (typeof els === 'string') {
    nodes = Array.from(document.querySelectorAll(els))
  }
  else if (els instanceof NodeList) {
    nodes = Array.from(els)
  }
  else {
    nodes = els
  }

  if (!nodes.length)
    return Promise.reject(new Error('elements not found'))

  await new Promise(r => requestAnimationFrame(r))

  nodes.forEach(el => gsap.set(el, { willChange: 'transform, opacity' }))

  return new Promise((resolve) => {
    gsap.from(nodes, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      stagger: Math.min(0.05, 2 / nodes.length),
      ...options,
      onComplete: () => {
        nodes.forEach(el => gsap.set(el, { willChange: 'auto' }))
        resolve(true)
      },
    })
  })
}
