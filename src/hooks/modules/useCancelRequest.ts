import type { CancelToken } from 'axios'
import axios from 'axios'

type CancelItem = (message?: string) => void

const cancelMap = new Map<string, CancelItem>()

function useCancelRequest() {
  const createRequest = (path: string): CancelToken => {
    return new axios.CancelToken((cancel) => {
      cancelMap.set(path, cancel)
    })
  }

  const cancelRequest = (path: string, message?: string) => {
    if (!cancelMap.has(path))
      return
    const cancel = cancelMap.get(path)
    if (cancel)
      cancel(message)

    cancelMap.delete(path)
  }

  const deleteRequest = (path: string) => {
    cancelMap.delete(path)
  }

  const clearRequest = () => {
    cancelMap.clear()
  }

  return {
    createRequest,
    cancelRequest,
    deleteRequest,
    clearRequest,
  }
}

export { useCancelRequest }
