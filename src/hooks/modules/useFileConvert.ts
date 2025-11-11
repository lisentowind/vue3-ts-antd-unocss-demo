import { shallowRef } from 'vue'

/**
 * File -> Base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = e => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 图片URL -> Base64
 * 注意：图片必须允许跨域访问，否则会触发 CORS 错误
 */
function imageUrlToBase64(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx)
        return reject(new Error('Canvas context not found'))
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }

    img.onerror = reject
  })
}

/**
 * Base64 -> Blob
 */
function dataURLtoBlob(dataUrl: string): Blob {
  const [header, body] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png'
  const binary = atob(body)
  const len = binary.length
  const u8arr = new Uint8Array(len)

  for (let i = 0; i < len; i++) {
    u8arr[i] = binary.charCodeAt(i)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * Blob -> File
 */
function blobToFile(blob: Blob, fileName?: string): File {
  const type = blob.type || 'application/octet-stream'
  const name = fileName || `${Date.now()}.${type.split('/')[1] || 'bin'}`
  return new File([blob], name, { type })
}

/**
 * 通用 Hook：文件与 Base64 / Blob 互转
 * 使用 shallowRef 避免深层响应追踪，提高性能
 */
export function useFileConvert() {
  const base64 = shallowRef<string | null>(null)
  const file = shallowRef<File | null>(null)
  const blob = shallowRef<Blob | null>(null)

  /** File => Base64 */
  const convertFileToBase64 = async (f: File) => {
    const base64Str = await fileToBase64(f)
    base64.value = base64Str
    file.value = f
    blob.value = dataURLtoBlob(base64Str)
    return base64Str
  }

  /** Base64 => Blob */
  const convertBase64ToBlob = (base64Str: string) => {
    const b = dataURLtoBlob(base64Str)
    blob.value = b
    return b
  }

  /** Blob => File */
  const convertBlobToFile = (b: Blob, name?: string) => {
    const f = blobToFile(b, name)
    file.value = f
    return f
  }

  /** 图片URL => Base64 */
  const convertUrlToBase64 = async (url: string) => {
    const base64Str = await imageUrlToBase64(url)
    base64.value = base64Str
    blob.value = dataURLtoBlob(base64Str)
    return base64Str
  }

  return {
    /** 响应式状态（浅层） */
    base64,
    file,
    blob,

    /** 工具方法 */
    convertFileToBase64,
    convertBase64ToBlob,
    convertBlobToFile,
    convertUrlToBase64,
  }
}

// 同时导出独立工具函数（非响应式）
export { blobToFile, dataURLtoBlob, fileToBase64, imageUrlToBase64 }
