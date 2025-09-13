import type { RouteRecordRaw } from 'vue-router'
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/views/index.vue'),
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

router.afterEach(() => {
  NProgress.done()
})

export default router
