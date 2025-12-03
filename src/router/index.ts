import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { useBrowserTitle } from '@/hooks'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { constantRoutes, notFoundRoute } from './routes/constant'

const router = createRouter({
  routes: constantRoutes as RouteRecordRaw[],
  history: createWebHistory(),
})

// 白名单路由（不需要登录）
const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 已登录
  if (userStore.isLoggedIn) {
    if (to.path === '/login') {
      // 已登录则跳转到首页
      next({ path: userStore.getHomePath })
      NProgress.done()
    }
    else {
      // 检查是否已生成路由
      if (!permissionStore.isRoutesGenerated) {
        try {
          // 根据角色生成可访问路由
          const accessRoutes = permissionStore.generateRoutes(
            userStore.getUserRoles,
          )

          // 动态添加路由
          accessRoutes.forEach((route) => {
            router.addRoute(route as RouteRecordRaw)
          })

          // 最后添加 404 路由，确保它在所有路由之后
          router.addRoute(notFoundRoute as RouteRecordRaw)

          // 确保添加路由完成后再跳转
          next({ ...to, replace: true })
        }
        catch (error) {
          console.error('生成路由失败:', error)
          // 清除用户信息
          userStore.logout()
          permissionStore.resetRoutes()
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
      else {
        next()
      }
    }
  }
  else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    }
    else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
  useBrowserTitle().routeTitleSet()
})

export default router
