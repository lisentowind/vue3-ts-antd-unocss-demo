import type { AppRouteRecordRaw } from '@/types/route'

export const playgroundRoutes: AppRouteRecordRaw[] = [
  {
    path: '/demo',
    component: () => import('@/layout/index.vue'),
    redirect: '/demo/index',
    children: [
      {
        path: 'index',
        name: 'Demo',
        component: () => import('@/features/playground/views/index.vue'),
        meta: {
          title: '组件演示',
          icon: 'material-symbols:widgets-outline',
          roles: ['admin', 'editor', 'guest'],
        },
      },
    ],
  },
]
