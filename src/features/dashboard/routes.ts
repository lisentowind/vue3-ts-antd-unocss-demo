import type { AppRouteRecordRaw } from '@/types/route'

export const dashboardRoutes: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'material-symbols:dashboard-outline',
          roles: ['admin', 'editor'],
          affix: true,
        },
      },
    ],
  },
]
