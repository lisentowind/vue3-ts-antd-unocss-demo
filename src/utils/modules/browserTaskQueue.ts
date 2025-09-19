/**
 * 任务优先级
 */
type TaskPriority = 'high' | 'normal' | 'low'

/**
 * 任务状态
 */
type TaskStatus = 'pending' | 'active' | 'retrying' | 'completed' | 'failed'

/**
 * 添加任务时的选项
 */
interface TaskOptions {
  /**
   * 任务优先级
   */
  priority?: TaskPriority
  /**
   * 任务ID
   */
  id?: string
  /**
   * 任务元数据
   */
  metadata?: Record<string, any>
}

/**
 * 内部任务对象
 */
interface Task<T = any> {
  id: string
  fn: () => Promise<T>
  priority: TaskPriority
  status: TaskStatus
  attempts: number
  metadata: Record<string, any>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  timestamp: number
}

/**
 * 队列状态
 */
interface QueueStatus {
  queued: number
  active: number
  paused: boolean
  concurrency: number
}

/**
 * 队列配置选项
 */
interface BrowserTaskQueueOptions {
  concurrency?: number // 并发上限
  autoStart?: boolean // 是否自动开始
  retryAttempts?: number // 最大重试次数
  retryDelay?: number // 重试延迟时间(ms)
}

/**
 * 事件类型
 */
type EventTypes
  = | 'taskAdded'
    | 'taskComplete'
    | 'taskError'
    | 'taskRetry'
    | 'queueEmpty'
    | 'queuePaused'
    | 'queueResumed'
    | 'queueCleared'

/**
 * 各事件对应的数据结构
 */
interface EventPayloads {
  taskAdded: Task
  taskComplete: { task: Task, result: any }
  taskError: { task: Task, error: any }
  taskRetry: { task: Task, error: any, attempt: number }
  queueEmpty: void
  queuePaused: void
  queueResumed: void
  queueCleared: void
}

/**
 * 通用事件回调类型
 */
type EventCallback<K extends EventTypes> = (data: EventPayloads[K]) => void

/**
 * 浏览器端任务队列
 * - 支持并发控制
 * - 支持任务优先级
 * - 支持失败重试
 * - 提供事件监听 on/off/once
 */
export class BrowserTaskQueue {
  private concurrency: number
  private autoStart: boolean
  private retryAttempts: number
  private retryDelay: number

  private queue: Task[] = [] // 等待执行的任务
  private activeTasks: Map<string, Task> = new Map() // 正在执行的任务
  private paused: boolean
  private taskId = 0 // ID 自增器

  // 事件监听器
  private eventListeners: {
    [K in EventTypes]: EventCallback<K>[]
  } = {
    taskAdded: [],
    taskComplete: [],
    taskError: [],
    taskRetry: [],
    queueEmpty: [],
    queuePaused: [],
    queueResumed: [],
    queueCleared: [],
  }

  constructor(options: BrowserTaskQueueOptions = {}) {
    const {
      concurrency = 1,
      autoStart = true,
      retryAttempts = 0,
      retryDelay = 1000,
    } = options

    this.concurrency = concurrency
    this.autoStart = autoStart
    this.retryAttempts = retryAttempts
    this.retryDelay = retryDelay

    this.paused = !autoStart
  }

  add<T>(taskFn: () => Promise<T>, options: TaskOptions = {}): Promise<T> {
    const {
      priority = 'normal',
      id = `task_${++this.taskId}`,
      metadata = {},
    } = options

    return new Promise<T>((resolve, reject) => {
      const task: Task<T> = {
        id,
        fn: taskFn,
        priority: ['high', 'normal', 'low'].includes(priority)
          ? priority
          : 'normal',
        status: 'pending',
        attempts: 0,
        metadata,
        resolve,
        reject,
        timestamp: Date.now(),
      }

      if (task.priority === 'high') {
        this.queue.unshift(task)
      }
      else {
        this.queue.push(task)
      }

      this._emit('taskAdded', task)

      if (!this.paused && this.activeTasks.size < this.concurrency) {
        this._processQueue()
      }
    })
  }

  pause() {
    this.paused = true
    this._emit('queuePaused', undefined)
  }

  resume() {
    if (this.paused) {
      this.paused = false
      this._emit('queueResumed', undefined)
      this._processQueue()
    }
  }

  clear() {
    this.queue = []
    this._emit('queueCleared', undefined)
  }

  getStatus(): QueueStatus {
    return {
      queued: this.queue.length,
      active: this.activeTasks.size,
      paused: this.paused,
      concurrency: this.concurrency,
    }
  }

  getTaskStatus(taskId: string): TaskStatus | 'not_found' {
    const queuedTask = this.queue.find(t => t.id === taskId)
    if (queuedTask)
      return queuedTask.status

    const activeTask = this.activeTasks.get(taskId)
    if (activeTask)
      return activeTask.status

    return 'not_found'
  }

  // ---------------- 新增安全事件 API ----------------

  /** 注册事件监听器 */
  on<K extends EventTypes>(event: K, callback: EventCallback<K>) {
    this.eventListeners[event].push(callback)
  }

  /** 移除事件监听器 */
  off<K extends EventTypes>(event: K, callback: EventCallback<K>) {
    const listeners = this.eventListeners[event]
    const idx = listeners.indexOf(callback)
    if (idx >= 0)
      listeners.splice(idx, 1)
  }

  /** 注册一次性事件监听 */
  once<K extends EventTypes>(event: K, callback: EventCallback<K>) {
    const wrapper: EventCallback<K> = (data) => {
      callback(data)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  // ---------------- 私有方法 ----------------

  private async _processQueue() {
    while (
      !this.paused
      && this.activeTasks.size < this.concurrency
      && this.queue.length > 0
    ) {
      const task = this.queue.shift()!
      this.activeTasks.set(task.id, task)
      task.status = 'active'

      try {
        const result = await this._executeTask(task)
        task.status = 'completed'
        task.resolve(result)
        this.activeTasks.delete(task.id)
        this._emit('taskComplete', { task, result })
      }
      catch (error) {
        if (task.attempts < this.retryAttempts) {
          task.attempts++
          task.status = 'retrying'
          this._emit('taskRetry', { task, error, attempt: task.attempts })

          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
          this.queue.unshift(task)
        }
        else {
          task.status = 'failed'
          task.reject(error)
          this._emit('taskError', { task, error })
        }
        this.activeTasks.delete(task.id)
      }

      if (this.queue.length === 0 && this.activeTasks.size === 0) {
        this._emit('queueEmpty', undefined)
      }
    }
  }

  private async _executeTask<T>(task: Task<T>): Promise<T> {
    return await task.fn()
  }

  private _emit<K extends EventTypes>(event: K, data: EventPayloads[K]) {
    const listeners = [...this.eventListeners[event]] // 拷贝一份，避免中途修改数组
    for (const callback of listeners) {
      try {
        callback(data)
      }
      catch (error) {
        console.error(`Error in ${event} listener:`, error)
      }
    }
  }
}
