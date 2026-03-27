import type { AppRouteRecordRaw } from '@/types/route'
import { contentRoutes } from '@/features/content/routes'
import { dashboardRoutes } from '@/features/dashboard/routes'
import { playgroundRoutes } from '@/features/playground/routes'
import { readonlyRoutes } from '@/features/readonly/routes'
import { systemRoutes } from '@/features/system/routes'
import { userRoutes } from '@/features/user/routes'

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes: AppRouteRecordRaw[] = [
  ...dashboardRoutes,
  ...systemRoutes,
  ...contentRoutes,
  ...readonlyRoutes,
  ...playgroundRoutes,
  ...userRoutes,
]
