import type { Emitter } from 'mitt'
import mitt from 'mitt'

// 基础demo
export type AppEventPayload = { path: string }
export type AppEventMitt = {
  // 刷新页面
  refreshPage: AppEventPayload
}

const AppEventEmitter: Emitter<AppEventMitt> = mitt<AppEventMitt>()

export { AppEventEmitter }
