import type { AxiosProgressEvent } from 'axios'
import NP from 'number-precision'
import { useCancelRequest } from '@/hooks'
import baseAxios from '..'

NP.enableBoundaryChecking(false)

const { createRequest, deleteRequest } = useCancelRequest()

/**
 * @description 文件上传（安全且无内存泄露）
 */
export function uploadFile(
  data: FormData,
  onProgress: (
    percent: number,
    event?: AxiosProgressEvent | ProgressEvent,
  ) => void,
  path: string,
) {
  // 创建取消令牌
  const cancelToken = createRequest(path)

  return baseAxios
    .post<DataResponse<string>>(
      '/fileUpload/file-server/uploadFile/uploadOne',
      data,
      {
        onUploadProgress: (e) => {
          // ✅ 安全保护，避免 NP 精度警告
          const loaded = Math.min(e.loaded ?? 0, Number.MAX_SAFE_INTEGER)
          const total = Math.min(e.total ?? 0, Number.MAX_SAFE_INTEGER)
          const percent = total > 0 ? NP.round(loaded / total, 2) : 0

          onProgress(percent, e)
        },
        cancelToken,
      },
    )
    .finally(() => {
      // ✅ 防止内存泄露：请求完成后清理对应 path
      deleteRequest(path)
    })
}
