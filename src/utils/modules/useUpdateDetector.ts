import { onUnmounted, ref } from 'vue'

/**
 * 更新检测配置项的类型
 */
interface UpdateOptions {
  url?: string // 检测的目标 URL（建议指向 index.html 或 version.json）
  interval?: number // 轮询基础间隔 (ms)，默认 90s
  minInterval?: number // 最小轮询间隔
  maxInterval?: number // 最大轮询间隔
  jitter?: number // 随机抖动因子 (0-1)，用于分散请求压力，默认 1/3
  onUpdate?: () => void // 发现新版本时的回调（如：提示用户刷新）
  onError?: (error: Error) => void // 请求出错时的回调
}

// 常量配置
const CHANNEL_NAME = '__update_detector_channel__' // BroadcastChannel 频道名
const HEARTBEAT_INTERVAL = 2000 // Leader 发送心跳的频率 (ms)
const LOCK_TIMEOUT = 5000 // 判定 Leader 掉线的超时时间 (ms)

/**
 * 简单的字符串哈希算法
 * 当无法通过 Header 获取版本时，通过计算文件内容摘要来比对是否更新
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export function useUpdateDetector(options: UpdateOptions = {}) {
  // 响应式状态：标识当前检测是否正在运行
  const isRunning = ref(false)

  // 1. 开发环境跳过
  if (import.meta.env.DEV) {
    console.log('[useUpdateDetector] 开发环境已跳过自动检测')
    return {
      isRunning,
      check: async () => null,
      stop: () => null,
      start: () => null,
    }
  }

  // 解构配置项
  const {
    url = window.location.origin + window.location.pathname,
    interval: rawInterval = 90000,
    minInterval = 10000,
    maxInterval = 300000,
    jitter = 1 / 3,
    onUpdate,
    onError,
  } = options

  // --- 内部状态 ---
  const tabId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const pollingInterval = Math.max(minInterval, Math.min(maxInterval, rawInterval))

  let timerId: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setTimeout> | null = null
  let abortController: AbortController | null = null
  let channel: BroadcastChannel | null = null
  let isLeader = false
  let leaderHeartbeat = 0
  let lastHash: string | null = null

  // 【新增】静默期相关变量
  let lastCheckTime = 0 // 上一次执行 check 的时间戳

  /**
   * 生成随机延迟时间
   */
  function getRandomDelay(baseDelay: number): number {
    const offset = baseDelay * jitter
    return baseDelay - offset + Math.random() * offset * 2
  }

  /**
   * 初始化多标签页通信
   */
  function initChannel() {
    if (typeof BroadcastChannel === 'undefined') {
      isLeader = true // 不支持此 API 的浏览器（如极旧版本）默认每个页签都自己检测
      return
    }

    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event) => {
      const { type, timestamp, hash, fromTabId } = event.data
      switch (type) {
        case 'heartbeat':
          // 接收其他标签页的 Leader 心跳
          leaderHeartbeat = timestamp
          // 如果发现已有其他 Leader 且 ID 不同，自己降级为 Follower
          if (isLeader && fromTabId !== tabId)
            isLeader = false
          break
        case 'result':
          // 接收来自 Leader 的检测结果
          if (hash && lastHash && hash !== lastHash) {
            lastHash = hash
            onUpdate?.() // 触发更新回调
          }
          else {
            lastHash = hash
          }
          break
        case 'leader_exit':
          // 现任 Leader 关闭了页面，立即尝试竞选
          leaderHeartbeat = 0
          tryBecomeLeader()
          break
      }
    }
    tryBecomeLeader()
  }

  /**
   * 竞选 Leader：如果没有收到心跳或心跳超时，则尝试接管检测任务
   */
  function tryBecomeLeader() {
    if (Date.now() - leaderHeartbeat > LOCK_TIMEOUT) {
      isLeader = true
      sendHeartbeat()
    }
  }

  /**
   * 持续发送心跳，告诉其他标签页“我还在工作”
   */
  function sendHeartbeat() {
    if (!channel || !isLeader || !isRunning.value)
      return
    channel.postMessage({
      type: 'heartbeat',
      timestamp: Date.now(),
      fromTabId: tabId,
    })
    heartbeatTimer = setTimeout(sendHeartbeat, HEARTBEAT_INTERVAL)
  }

  /**
   * 核心检测逻辑
   */
  async function check() {
    // 记录本次检测触发的时间
    lastCheckTime = Date.now()

    if ((!isLeader && channel) || document.hidden || !navigator.onLine) {
      if (isRunning.value)
        scheduleNextCheck()
      return
    }

    // 每次请求前，先取消上一次可能还在挂起的请求，防止竞态冲突
    if (typeof AbortController !== 'undefined') {
      abortController?.abort()
      abortController = new AbortController()
    }

    try {
      // 增加时间戳参数防止 CDN 或浏览器强缓存
      const checkUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`

      // 优先尝试 HEAD 请求（只获取响应头，不下载内容，极省流量）
      let currentMethod: 'HEAD' | 'GET' = 'HEAD'
      let response = await fetch(checkUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: abortController?.signal,
      })

      // 如果 HEAD 请求被服务器禁用（405），则降级使用 GET
      if (!response.ok) {
        currentMethod = 'GET'
        response = await fetch(checkUrl, {
          method: 'GET',
          cache: 'no-cache',
          signal: abortController?.signal,
        })
      }

      // 如果 GET 请求依然不成功（比如还是 404），直接退出
      if (!response.ok) {
        console.warn(`[useUpdateDetector] 检测请求失败，状态码: ${response.status}`)
        return
      }

      // 获取版本指纹：优先读取 ETag，其次是 Last-Modified
      const rawEtag = response.headers.get('etag') || response.headers.get('last-modified')
      let hash = rawEtag ? rawEtag.replace(/^W\//, '').replace(/"/g, '') : null

      // 如果 header 里啥都没有，且当前是 GET，则下载内容并计算 hash（兜底方案）
      if (!hash && currentMethod === 'GET') {
        const text = await response.text()
        hash = simpleHash(text)
      }

      if (!hash)
        return

      // 指纹对比
      if (lastHash !== null && hash !== lastHash) {
        lastHash = hash
        // 通知其他所有标签页：有更新了！
        channel?.postMessage({ type: 'result', hash, fromTabId: tabId })
        onUpdate?.()
      }
      else {
        lastHash = hash
      }
    }
    catch (error: any) {
      // 如果报错是因为我们手动调用了 abort()，则忽略它
      if (error.name === 'AbortError')
        return
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
    finally {
      // 无论成功失败，只要还在运行，就安排下一次检测
      if (isRunning.value)
        scheduleNextCheck()
    }
  }

  /**
   * 安排下一次轮询任务
   */
  function scheduleNextCheck() {
    if (timerId)
      clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!isLeader)
        tryBecomeLeader()
      check()
    }, getRandomDelay(pollingInterval))
  }

  // --- 事件监听逻辑 ---

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      const now = Date.now()

      /**
       * 【优化】静默期逻辑
       * 1. 生成 10s - 40s 之间的随机静默阈值
       * 2. 如果当前距离上一次检测的时间小于这个阈值，则不触发 check
       */
      const silenceThreshold = 10000 + Math.random() * 10000
      const msSinceLastCheck = now - lastCheckTime

      if (msSinceLastCheck < silenceThreshold) {
        console.log(
          `[useUpdateDetector] 处于静默期 (${Math.round(msSinceLastCheck / 1000)}s < ${Math.round(
            silenceThreshold / 1000,
          )}s)，跳过立即检测`,
        )
        return
      }

      // 通过静默期后，再延迟 2-5s 触发，避开页面渲染高峰
      setTimeout(check, getRandomDelay(3500))
    }
  }

  const handleOnline = () => check()

  const handleBeforeUnload = () => {
    // 页面关闭前，如果是 Leader，通知其他页签立即竞选
    if (isLeader && channel) {
      channel.postMessage({ type: 'leader_exit', fromTabId: tabId })
    }
  }

  /**
   * 启动检测器
   */
  function start() {
    if (isRunning.value)
      return
    isRunning.value = true
    initChannel()
    // 首次启动也给一个随机延迟
    setTimeout(check, getRandomDelay(2000))

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  /**
   * 停止检测器
   */
  function stop() {
    isRunning.value = false
    if (abortController) {
      abortController.abort()
      abortController = null
    }
    if (timerId)
      clearTimeout(timerId)
    if (heartbeatTimer)
      clearTimeout(heartbeatTimer)
    window.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('beforeunload', handleBeforeUnload)
    if (channel) {
      channel.close()
      channel = null
    }
  }

  onUnmounted(() => stop())
  start()

  return {
    isRunning,
    check, // 允许手动触发检测
    stop, // 允许手动停止
    start, // 允许手动重新启动
  }
}
