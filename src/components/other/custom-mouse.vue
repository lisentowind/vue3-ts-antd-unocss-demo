<script lang="ts" setup>
import { colord } from 'colord'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useThemeStore } from '@/store'

export interface CursorProps {
  radius?: number
}

const props = withDefaults(defineProps<CursorProps>(), {
  radius: 10,
})

const themeStore = useThemeStore()

function withAlpha(color: string, alpha: number) {
  return colord(color).alpha(alpha).toRgbString()
}

const color = computed(() => withAlpha(themeStore.primaryColor, 0.2))

// 外层（负责移动）
const mouseEl = ref<HTMLDivElement | null>(null)
const visible = ref(true)

function handleMouseMove(e: MouseEvent) {
  if (!mouseEl.value)
    return
  const r = props.radius
  mouseEl.value.style.transform = `translate3d(${e.clientX - r}px, ${
    e.clientY - r
  }px, 0)`
}

// 点击时触发缩放动画（内层元素）
function handleClick() {
  const circle = mouseEl.value?.querySelector<HTMLDivElement>('.cursor-circle')
  if (!circle)
    return

  circle.style.transform = 'scale(0.8)'
  setTimeout(() => {
    circle.style.transform = 'scale(1)'
  }, 150) // 回弹时间和 transition 保持一致
}

function handleLeave(e: MouseEvent) {
  if (!e.relatedTarget)
    visible.value = false
}

function handleEnter() {
  visible.value = true
}

type Handler<K extends keyof DocumentEventMap> = (
  ev: DocumentEventMap[K],
) => void

// 原始事件处理函数
const rawEventMap: Map<keyof DocumentEventMap, Handler<any>> = new Map([
  ['mousemove', handleMouseMove],
  ['mouseout', handleLeave],
  ['mouseover', handleEnter],
  ['click', handleClick],
  ['dblclick', handleClick],
])

// 包装后的监听器，用于 addEventListener/removeEventListener
const listenerMap = new Map<keyof DocumentEventMap, EventListener>()

function addListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: Handler<K>,
) {
  const wrapped: EventListener = e => handler(e as DocumentEventMap[K])
  listenerMap.set(event, wrapped)
  document.addEventListener(event, wrapped)
}

function removeAllListeners() {
  listenerMap.forEach((wrapped, event) => {
    document.removeEventListener(event, wrapped)
  })
  listenerMap.clear()
}

onMounted(() => {
  const style = document.createElement('style')
  style.innerHTML = `
    body, body * {
      cursor: none !important;
    }
  `
  document.head.appendChild(style)

  // 统一绑定事件
  rawEventMap.forEach((handler, event) => {
    addListener(event, handler)
  })
})

onUnmounted(() => {
  removeAllListeners()

  const styles = document.querySelectorAll('style')
  styles.forEach((style) => {
    if (style.innerHTML.includes('cursor: none'))
      style.remove()
  })
})
</script>

<template>
  <teleport to="body">
    <!-- 外层：负责位置 -->
    <div
      ref="mouseEl"
      class="custom-mouse"
      :style="{
        display: visible ? 'block' : 'none',
        width: `${props.radius * 2}px`,
        height: `${props.radius * 2}px`,
      }"
    >
      <!-- 内层：负责缩放和颜色 -->
      <div class="cursor-circle" :style="{ backgroundColor: color }"></div>
    </div>
  </teleport>
</template>

<style lang="less" scoped>
.custom-mouse {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  will-change: transform;
  transform: translate3d(0, 0, 0);

  transition: transform 0.3s cubic-bezier(0.07, 1.19, 0.44, 1.07); // 平滑跟随
}

.cursor-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid var(--color-primary);
  backdrop-filter: blur(3px);

  transition: transform 0.15s cubic-bezier(0.3, 0.7, 0.4, 1); // 点击缩放
}
</style>
