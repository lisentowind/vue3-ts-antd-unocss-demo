import { onUnmounted, ref } from 'vue'

interface UpdateOptions {
  url?: string // 检测的目标 URL（建议指向 index.html 或 version.json）
  interval?: number // 轮询间隔 (ms)，默认 90s
  minInterval?: number // 最小间隔
  maxInterval?: number // 最大间隔
  jitter?: number // 随机抖动因子 (0-1)，默认 1/3，实际范围 60-120s
  onUpdate?: () => void // 发现更新时的回调
  onError?: (error: Error) => void // 错误回调
}

const CHANNEL_NAME = '__update_detector_channel__'
const HEARTBEAT_INTERVAL = 2000 // 心跳频率
const LOCK_TIMEOUT = 5000 // Leader 判定掉线超时时间

/**
 * 简单的字符串哈希，用于兜底内容校验
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return hash.toString(36)
}

export function useUpdateDetector(options: UpdateOptions = {}) {
  const {
    url = window.location.origin + window.location.pathname,
    interval: rawInterval = 90000,
    minInterval = 10000,
    maxInterval = 300000,
    jitter = 1 / 3,
    onUpdate,
    onError,
  } = options

  // 响应式状态
  const isRunning = ref(false)

  // 实例私有变量
  const tabId = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const pollingInterval = Math.max(minInterval, Math.min(maxInterval, rawInterval))

  let timerId: ReturnType<typeof setTimeout> | null = null
  let heartbeatTimer: ReturnType<typeof setTimeout> | null = null
  let channel: BroadcastChannel | null = null
  let isLeader = false
  let leaderHeartbeat = 0
  let lastHash: string | null = null

  /**
   * 随机化延迟，避免请求瞬间爆发
   */
  function getRandomDelay(baseDelay: number): number {
    const offset = baseDelay * jitter
    return baseDelay - offset + Math.random() * offset * 2
  }

  /**
   * 初始化通信频道
   */
  function initChannel() {
    if (typeof BroadcastChannel === 'undefined') {
      isLeader = true // 不支持频道则默认自己是 Leader
      return
    }

    channel = new BroadcastChannel(CHANNEL_NAME)
    channel.onmessage = (event) => {
      const { type, timestamp, hash, fromTabId } = event.data

      switch (type) {
        case 'heartbeat':
          leaderHeartbeat = timestamp
          // 如果发现已有其他 Leader 且不是自己，则退为 Follower
          if (isLeader && fromTabId !== tabId) {
            isLeader = false
          }
          break
        case 'result':
          // 接收来自 Leader 的检测结果
          if (hash && lastHash && hash !== lastHash) {
            lastHash = hash
            onUpdate?.()
          }
          else {
            lastHash = hash
          }
          break
        case 'leader_exit':
          // 现任 Leader 关闭标签页，立即尝试竞选
          leaderHeartbeat = 0
          tryBecomeLeader()
          break
      }
    }

    tryBecomeLeader()
  }

  /**
   * 竞选 Leader
   */
  function tryBecomeLeader() {
    if (Date.now() - leaderHeartbeat > LOCK_TIMEOUT) {
      isLeader = true
      sendHeartbeat()
    }
  }

  /**
   * 发送心跳保持 Leader 地位
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
   * 核心检测函数
   */
  async function check() {
    // 只有 Leader 且页面可见、有网时才执行请求
    if ((!isLeader && channel) || document.hidden || !navigator.onLine) {
      if (isRunning.value)
        scheduleNextCheck()
      return
    }

    try {
      // 增加时间戳防止 CDN/浏览器强缓存
      const checkUrl = `${url}${url.includes('?') ? '&' : '?'}_t=${Date.now()}`

      let currentMethod: 'HEAD' | 'GET' = 'HEAD'
      let response = await fetch(checkUrl, {
        method: 'HEAD',
        cache: 'no-cache',
      })

      // 如果 HEAD 不可用（405）或报错，回退到 GET
      if (!response.ok) {
        currentMethod = 'GET'
        response = await fetch(checkUrl, { method: 'GET', cache: 'no-cache' })
      }

      // 提取 ETag 或 Last-Modified 作为指纹，并去掉引号和弱校验前缀
      const rawEtag = response.headers.get('etag') || response.headers.get('last-modified')
      let hash = rawEtag ? rawEtag.replace(/^W\//, '').replace(/"/g, '') : null

      // 如果没有获取到 Header 且当前是 GET 请求，则计算内容 Hash
      if (!hash && currentMethod === 'GET') {
        const text = await response.text()
        hash = simpleHash(text)
      }

      if (!hash)
        return

      // 比较指纹
      if (lastHash !== null && hash !== lastHash) {
        lastHash = hash
        // 通知其他 Follower 标签页
        channel?.postMessage({ type: 'result', hash, fromTabId: tabId })
        onUpdate?.()
      }
      else {
        lastHash = hash
      }
    }
    catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
    finally {
      if (isRunning.value)
        scheduleNextCheck()
    }
  }

  function scheduleNextCheck() {
    if (timerId)
      clearTimeout(timerId)
    timerId = setTimeout(() => {
      if (!isLeader)
        tryBecomeLeader()
      check()
    }, getRandomDelay(pollingInterval))
  }

  // 事件监听：从后台切回前台时触发检测
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      setTimeout(check, getRandomDelay(2000))
    }
  }

  const handleOnline = () => check()

  const handleBeforeUnload = () => {
    if (isLeader && channel) {
      channel.postMessage({ type: 'leader_exit', fromTabId: tabId })
    }
  }

  function start() {
    if (isRunning.value)
      return
    isRunning.value = true

    initChannel()
    setTimeout(check, getRandomDelay(1000))

    window.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('online', handleOnline)
    window.addEventListener('beforeunload', handleBeforeUnload)
  }

  function stop() {
    isRunning.value = false
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

  // 默认启动检测
  start()

  return {
    isRunning,
    check, // 暴露手动触发接口
    stop,
    start,
  }
}
