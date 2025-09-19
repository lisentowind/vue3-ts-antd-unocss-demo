<script lang="ts" setup>
import { colord } from 'colord'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useThemeStore } from '@/store'

export interface CursorProps {
  radius?: number
}

const props = withDefaults(defineProps<CursorProps>(), {
  radius: 13,
})

const themeStore = useThemeStore()

function withAlpha(color: string, alpha: number) {
  return colord(color).alpha(alpha).toRgbString()
}

const color = computed(() => withAlpha(themeStore.primaryColor, 0.2))

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

function handleLeave(e: MouseEvent) {
  // 当鼠标移出窗口（relatedTarget 为 null）隐藏
  if (!e.relatedTarget)
    visible.value = false
}

function handleEnter() {
  visible.value = true
}

onMounted(() => {
  // 添加隐藏系统光标样式
  const style = document.createElement('style')
  style.innerHTML = `
    body, body * {
      cursor: none !important;
    }
  `
  document.head.appendChild(style)

  // 鼠标事件
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseout', handleLeave)
  document.addEventListener('mouseover', handleEnter)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseout', handleLeave)
  document.removeEventListener('mouseover', handleEnter)

  // 移除自定义样式
  const styles = document.querySelectorAll('style')
  styles.forEach((style) => {
    if (style.innerHTML.includes('cursor: none'))
      style.remove()
  })
})
</script>

<template>
  <teleport to="body">
    <div
      ref="mouseEl"
      class="custom-mouse"
      :style="{
        display: visible ? 'block' : 'none',
        width: `${props.radius * 2}px`,
        height: `${props.radius * 2}px`,
        backgroundColor: color,
      }"
    ></div>
  </teleport>
</template>

<style lang="less" scoped>
.custom-mouse {
  border-radius: 50%;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 0 2px 1px var(--color-primary);
  backdrop-filter: blur(5px);
  z-index: 999999;
  will-change: transform;
  transform: translate3d(0, 0, 0);

  /* CSS 平滑跟随 */
  transition:
    transform 0.08s ease-out,
    width 0.02s ease-in-out,
    height 0.02s ease-in-out;
}
</style>
