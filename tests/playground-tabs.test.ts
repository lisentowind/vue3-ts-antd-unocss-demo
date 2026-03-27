import { describe, expect, it } from 'vitest'

import {
  findPlaygroundTab,
  getDefaultPlaygroundTabKey,
  playgroundTabs,
} from '@/features/playground/demo-tabs'

describe('playground demo tabs', () => {
  it('exposes a stable default tab key', () => {
    expect(getDefaultPlaygroundTabKey()).toBe('button')
  })

  it('finds the matching tab descriptor by key', () => {
    const tab = findPlaygroundTab('zod-api')

    expect(tab?.titleKey).toBe('app.tabs.zod-api')
    expect(typeof tab?.loadComponent).toBe('function')
  })

  it('keeps demo tabs in the expected order', () => {
    expect(playgroundTabs.map(tab => tab.key)).toEqual([
      'button',
      'icon',
      'locale',
      'api',
      'echarts',
      'upload',
      'zod-form',
      'zod-data',
      'zod-api',
      'zod-hooks',
    ])
  })
})
