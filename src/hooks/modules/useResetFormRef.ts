import { cloneDeep } from 'lodash'
import { onUnmounted, ref } from 'vue'

/**
 * @description 描述  可以重置表单初始状态的 ref
 * @date 2025-09-15 11:56:57
 * @author tingfeng
 *
 * @export
 * @template T
 * @param v
 */
export function useResetFormRef<T>(v: T, clone = cloneDeep) {
  const initValue = clone(v)
  const state = ref(v)

  const reset = () => {
    state.value = clone(initValue)
  }

  const set = (newValue: Partial<T>) => {
    state.value = {
      ...clone(state.value),
      ...clone(newValue),
    }
  }

  onUnmounted(() => {
    reset()
  })

  return {
    state,
    reset,
    set,
  }
}
