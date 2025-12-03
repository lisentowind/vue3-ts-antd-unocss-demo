import type { AppRouteRecordRaw } from '@/types/route'
import { defineStore } from 'pinia'
import { asyncRoutes } from '@/router/routes/async'
import { constantRoutes } from '@/router/routes/constant'

interface PermissionState {
  routes: AppRouteRecordRaw[]
  addRoutes: AppRouteRecordRaw[]
  isRoutesGenerated: boolean
}

function hasPermission(roles: string[], route: AppRouteRecordRaw): boolean {
  if (!route.meta?.roles) {
    return true
  }
  return roles.some(role => route.meta!.roles!.includes(role))
}

function filterAsyncRoutes(routes: AppRouteRecordRaw[], roles: string[]): AppRouteRecordRaw[] {
  const res: AppRouteRecordRaw[] = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routes: [],
    addRoutes: [],
    isRoutesGenerated: false,
  }),

  getters: {
    getRoutes: state => state.routes,
    getAddRoutes: state => state.addRoutes,
  },

  actions: {
    generateRoutes(roles: string[]) {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)

      this.addRoutes = accessedRoutes
      this.routes = constantRoutes.concat(accessedRoutes)
      this.isRoutesGenerated = true

      return accessedRoutes
    },

    resetRoutes() {
      this.routes = []
      this.addRoutes = []
      this.isRoutesGenerated = false
    },
  },
})
