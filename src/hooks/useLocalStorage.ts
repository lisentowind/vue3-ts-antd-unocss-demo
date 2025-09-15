/**
 * @description 描述 本地存储封装
 * @date 2025-09-15 11:57:50
 * @author tingfeng
 *
 * @export
 */
export function useLocalStorage() {
  const setValue = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
  const getValue = (key: string): any => {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  const removeValue = (key: string) => {
    localStorage.removeItem(key)
  }

  return {
    setValue,
    getValue,
    removeValue,
  }
}
