import type { AxiosError, AxiosResponse } from 'axios'
import type { Emitter } from 'mitt'
import mitt from 'mitt'

// 基础demo
export type AppEventPayload = { path: string }
export type AppEventMitt = {
  // 刷新页面
  refreshPage: AppEventPayload
}

export const AppEventEmitter: Emitter<AppEventMitt> = mitt<AppEventMitt>()

// api 接口响应事件处理

export type ApiEventPayload = { res: AxiosResponse }
export type ApiEventMitt = {
  // 响应的 code 不在白名单中，视为失败
  noInCodeWhiteErr: ApiEventPayload
  // 响应错误处理
  responseErr: {
    res: AxiosError
  }
}
export const ApiEventEmitter: Emitter<ApiEventMitt> = mitt<ApiEventMitt>()
