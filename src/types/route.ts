import type { RouteRecordRaw } from 'vue-router'

export interface RouteMeta {
  title?: string
  icon?: string
  roles?: string[]
  hidden?: boolean
  keepAlive?: boolean
  affix?: boolean
}

export interface AppRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  meta?: RouteMeta
  children?: AppRouteRecordRaw[]
}
