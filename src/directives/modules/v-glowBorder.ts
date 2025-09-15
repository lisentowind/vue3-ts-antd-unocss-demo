import type { DirectiveBinding } from 'vue'
import { nanoid } from 'nanoid'

/**
 * 添加边框阴影动画的指令
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const color = binding.value || 'rgba(85, 239, 196, 1)'

    // 生成唯一的类名
    const uniqueClass = `glow-border-${nanoid()}`
    el.classList.add(uniqueClass)

    // 先确保父元素可定位
    const style = getComputedStyle(el)
    if (style.position === 'static') {
      el.style.position = 'relative'
    }

    // 设置基础边框
    // el.style.border = `2px solid ${color.replace('1)', '0.3)')}`

    // 动态创建 CSS 样式
    const styleElement = document.createElement('style')
    styleElement.setAttribute('data-glow-border', uniqueClass)

    const cssRules = `
      .${uniqueClass}::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(
          85deg,
          ${color.replace('1)', '0.2)')},
          ${color.replace('1)', '0.6)')},
          ${color},
          ${color.replace('1)', '0.6)')},
          ${color.replace('1)', '0.2)')}
        );
        border-radius: 7px;
        z-index: -1;
        opacity: 1;
        transition: all 1s ease;
        clip-path: inset(0 0 98% 0);
        pointer-events: none;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 2px;
      }

      .${uniqueClass}::after {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(
          -85deg,
          ${color.replace('1)', '0.2)')},
          ${color.replace('1)', '0.6)')},
          ${color},
          ${color.replace('1)', '0.6)')},
          ${color.replace('1)', '0.2)')}
        );
        border-radius: 7px;
        z-index: -1;
        opacity: 1;
        transition: all 1s ease;
        clip-path: inset(98% 0 0 0);
        pointer-events: none;
        mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        mask-composite: xor;
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        padding: 2px;
      }

      .${uniqueClass}:hover {
        box-shadow: 0 8px 25px ${color.replace('1)', '0.3)')};
      }

      .${uniqueClass}:hover::before {
        background: linear-gradient(
          0deg,
          ${color.replace('1)', '0.2)')},
          ${color.replace('1)', '0.6)')},
          ${color},
          ${color.replace('1)', '0.6)')},
          ${color.replace('1)', '0.2)')}
        );
        clip-path: inset(0 0 0 98%);
      }

      .${uniqueClass}:hover::after {
        background: linear-gradient(
          0deg,
          ${color.replace('1)', '0.2)')},
          ${color.replace('1)', '0.6)')},
          ${color},
          ${color.replace('1)', '0.6)')},
          ${color.replace('1)', '0.2)')}
        );
        clip-path: inset(0 98% 0 0);
      }
    `

    styleElement.textContent = cssRules
    document.head.appendChild(styleElement)

    // 将样式元素引用存储到元素上，用于卸载时清理
    ;(el as any).__glowBorderStyle = styleElement
    ;(el as any).__glowBorderClass = uniqueClass
  },

  unmounted(el: HTMLElement) {
    // 清理样式
    const styleElement = (el as any).__glowBorderStyle
    const uniqueClass = (el as any).__glowBorderClass

    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement)
    }

    if (uniqueClass) {
      el.classList.remove(uniqueClass)
    }

    // 清理引用
    delete (el as any).__glowBorderStyle
    delete (el as any).__glowBorderClass
  },
}
