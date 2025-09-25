import type { AxiosProgressEvent } from 'axios'
import NP from 'number-precision'
import { useCancelRequest } from '@/hooks'
import baseAxios from '..'

const { createRequest } = useCancelRequest()

/**
 * @description 文件上传
 * @date 17/06/2022
 * @export
 */
export function uploadFile(
  data: FormData,
  onProgress: (
    percent: number,
    event?: AxiosProgressEvent | ProgressEvent,
  ) => void,
  path: string,
) {
  return baseAxios.post<DataResponse<string>>(
    '/fileUpload/file-server/uploadFile/uploadOne',
    data,
    {
      headers: {
        cancelToken: path,
      },
      onUploadProgress: (e) => {
        const percent
          = e.total && e.total > 0 ? NP.round(e.loaded / e.total, 2) : 0
        onProgress(percent, e)
      },
      cancelToken: createRequest(path),
    },
  )
}
