import Cookies from 'js-cookie'

interface StorageLike {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

interface CookieLike {
  get: (key: string) => string | undefined
  set: (key: string, value: string, options: { expires: number }) => void
  remove: (key: string) => void
}

interface AuthStorageOptions {
  tokenKey: string
  isElectron: boolean
  localStorage: StorageLike
  cookies: CookieLike
}

export function createAuthStorage(options: AuthStorageOptions) {
  const { tokenKey, isElectron, localStorage, cookies } = options

  function isLogin() {
    if (isElectron) {
      return !!localStorage.getItem(tokenKey)
    }
    return !!cookies.get(tokenKey)
  }

  function getToken() {
    if (isElectron) {
      return localStorage.getItem(tokenKey)
    }
    return cookies.get(tokenKey) ?? null
  }

  function setToken(token: string) {
    if (isElectron) {
      localStorage.setItem(tokenKey, token)
      return
    }
    cookies.set(tokenKey, token, { expires: 0.5 })
  }

  function clearToken() {
    if (isElectron) {
      localStorage.removeItem(tokenKey)
      return
    }
    cookies.remove(tokenKey)
  }

  return {
    isLogin,
    getToken,
    setToken,
    clearToken,
  }
}

const { VITE_APP_TOKEN_KEY, VITE_IS_ELE } = import.meta.env

const authStorage = createAuthStorage({
  tokenKey: VITE_APP_TOKEN_KEY,
  isElectron: VITE_IS_ELE === 'true',
  localStorage: window.localStorage,
  cookies: Cookies,
})

export const { clearToken, getToken, isLogin, setToken } = authStorage
