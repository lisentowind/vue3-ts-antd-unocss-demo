interface DataResponse<T = unknown> {
  code: number
  data: T
  msg: string
}

interface HttpResponse<T = DataResponse> {
  status: number
  msg: string
  code: number
  data: T
  result: T
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders
  config: AxiosRequestConfig
}
