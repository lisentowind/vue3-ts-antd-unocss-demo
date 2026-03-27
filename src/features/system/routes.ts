import type { AppRouteRecordRaw } from '@/types/route'

export const systemRoutes: AppRouteRecordRaw[] = [
  {
    path: '/system',
    component: () => import('@/layout/index.vue'),
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'material-symbols:settings-outline',
      roles: ['admin'],
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'material-symbols:person-outline',
          roles: ['admin'],
        },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('@/views/system/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'material-symbols:group-outline',
          roles: ['admin'],
        },
      },
      {
        path: 'menu',
        name: 'SystemMenu',
        component: () => import('@/views/system/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'material-symbols:menu',
          roles: ['admin'],
        },
      },
    ],
  },
]
