import { describe, expect, it, vi } from 'vitest'

import { createAuthStorage } from '@/utils/modules/auth'

function createMemoryStorage() {
  const data = new Map<string, string>()

  return {
    getItem(key: string) {
      return data.get(key) ?? null
    },
    setItem(key: string, value: string) {
      data.set(key, value)
    },
    removeItem(key: string) {
      data.delete(key)
    },
  }
}

describe('createAuthStorage', () => {
  it('uses local storage in electron mode', () => {
    const localStorage = createMemoryStorage()
    const cookies = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
    }

    const authStorage = createAuthStorage({
      tokenKey: 'token-key',
      isElectron: true,
      localStorage,
      cookies,
    })

    authStorage.setToken('electron-token')

    expect(localStorage.getItem('token-key')).toBe('electron-token')
    expect(cookies.set).not.toHaveBeenCalled()
    expect(authStorage.getToken()).toBe('electron-token')
    expect(authStorage.isLogin()).toBe(true)
  })

  it('uses cookies in browser mode', () => {
    const cookies = {
      get: vi.fn(() => 'browser-token'),
      set: vi.fn(),
      remove: vi.fn(),
    }

    const authStorage = createAuthStorage({
      tokenKey: 'token-key',
      isElectron: false,
      localStorage: createMemoryStorage(),
      cookies,
    })

    authStorage.setToken('browser-token')
    authStorage.clearToken()

    expect(cookies.set).toHaveBeenCalledWith('token-key', 'browser-token', {
      expires: 0.5,
    })
    expect(cookies.remove).toHaveBeenCalledWith('token-key')
    expect(authStorage.getToken()).toBe('browser-token')
  })
})
