import type { DirectiveBinding } from 'vue'
import { colord } from 'colord'
import { nanoid } from 'nanoid'

export type GlowBorderOptions = {
  color?: string
  radius?: string
}

function withAlpha(color: string, alpha: number) {
  return colord(color).alpha(alpha).toRgbString()
}

function removeStyle(el: HTMLElement) {
  const styleElement = (el as any).__glowBorderStyle
  const uniqueClass = (el as any).__glowBorderClass

  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
  }

  if (uniqueClass) {
    el.classList.remove(uniqueClass)
  }

  delete (el as any).__glowBorderStyle
  delete (el as any).__glowBorderClass
}

// ✅ 把 mounted 逻辑提取成独立函数
function applyGlow(el: HTMLElement, color: string, radius = '7px') {
  removeStyle(el)
  const uniqueClass = `glow-border-${nanoid()}`
  el.classList.add(uniqueClass)

  const style = getComputedStyle(el)
  if (style.position === 'static') {
    el.style.position = 'relative'
  }

  const styleElement = document.createElement('style')
  styleElement.setAttribute('data-glow-border', uniqueClass)

  const cssRules = `
    .${uniqueClass}::before {
      content: '';
      position: absolute;
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      background: linear-gradient(
        85deg,
        ${withAlpha(color, 0.2)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 1)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 0.2)}
      );
      border-radius: ${radius};
      z-index: 1;
      pointer-events: none;
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
      top: -2px; left: -2px; right: -2px; bottom: -2px;
      background: linear-gradient(
        -85deg,
        ${withAlpha(color, 0.2)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 1)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 0.2)}
      );
      border-radius: ${radius};
      z-index: 1;
      pointer-events: none;
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
      box-shadow: 0 8px 25px ${withAlpha(color, 0.3)};
    }

    .${uniqueClass}:hover::before {
      background: linear-gradient(
        0deg,
        ${withAlpha(color, 0.2)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 1)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 0.2)}
      );
      clip-path: inset(0 0 0 98%);
    }

    .${uniqueClass}:hover::after {
      background: linear-gradient(
        0deg,
        ${withAlpha(color, 0.2)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 1)},
        ${withAlpha(color, 0.6)},
        ${withAlpha(color, 0.2)}
      );
      clip-path: inset(0 98% 0 0);
    }
  `

  styleElement.textContent = cssRules
  document.head.appendChild(styleElement)
  ;(el as any).__glowBorderStyle = styleElement
  ;(el as any).__glowBorderClass = uniqueClass
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<GlowBorderOptions>) {
    applyGlow(
      el,
      binding.value.color || 'rgba(85, 239, 196, 1)',
      binding.value.radius,
    )
  },

  updated(el: HTMLElement, binding: DirectiveBinding<GlowBorderOptions>) {
    if (binding.oldValue !== binding.value) {
      applyGlow(
        el,
        binding.value.color || 'rgba(85, 239, 196, 1)',
        binding.value.radius,
      )
    }
  },

  unmounted(el: HTMLElement) {
    removeStyle(el)
  },
}
