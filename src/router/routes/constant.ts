import type { AppRouteRecordRaw } from '@/types/route'

/**
 * 常量路由
 * 不需要权限验证的路由
 */
export const constantRoutes: AppRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true,
    },
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/views/redirect/index.vue'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
]

/**
 * 404 路由
 * 需要在所有路由加载完成后最后添加
 */
export const notFoundRoute: AppRouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  meta: {
    hidden: true,
  },
}
