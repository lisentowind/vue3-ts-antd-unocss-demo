import dayjs from 'dayjs'
import { useMessage } from '@/hooks'

const { msgSuccess, msgError, msgLoading } = useMessage()

export type DownloadFileType
  = | 'xlsx'
    | 'word'
    | 'pdf'
    | 'ppt'
    | 'zip'
    | 'png'
    | 'jpeg'
    | 'webp'
    | string

/**
 * @description 描述 下载文件
 * @date 2025-04-03 11:31:09
 * @author tingfeng
 *
 * @async
 * @param inputUrl
 * @param fileName
 * @param type
 */
export async function fetchDownload(
  inputUrl: string,
  fileName: string,
  type: DownloadFileType,
  customFileName?: string,
) {
  try {
    const response = await fetch(`${inputUrl}?t=${new Date().getTime()}`)
    // 处理 HTTP 错误
    if (!response.ok) {
      throw new Error(`下载文件失败: ${response.status} ${response.statusText}`)
    }
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const time = dayjs().format('YYYY年MM月DD日 HH时mm分ss秒')
    const link = document.createElement('a')
    link.href = url
    link.download = customFileName ?? `${fileName}_${time}_导出数据.${type}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 释放 blob URL
    URL.revokeObjectURL(url)
  }
  catch (error) {
    console.log(error)
    msgError({
      content: '下载文件失败',
    })
    throw new Error('下载文件失败')
  }
}

/**
 * @description 描述 下载流式的blob文件
 * @date 2025-04-08 17:15:08
 * @author tingfeng
 *
 * @param file
 * @param fileName
 * @param type
 * @param [customFileName]
 */
export function fetchBlobDownLoad(
  file: Blob,
  fileName: string,
  type: 'xlsx' | 'word' | 'pdf' | 'ppt' | 'zip',
  customFileName?: string,
) {
  try {
    const url = window.URL.createObjectURL(file)
    const time = dayjs().format('YYYY年MM月DD日 HH时mm分ss秒')
    const link = document.createElement('a')
    link.href = url
    link.download = customFileName ?? `${fileName}_${time}_导出数据.${type}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 释放 blob URL
    URL.revokeObjectURL(url)
  }
  catch (error) {
    console.log(error)
    msgError({
      content: '下载文件失败',
    })
    throw new Error('下载文件失败')
  }
}

/**
 * @description 描述 下载浏览器本地文件
 * @date 2025-05-06 15:12:07
 * @author tingfeng
 *
 * @param url
 * @param fileName
 * @param type
 * @param [customFileName]
 */
export function downloadLocalFile(
  url: string,
  fileName: string,
  type: DownloadFileType,
  customFileName?: string,
) {
  try {
    msgLoading({
      content: {
        key: 'download-local-file',
        content: '正在下载文件...',
      },
      duration: 0,
    })
    const time = dayjs().format('YYYY年MM月DD日 HH时mm分ss秒')
    const link = document.createElement('a')
    link.href = url
    link.download = customFileName ?? `${fileName}_${time}_导出数据.${type}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    // 释放 blob URL
    URL.revokeObjectURL(url)
    msgSuccess({
      content: {
        key: 'download-local-file',
        content: '文件下载成功',
      },
      duration: 200,
    })
  }
  catch (error) {
    msgError({
      content: {
        key: 'download-local-file',
        content: '文件下载失败',
      },
      duration: 2000,
    })
    throw error
  }
}
