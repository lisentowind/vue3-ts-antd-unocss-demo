import type { AppRouteRecordRaw } from '@/types/route'

export const readonlyRoutes: AppRouteRecordRaw[] = [
  {
    path: '/readonly',
    component: () => import('@/layout/index.vue'),
    redirect: '/readonly/home',
    meta: {
      title: '只读模块',
      icon: 'material-symbols:visibility-outline',
      roles: ['admin', 'editor', 'guest'],
    },
    children: [
      {
        path: 'home',
        name: 'ReadonlyHome',
        component: () => import('@/views/readonly/home/index.vue'),
        meta: {
          title: '只读首页',
          icon: 'material-symbols:home-outline',
          roles: ['admin', 'editor', 'guest'],
        },
      },
    ],
  },
]
