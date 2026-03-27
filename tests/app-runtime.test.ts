import { describe, expect, it, vi } from 'vitest'

import { setupAppRuntime } from '@/bootstrap/app-runtime'

describe('setupAppRuntime', () => {
  it('initializes runtime side effects and returns a cleanup function', () => {
    const cleanupRefresh = vi.fn()
    const stopUpdateDetector = vi.fn()
    const deps = {
      primaryColor: 'rgba(20,143,22,1)',
      applyThemeColors: vi.fn(),
      setPrimaryColor: vi.fn(),
      subscribeRefreshPage: vi.fn((handler: (payload: { path: string }) => void) => {
        handler({ path: '/dashboard' })
        return cleanupRefresh
      }),
      notifyRefreshPage: vi.fn(),
      reloadPage: vi.fn(),
      startUpdateDetector: vi.fn(() => stopUpdateDetector),
      destroyMessages: vi.fn(),
      destroyModals: vi.fn(),
      t: vi.fn((key: string) => key),
    }

    const cleanup = setupAppRuntime(deps)

    expect(deps.applyThemeColors).toHaveBeenCalledTimes(1)
    expect(deps.setPrimaryColor).toHaveBeenCalledWith('rgba(20,143,22,1)')
    expect(deps.startUpdateDetector).toHaveBeenCalledTimes(1)
    expect(deps.notifyRefreshPage).toHaveBeenCalledWith(
      'app.event.reload.front /dashboard app.event.reload.back',
    )
    expect(deps.reloadPage).toHaveBeenCalledTimes(1)

    cleanup()

    expect(cleanupRefresh).toHaveBeenCalledTimes(1)
    expect(stopUpdateDetector).toHaveBeenCalledTimes(1)
    expect(deps.destroyMessages).toHaveBeenCalledTimes(1)
    expect(deps.destroyModals).toHaveBeenCalledTimes(1)
  })
})
