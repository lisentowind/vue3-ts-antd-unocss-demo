import type { DirectiveBinding } from 'vue'
import type { UseGsapParams } from '@/hooks'
import { useGsap } from '@/hooks'

const MAX_CHILDREN = 50

export default {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<Omit<UseGsapParams, 'el'>>,
  ) {
    const opts = binding.value || {}

    const triggerAnimation = () => {
      useGsap({
        el,
        children: el.children.length <= MAX_CHILDREN && opts.children !== false,
        ...opts,
      })
        .then(() => {
          // 动画完成，可做额外回调
        })
        .catch(() => {
          // 动画被反向或失败
        })
    }

    // 支持修饰符 lazy 或 scroll 触发
    if (binding.modifiers.lazy || binding.modifiers.scroll) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          triggerAnimation()
          observer.disconnect()
        }
      })

      observer.observe(el);

      (el as any).__gsapObserver = observer
    }
    else {
      triggerAnimation()
    }
  },

  unmounted(el: HTMLElement) {
    // 销毁 IntersectionObserver
    const observer = (el as any).__gsapObserver
    if (observer) {
      observer.disconnect()
      delete (el as any).__gsapObserver
    }

    // 可以考虑这里销毁 timeline，如果你在 useGsap 内部缓存了 timeline
    const timeline = (el as any).__gsapTimeline
    if (timeline) {
      timeline.kill()
      delete (el as any).__gsapTimeline
    }
  },
}
