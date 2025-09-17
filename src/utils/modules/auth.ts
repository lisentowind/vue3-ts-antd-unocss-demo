import Cookies from 'js-cookie'

const { VITE_APP_TOKEN_KEY, VITE_IS_ELE } = import.meta.env
const isEle = VITE_IS_ELE === 'true'

// localStorage启用是为了解决在electron中无法使用cookie的问题

function isLogin() {
  if (isEle) {
    return !!localStorage.getItem(VITE_APP_TOKEN_KEY)
  }
  return !!Cookies.get(VITE_APP_TOKEN_KEY)
}

function getToken() {
  if (isEle) {
    return localStorage.getItem(VITE_APP_TOKEN_KEY)
  }
  return Cookies.get(VITE_APP_TOKEN_KEY)
}

function setToken(token: string) {
  if (isEle) {
    localStorage.setItem(VITE_APP_TOKEN_KEY, token)
    return
  }
  Cookies.set(VITE_APP_TOKEN_KEY, token, { expires: 0.5 })
}

function clearToken() {
  if (isEle) {
    localStorage.removeItem(VITE_APP_TOKEN_KEY)
    return
  }
  Cookies.remove(VITE_APP_TOKEN_KEY)
}

export { clearToken, getToken, isLogin, setToken }
