import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { useBrowserTitle, useMessage } from '@/hooks'
import { usePermissionStore } from '@/store/modules/permission'
import { useUserStore } from '@/store/modules/user'
import { constantRoutes, notFoundRoute } from './routes/constant'

const { msgError } = useMessage()

const router = createRouter({
  routes: constantRoutes as RouteRecordRaw[],
  history: createWebHistory(),
})

// 白名单路由（不需要登录）
const whiteList = ['/login', '/404']

router.beforeEach(async (to, _from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  // 检查 token 是否过期
  if (userStore.isLoggedIn && userStore.isTokenExpired) {
    console.warn('Token 已过期，清除登录状态')
    // Token 已过期，清除登录信息
    userStore.logout()
    permissionStore.resetRoutes()

    // 如果不是访问白名单页面，跳转到登录页
    if (!whiteList.includes(to.path)) {
      next(`/login?redirect=${to.path}`)
      msgError({
        content: '登录已过期，请重新登录',
      })
      NProgress.done()
      return
    }
  }

  // 已登录
  if (userStore.isLoggedIn) {
    // 刷新 token 过期时间（用户有活动时延长过期时间）
    userStore.refreshTokenExpireTime()

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
