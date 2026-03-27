import type { AppRouteRecordRaw } from '@/types/route'

export const userRoutes: AppRouteRecordRaw[] = [
  {
    path: '/user',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '用户中心',
      icon: 'material-symbols:person-outline',
      roles: ['admin', 'editor', 'guest'],
      hidden: true,
    },
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/profile/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'material-symbols:person-outline',
          roles: ['admin', 'editor', 'guest'],
        },
      },
    ],
  },
]
