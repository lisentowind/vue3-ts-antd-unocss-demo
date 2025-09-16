import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

const { VITE_API_BASE_URL } = import.meta.env

const baseAxios = axios.create({
  timeout: 1000 * 60 * 5,
})

// 设置 baseAxios 基本 URL
if (VITE_API_BASE_URL) {
  baseAxios.defaults.baseURL = `${VITE_API_BASE_URL}`
}

baseAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 处理文件上传请求

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

baseAxios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    return response
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default baseAxios
