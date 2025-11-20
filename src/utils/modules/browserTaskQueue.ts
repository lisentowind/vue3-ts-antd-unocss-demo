/**
 * 任务优先级
 */
type TaskPriority = 'high' | 'normal' | 'low'

/**
 * 任务状态
 */
type TaskStatus
  = | 'pending'
    | 'active'
    | 'retrying'
    | 'completed'
    | 'failed'
    | 'canceled'

/**
 * 添加任务时的选项
 */
interface TaskOptions {
  priority?: TaskPriority
  id?: string
  metadata?: Record<string, any>
}

/**
 * 内部任务对象
 */
interface Task<T = any> {
  id: string
  fn: (signal: AbortSignal) => Promise<T>
  priority: TaskPriority
  status: TaskStatus
  attempts: number
  metadata: Record<string, any>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
  timestamp: number
  controller: AbortController
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
  concurrency?: number
  autoStart?: boolean
  retryAttempts?: number
  retryDelay?: number
}

/**
 * 事件类型
 */
type EventTypes
  = | 'taskAdded'
    | 'taskComplete'
    | 'taskError'
    | 'taskRetry'
    | 'taskCanceled'
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
  taskCanceled: { task: Task }
  queueEmpty: void
  queuePaused: void
  queueResumed: void
  queueCleared: void
}

type EventCallback<K extends EventTypes> = (data: EventPayloads[K]) => void

export class BrowserTaskQueue {
  private concurrency: number
  private autoStart: boolean
  private retryAttempts: number
  private retryDelay: number

  private queue: Task[] = []
  private activeTasks: Map<string, Task> = new Map()
  private paused: boolean
  private taskId = 0

  private eventListeners: {
    [K in EventTypes]: EventCallback<K>[]
  } = {
    taskAdded: [],
    taskComplete: [],
    taskError: [],
    taskRetry: [],
    taskCanceled: [],
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

  add<T>(
    taskFn: (signal: AbortSignal) => Promise<T>,
    options: TaskOptions = {},
  ): Promise<T> {
    const {
      priority = 'normal',
      id = `task_${++this.taskId}`,
      metadata = {},
    } = options

    return new Promise<T>((resolve, reject) => {
      const controller = new AbortController()

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
        controller,
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

  /** 移除队列中的任务（仅未开始执行的） */
  removeTask(taskId: string): boolean {
    const idx = this.queue.findIndex(t => t.id === taskId)
    if (idx >= 0) {
      const [task] = this.queue.splice(idx, 1)
      task.status = 'canceled'
      task.reject(new Error('Task removed from queue'))
      this._emit('taskCanceled', { task })
      return true
    }
    return false
  }

  /** 强制取消任务（队列中或正在执行的） */
  cancelTask(taskId: string): boolean {
    if (this.removeTask(taskId))
      return true

    const task = this.activeTasks.get(taskId)
    if (task) {
      task.controller.abort()
      task.status = 'canceled'
      task.reject(new Error('Task canceled during execution'))
      this.activeTasks.delete(taskId)
      this._emit('taskCanceled', { task })
      return true
    }
    return false
  }

  on<K extends EventTypes>(event: K, callback: EventCallback<K>) {
    this.eventListeners[event].push(callback)
  }

  off<K extends EventTypes>(event: K, callback: EventCallback<K>) {
    const listeners = this.eventListeners[event]
    const idx = listeners.indexOf(callback)
    if (idx >= 0)
      listeners.splice(idx, 1)
  }

  once<K extends EventTypes>(event: K, callback: EventCallback<K>) {
    const wrapper: EventCallback<K> = (data) => {
      callback(data)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  /**
   * 销毁队列实例，清理所有资源
   */
  destroy() {
    // 取消所有活动任务
    for (const task of this.activeTasks.values()) {
      task.controller.abort()
    }
    this.activeTasks.clear()

    // 清空队列
    this.queue = []

    // 清除所有事件监听器
    for (const key in this.eventListeners) {
      this.eventListeners[key as EventTypes] = []
    }
  }

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
        if (task.status !== 'active') {
          // 已被取消，不触发 complete
          this.activeTasks.delete(task.id)
          continue
        }
        task.status = 'completed'
        task.resolve(result)
        this.activeTasks.delete(task.id)
        this._emit('taskComplete', { task, result })
      }
      catch (error) {
        if (task.controller.signal.aborted) {
          task.status = 'canceled'
          task.reject(new Error('Task aborted'))
          this.activeTasks.delete(task.id)
          this._emit('taskCanceled', { task })
        }
        else if (task.attempts < this.retryAttempts) {
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
          this.activeTasks.delete(task.id)
        }
      }

      if (this.queue.length === 0 && this.activeTasks.size === 0) {
        this._emit('queueEmpty', undefined)
      }
    }
  }

  private async _executeTask<T>(task: Task<T>): Promise<T> {
    return await task.fn(task.controller.signal)
  }

  private _emit<K extends EventTypes>(event: K, data: EventPayloads[K]) {
    const listeners = [...this.eventListeners[event]]
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
