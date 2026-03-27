import type { AppRouteRecordRaw } from '@/types/route'

export const contentRoutes: AppRouteRecordRaw[] = [
  {
    path: '/content',
    component: () => import('@/layout/index.vue'),
    redirect: '/content/list',
    meta: {
      title: '内容管理',
      icon: 'material-symbols:article-outline',
      roles: ['admin', 'editor'],
    },
    children: [
      {
        path: 'list',
        name: 'ContentList',
        component: () => import('@/views/content/list/index.vue'),
        meta: {
          title: '内容列表',
          icon: 'material-symbols:list-alt-outline',
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'create',
        name: 'ContentCreate',
        component: () => import('@/views/content/create/index.vue'),
        meta: {
          title: '创建内容',
          icon: 'material-symbols:add-circle-outline',
          roles: ['admin', 'editor'],
        },
      },
    ],
  },
]
