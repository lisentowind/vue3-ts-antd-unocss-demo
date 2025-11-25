import { cloneDeep } from 'lodash'
import { getCurrentInstance, onUnmounted, reactive, ref } from 'vue'

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

  if (getCurrentInstance()) {
    onUnmounted(() => {
      reset()
    })
  }

  return {
    state,
    reset,
    set,
  }
}

/**
 * @description 描述 可以重置的reactive的hooks
 * @date 2025-11-25 15:48:16
 * @author tingfeng
 *
 * @export
 * @template T
 * @param v
 * @param [clone]
 */
export function useResetFormReactive<T extends object>(
  v: T,
  clone = cloneDeep,
) {
  const initValue = clone(v)
  const state = reactive(v) as T

  const reset = () => {
    Object.assign(state, clone(initValue))
  }

  const set = (newValue: Partial<T>) => {
    Object.assign(state, clone(newValue))
  }

  // ✅ 只有在组件 setup() 内调用时才注册生命周期
  if (getCurrentInstance()) {
    onUnmounted(() => {
      reset()
    })
  }

  return {
    state,
    reset,
    set,
  }
}
