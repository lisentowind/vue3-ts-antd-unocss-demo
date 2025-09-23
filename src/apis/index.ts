import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { ApiEventEmitter } from '@/utils'

const { VITE_API_BASE_URL } = import.meta.env

const codeWhite = [20000, 200, 1001]
const tokenWhite = ['/login']

const baseAxios = axios.create({
  timeout: 1000 * 60 * 0.5,
})

// 设置 baseAxios 基本 URL
if (VITE_API_BASE_URL) {
  baseAxios.defaults.baseURL = `${VITE_API_BASE_URL}`
}

baseAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const path = `${config.url}${new Date().valueOf()}`

    // 其他地方处理token
    const token = ''

    if (token && !tokenWhite.some(item => new RegExp(item).test(path))) {
      config.headers.Authorization = token
      config.headers.cancelToken = path
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

baseAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status } = response
    if (!codeWhite.includes(status)) {
      ApiEventEmitter.emit('noInCodeWhiteErr', { res: response })
      return Promise.reject(new Error('Error'))
    }
    return response
  },
  (error) => {
    ApiEventEmitter.emit('responseErr', {
      res: error as unknown as AxiosError,
    })
    return Promise.reject(error)
  },
)

export default baseAxios
