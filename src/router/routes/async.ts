import type { AppRouteRecordRaw } from '@/types/route'

/**
 * 异步路由
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes: AppRouteRecordRaw[] = [
  // Dashboard - admin 和 editor 都可以访问
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

  // 系统管理 - 仅 admin 可访问
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

  // 内容管理 - admin 和 editor 可访问
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

  // 只读模块 - 所有角色都可访问
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

  // Demo 页面 - 所有角色都可访问
  {
    path: '/demo',
    component: () => import('@/layout/index.vue'),
    redirect: '/demo/index',
    children: [
      {
        path: 'index',
        name: 'Demo',
        component: () => import('@/views/index.vue'),
        meta: {
          title: '组件演示',
          icon: 'material-symbols:widgets-outline',
          roles: ['admin', 'editor', 'guest'],
        },
      },
    ],
  },

  // 用户中心 - 所有角色都可访问
  {
    path: '/user',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '用户中心',
      icon: 'material-symbols:person-outline',
      roles: ['admin', 'editor', 'guest'],
      hidden: true, // 不在菜单中显示
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
