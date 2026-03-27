export interface PlaygroundTab {
  key: string
  titleKey: string
  loadComponent: () => Promise<unknown>
}

export const playgroundTabs: PlaygroundTab[] = [
  {
    key: 'button',
    titleKey: 'app.tabs.button',
    loadComponent: () => import('@/views/components/btn-demo.vue'),
  },
  {
    key: 'icon',
    titleKey: 'app.tabs.icon',
    loadComponent: () => import('@/views/components/icon-demo.vue'),
  },
  {
    key: 'locale',
    titleKey: 'app.tabs.locale',
    loadComponent: () => import('@/views/components/local-demo.vue'),
  },
  {
    key: 'api',
    titleKey: 'app.tabs.api',
    loadComponent: () => import('@/views/components/api-demo.vue'),
  },
  {
    key: 'echarts',
    titleKey: 'app.tabs.echarts',
    loadComponent: () => import('@/views/components/echarts-demo.vue'),
  },
  {
    key: 'upload',
    titleKey: 'app.tabs.upload',
    loadComponent: () => import('@/views/components/upload-demo.vue'),
  },
  {
    key: 'zod-form',
    titleKey: 'app.tabs.zod-form',
    loadComponent: () => import('@/views/components/zod-form-demo.vue'),
  },
  {
    key: 'zod-data',
    titleKey: 'app.tabs.zod-data',
    loadComponent: () => import('@/views/components/zod-data-demo.vue'),
  },
  {
    key: 'zod-api',
    titleKey: 'app.tabs.zod-api',
    loadComponent: () => import('@/views/components/zod-api-demo.vue'),
  },
  {
    key: 'zod-hooks',
    titleKey: 'app.tabs.zod-hooks',
    loadComponent: () => import('@/views/components/zod-hooks-demo.vue'),
  },
]

export function getDefaultPlaygroundTabKey() {
  return playgroundTabs[0]?.key ?? ''
}

export function findPlaygroundTab(key: string) {
  return playgroundTabs.find(tab => tab.key === key)
}
