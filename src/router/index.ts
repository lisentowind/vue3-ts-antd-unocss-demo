import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { useBrowserTitle } from '@/hooks'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
    meta: {
      title: '首页',
    },
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

router.beforeEach(() => {
  NProgress.start()
})

router.afterEach(() => {
  NProgress.done()
  useBrowserTitle().routeTitleSet()
})

export default router
