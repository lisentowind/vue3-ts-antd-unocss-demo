/**
 * @description 描述 将任意颜色（hex、rgb、hsl 等）和透明度转换为 RGBA 字符串
 * @date 2025-09-24 14:41:06
 * @author tingfeng
 *
 * @export
 * @param color
 */
export function toRgba(color: string, alpha = 1): string {
  color = color.trim().toLowerCase()

  // HEX (#rgb、#rgba、#rrggbb、#rrggbbaa)
  if (color.startsWith('#')) {
    let r = 0
    let g = 0
    let b = 0

    if (color.length === 4) {
      r = Number.parseInt(color[1] + color[1], 16)
      g = Number.parseInt(color[2] + color[2], 16)
      b = Number.parseInt(color[3] + color[3], 16)
    }
    else if (color.length === 7) {
      r = Number.parseInt(color.slice(1, 3), 16)
      g = Number.parseInt(color.slice(3, 5), 16)
      b = Number.parseInt(color.slice(5, 7), 16)
    }
    else if (color.length === 9) {
      r = Number.parseInt(color.slice(1, 3), 16)
      g = Number.parseInt(color.slice(3, 5), 16)
      b = Number.parseInt(color.slice(5, 7), 16)
      alpha = (Number.parseInt(color.slice(7, 9), 16) / 255) * alpha
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // rgb() 或 rgba()
  if (color.startsWith('rgb')) {
    const nums = color.match(/[\d.]+/g)?.map(Number) || []
    const [r, g, b, a = 1] = nums
    return `rgba(${r}, ${g}, ${b}, ${a * alpha})`
  }

  // hsl() 或 hsla()
  if (color.startsWith('hsl')) {
    const nums = color.match(/[\d.]+/g)?.map(Number) || []
    let [h, s, l, a = 1] = nums
    h = h % 360
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0
    let g = 0
    let b = 0
    if (h < 60)
      [r, g, b] = [c, x, 0]
    else if (h < 120)
      [r, g, b] = [x, c, 0]
    else if (h < 180)
      [r, g, b] = [0, c, x]
    else if (h < 240)
      [r, g, b] = [0, x, c]
    else if (h < 300)
      [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `rgba(${r}, ${g}, ${b}, ${a * alpha})`
  }

  throw new Error(`不支持的颜色格式: ${color}`)
}

/**
 * @description 描述 将任意颜色（hex、rgb、hsl 等）和透明度转换为 RGB 字符串
 * @date 2025-09-24 14:44:06
 * @author tingfeng
 *
 * @export
 * @param color
 */
export function toRgb(color: string): string {
  color = color.trim().toLowerCase()

  // HEX (#rgb、#rgba、#rrggbb、#rrggbbaa)
  if (color.startsWith('#')) {
    let r = 0
    let g = 0
    let b = 0

    if (color.length === 4) {
      r = Number.parseInt(color[1] + color[1], 16)
      g = Number.parseInt(color[2] + color[2], 16)
      b = Number.parseInt(color[3] + color[3], 16)
    }
    else if (color.length === 7 || color.length === 9) {
      r = Number.parseInt(color.slice(1, 3), 16)
      g = Number.parseInt(color.slice(3, 5), 16)
      b = Number.parseInt(color.slice(5, 7), 16)
    }

    return `rgb(${r}, ${g}, ${b})`
  }

  // rgb() 或 rgba()
  if (color.startsWith('rgb')) {
    const nums = color.match(/[\d.]+/g)?.map(Number) || []
    const [r, g, b] = nums
    return `rgb(${r}, ${g}, ${b})`
  }

  // hsl() 或 hsla()
  if (color.startsWith('hsl')) {
    const nums = color.match(/[\d.]+/g)?.map(Number) || []
    let [h, s, l] = nums
    h = h % 360
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0
    let g = 0
    let b = 0
    if (h < 60)
      [r, g, b] = [c, x, 0]
    else if (h < 120)
      [r, g, b] = [x, c, 0]
    else if (h < 180)
      [r, g, b] = [0, c, x]
    else if (h < 240)
      [r, g, b] = [0, x, c]
    else if (h < 300)
      [r, g, b] = [x, 0, c]
    else [r, g, b] = [c, 0, x]

    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return `rgb(${r}, ${g}, ${b})`
  }

  throw new Error(`不支持的颜色格式: ${color}`)
}

/**
 * @description 描述 RGBA 转换 HEX
 * @date 2025-09-24 14:40:38
 * @author tingfeng
 *
 * @export
 * @param color
 */
export function rgbaToHex(color: string): string {
  color = color.trim().toLowerCase()

  // 如果是 # 开头
  if (color.startsWith('#')) {
    if (color.length === 4) {
      // #rgb 转 #rrggbb
      const r = color[1]
      const g = color[2]
      const b = color[3]
      return `#${r}${r}${g}${g}${b}${b}`
    }
    if (color.length === 7) {
      return color
    }
  }

  // 匹配 rgb/rgba
  const rgbaMatch = color.match(
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\)$/,
  )
  if (rgbaMatch) {
    const r = Math.round(Number(rgbaMatch[1]))
    const g = Math.round(Number(rgbaMatch[2]))
    const b = Math.round(Number(rgbaMatch[3]))

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
  }

  throw new Error(`不支持的颜色格式: ${color}`)
}

/**
 * 将颜色转换为 RGB 数值字符串 "R G B"
 * 支持 #RGB、#RRGGBB、rgb(...) 格式
 */
export function toRgbVar(color: string): string {
  color = color.trim().toLowerCase()

  // HEX
  if (color.startsWith('#')) {
    if (color.length === 4) {
      // #RGB -> RRGGBB
      const r = Number.parseInt(color[1] + color[1], 16)
      const g = Number.parseInt(color[2] + color[2], 16)
      const b = Number.parseInt(color[3] + color[3], 16)
      return `${r} ${g} ${b}`
    }
    else if (color.length === 7) {
      const r = Number.parseInt(color.slice(1, 3), 16)
      const g = Number.parseInt(color.slice(3, 5), 16)
      const b = Number.parseInt(color.slice(5, 7), 16)
      return `${r} ${g} ${b}`
    }
  }

  // rgb(35, 159, 66)
  const rgbMatch = color.match(/\d+\s*,\s*\d+\s*,\s*\d+/)
  if (rgbMatch) {
    return rgbMatch[0].replace(/,/g, ' ')
  }

  // 默认黑色
  return '0 0 0'
}

/**
 * @description 描述 颜色转换
 * @date 2025-09-24 15:03:11
 * @author tingfeng
 *
 * @export
 * @param varName
 * @param alpha
 */
export function rgbaWithVar(varName: string, alpha: number) {
  // 兼容 --color-primary 是 rgb(...) 的情况
  // CSS Color Level 4 语法：rgb(var(--color-primary) / 0.9) 无需解析
  return `rgb(var(${varName}) / ${alpha})`
}

// 透明度阶梯
export const primaryAlphas = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]

// 根据透明度数组生成 primary-1~n 阶梯色
export function generatePrimaryColors(varName: string, alphas = primaryAlphas) {
  const colors: Record<string, string> = {}
  alphas.forEach((alpha, index) => {
    colors[`primary-${index + 1}`] = rgbaWithVar(varName, alpha)
  })
  return colors
}
