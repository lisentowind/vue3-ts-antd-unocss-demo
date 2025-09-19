import { BrowserTaskQueue } from '../modules/browserTaskQueue'

// 模拟一个异步任务：随机成功或失败
function createTask(name: string) {
  return async () => {
    console.log(`[任务开始] ${name}`)
    await new Promise(resolve => setTimeout(resolve, 500)) // 模拟耗时
    if (Math.random() < 0.3) {
      // 30% 概率失败
      throw new Error(`${name} 执行失败`)
    }
    return `${name} 完成`
  }
}

const queue = new BrowserTaskQueue({ concurrency: 2, retryAttempts: 5 })

// 监听任务完成
queue.on('taskComplete', ({ task, result }) => {
  console.log(`[taskComplete] 任务完成: ${task.id}, 结果:`, result)
})

// 监听任务失败
queue.on('taskError', ({ task, error }) => {
  console.error(`[taskError] 任务失败: ${task.id}, 错误:`, error)
})

// 监听任务重试
queue.on('taskRetry', ({ task, attempt }) => {
  console.log(`[taskRetry] 任务重试: ${task.id}, 当前尝试次数: ${attempt}`)
})

// 队列清空（只触发一次）
queue.once('queueEmpty', () => {
  console.log('[queueEmpty] 队列已空')
})

// 添加任务示例
queue.add(createTask('任务1'), { priority: 'high', id: 'task-1' })

queue.add(createTask('任务2'), { priority: 'normal', id: 'task-2' })

queue.add(createTask('任务3'), { priority: 'low', id: 'task-3' })
