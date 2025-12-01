<script lang="ts" setup>
import { ref } from 'vue'
import { z } from 'zod'
import { useMessage } from '@/hooks'

const { msgSuccess, msgError } = useMessage()

// ========== 定义请求参数 Schema ==========
const RequestSchema = z.object({
  cityCode: z.union([z.null(), z.string()]).optional(),
  clueSourceId: z.union([z.number(), z.null()]).optional(),
  clueState: z.union([z.null(), z.string()]).optional(),
  endTime: z.union([z.coerce.date(), z.null()]).optional(),
  name: z.union([z.null(), z.string()]).optional(),
  pageNum: z.union([z.number(), z.null()]).optional(),
  pageSize: z.union([z.number(), z.null()]).optional(),
  qrCodeId: z.union([z.null(), z.string()]).optional(),
  startTime: z.union([z.coerce.date(), z.null()]).optional(),
  year: z.union([z.null(), z.string()]).optional(),
})

// ========== 定义响应数据 Schema ==========
const PigeonholePageVoSchema = z.object({
  cityCode: z.union([z.null(), z.string()]).optional(),
  cityName: z.union([z.null(), z.string()]).optional(),
  clueId: z.union([z.number(), z.null()]).optional(),
  clueSourceId: z.union([z.number(), z.null()]).optional(),
  clueSourceName: z.union([z.null(), z.string()]).optional(),
  clueState: z.union([z.null(), z.string()]).optional(),
  clueStateName: z.union([z.null(), z.string()]).optional(),
  highschoolId: z.union([z.number(), z.null()]).optional(),
  highschoolName: z.union([z.null(), z.string()]).optional(),
  idCard: z.union([z.null(), z.string()]).optional(),
  ksh: z.union([z.null(), z.string()]).optional(),
  name: z.union([z.null(), z.string()]).optional(),
  pigTime: z.union([z.coerce.date(), z.null()]).optional(),
  pigUserId: z.union([z.number(), z.null()]).optional(),
  pigUserName: z.union([z.null(), z.string()]).optional(),
  regisPhone: z.union([z.null(), z.string()]).optional(),
  year: z.union([z.null(), z.string()]).optional(),
})

const IPagePigeonholePageVoSchema = z.object({
  current: z.union([z.number(), z.null()]).optional(),
  pages: z.union([z.number(), z.null()]).optional(),
  records: z.union([z.array(PigeonholePageVoSchema), z.null()]).optional(),
  size: z.union([z.number(), z.null()]).optional(),
  total: z.union([z.number(), z.null()]).optional(),
})

const ResponseSchema = z.object({
  code: z.union([z.number(), z.null()]).optional(),
  data: z.union([IPagePigeonholePageVoSchema, z.null()]).optional(),
  msg: z.union([z.null(), z.string()]).optional(),
})

// ========== 模拟 API 接口 ==========
// 模拟后端 API，根据请求参数返回模拟数据
function mockApiRequest(params: z.infer<typeof RequestSchema>) {
  // 模拟数据生成
  const mockRecords = Array.from(
    { length: params.pageSize || 10 },
    (_, index) => ({
      clueId: 1001 + index,
      name: `${params.name || '用户'}${index + 1}`,
      cityCode: params.cityCode || '440100',
      cityName: params.cityCode === '440100' ? '广州市' : '深圳市',
      clueSourceId: params.clueSourceId || 1,
      clueSourceName: '线上推广',
      clueState: params.clueState || 'active',
      clueStateName: params.clueState === 'active' ? '活跃' : '待跟进',
      regisPhone: `138${String(index).padStart(8, '0')}`,
      idCard: `440101199001${String(index + 1).padStart(6, '0')}`,
      year: params.year || '2024',
      pigTime: new Date(), // 使用 Date 对象而不是 ISO 字符串
      pigUserId: 2001 + index,
      pigUserName: `归档人${index + 1}`,
      highschoolId: 3001 + index,
      highschoolName: `第${index + 1}高中`,
      ksh: `KSH${String(index).padStart(6, '0')}`,
    }),
  )

  return {
    code: 200,
    msg: 'success',
    data: {
      current: params.pageNum || 1,
      pages: 5,
      size: params.pageSize || 10,
      total: 50,
      records: mockRecords,
    },
  }
}

// ========== 状态管理 ==========
const requestInput = ref('')
const requestValidationResult = ref('')
const apiUrl = ref('/api/pigeonhole/page')
const responseInput = ref('')
const responseValidationResult = ref('')
const fullProcessLog = ref<string[]>([])
const isLoading = ref(false)
const useMockApi = ref(true) // 是否使用模拟 API

// ========== 1. 验证请求参数 ==========
function validateRequest() {
  fullProcessLog.value = []
  requestValidationResult.value = ''

  try {
    const data = JSON.parse(requestInput.value)
    fullProcessLog.value.push('📝 步骤 1: 解析请求参数 JSON')

    // 使用 Zod 验证请求参数
    const validated = RequestSchema.parse(data)
    fullProcessLog.value.push('✅ 步骤 2: 请求参数验证通过')

    requestValidationResult.value = `✅ 请求参数验证成功！\n\n验证后的数据:\n${JSON.stringify(
      validated,
      null,
      2,
    )}`
    msgSuccess({ content: '请求参数验证通过' })

    fullProcessLog.value.push(`📤 准备发送请求: ${apiUrl.value}`)
    fullProcessLog.value.push(
      `📦 请求体: ${JSON.stringify(validated, null, 2)}`,
    )
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      const errorMsg = `❌ 请求参数验证失败:\n${err.issues
        .map(e => `- ${e.path.join('.')}: ${e.message}`)
        .join('\n')}`
      requestValidationResult.value = errorMsg
      fullProcessLog.value.push('❌ 步骤 2: 请求参数验证失败')
      fullProcessLog.value.push(errorMsg)
      msgError({ content: '请求参数验证失败' })
    }
    else {
      requestValidationResult.value = '❌ JSON 解析失败'
      fullProcessLog.value.push('❌ 步骤 1: JSON 解析失败')
      msgError({ content: 'JSON 格式错误' })
    }
  }
}

// ========== 2. 验证响应数据 ==========
function validateResponse() {
  responseValidationResult.value = ''

  try {
    const data = JSON.parse(responseInput.value)
    fullProcessLog.value.push('📥 步骤 3: 收到 API 响应')

    // 使用 Zod 验证响应数据
    const validated = ResponseSchema.parse(data)
    fullProcessLog.value.push('✅ 步骤 4: 响应数据验证通过')

    responseValidationResult.value = `✅ 响应数据验证成功！\n\n验证后的数据:\n${JSON.stringify(
      validated,
      null,
      2,
    )}`
    msgSuccess({ content: '响应数据验证通过' })

    fullProcessLog.value.push('🎉 完整流程执行成功')
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      const errorMsg = `❌ 响应数据验证失败:\n${err.issues
        .map(e => `- ${e.path.join('.')}: ${e.message}`)
        .join('\n')}`
      responseValidationResult.value = errorMsg
      fullProcessLog.value.push('❌ 步骤 4: 响应数据验证失败')
      fullProcessLog.value.push(errorMsg)
      msgError({ content: '响应数据验证失败' })
    }
    else {
      responseValidationResult.value = '❌ JSON 解析失败'
      fullProcessLog.value.push('❌ 步骤 3: 响应 JSON 解析失败')
      msgError({ content: 'JSON 格式错误' })
    }
  }
}

// ========== 3. 模拟完整 API 请求流程 ==========
async function simulateFullApiRequest() {
  fullProcessLog.value = []
  requestValidationResult.value = ''
  responseValidationResult.value = ''
  isLoading.value = true

  try {
    // 步骤 1: 解析请求参数
    fullProcessLog.value.push('📝 步骤 1: 解析请求参数 JSON')
    const requestData = JSON.parse(requestInput.value)

    // 步骤 2: 验证请求参数
    fullProcessLog.value.push('🔍 步骤 2: 验证请求参数')
    const validatedRequest = RequestSchema.parse(requestData)
    requestValidationResult.value = `✅ 请求参数验证成功！\n${JSON.stringify(
      validatedRequest,
      null,
      2,
    )}`
    fullProcessLog.value.push('✅ 请求参数验证通过')

    // 步骤 3: 发送 HTTP 请求
    fullProcessLog.value.push(`📤 步骤 3: 发送 POST 请求到 ${apiUrl.value}`)
    fullProcessLog.value.push(`📦 请求体: ${JSON.stringify(validatedRequest)}`)

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    let responseData: unknown

    if (useMockApi.value) {
      // 使用模拟 API
      fullProcessLog.value.push('🤖 使用模拟 API 生成响应数据')
      responseData = mockApiRequest(validatedRequest)
    }
    else {
      // 使用用户输入的响应数据
      fullProcessLog.value.push('📥 步骤 4: 收到 API 响应')
      responseData = JSON.parse(responseInput.value)
    }

    // 自动填充响应数据到文本框
    responseInput.value = JSON.stringify(responseData, null, 2)

    // 步骤 5: 验证响应数据
    fullProcessLog.value.push('🔍 步骤 5: 验证响应数据结构')
    const validatedResponse = ResponseSchema.parse(responseData)
    responseValidationResult.value = `✅ 响应数据验证成功！\n${JSON.stringify(
      validatedResponse,
      null,
      2,
    )}`
    fullProcessLog.value.push('✅ 响应数据验证通过')

    // 步骤 6: 完成
    fullProcessLog.value.push('🎉 步骤 6: 完整 API 请求流程执行成功！')
    msgSuccess({ content: '完整 API 流程执行成功' })
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      const errorMsg = `❌ 验证失败:\n${err.issues
        .map(e => `- ${e.path.join('.')}: ${e.message}`)
        .join('\n')}`
      fullProcessLog.value.push(errorMsg)
      msgError({ content: '数据验证失败' })
    }
    else if (err instanceof SyntaxError) {
      fullProcessLog.value.push('❌ JSON 解析失败: 请检查输入格式')
      msgError({ content: 'JSON 格式错误' })
    }
    else {
      fullProcessLog.value.push(`❌ 未知错误: ${String(err)}`)
      msgError({ content: '执行失败' })
    }
  }
  finally {
    isLoading.value = false
  }
}

// ========== 填充示例数据 ==========
function setCorrectRequestExample() {
  requestInput.value = JSON.stringify(
    {
      cityCode: '440100',
      clueSourceId: 1001,
      clueState: 'active',
      endTime: '2024-12-31T23:59:59Z',
      name: '张三',
      pageNum: 1,
      pageSize: 10,
      qrCodeId: 'QR123456',
      startTime: '2024-01-01T00:00:00Z',
      year: '2024',
    },
    null,
    2,
  )
}

function setErrorRequestExample() {
  requestInput.value = JSON.stringify(
    {
      cityCode: '440100',
      clueSourceId: 'not-a-number', // 错误：应该是 number
      clueState: 'active',
      endTime: 'invalid-date', // 错误：日期格式不正确
      name: '张三',
      pageNum: 1,
      pageSize: 10,
    },
    null,
    2,
  )
}

function setCorrectResponseExample() {
  responseInput.value = JSON.stringify(
    {
      code: 200,
      msg: 'success',
      data: {
        current: 1,
        pages: 5,
        size: 10,
        total: 50,
        records: [
          {
            clueId: 1001,
            name: '张三',
            cityCode: '440100',
            cityName: '广州市',
            clueSourceId: 1,
            clueSourceName: '线上推广',
            clueState: 'active',
            clueStateName: '活跃',
            regisPhone: '13800138000',
            idCard: '440101199001011234',
            year: '2024',
            pigTime: new Date().toISOString(),
            pigUserId: 2001,
            pigUserName: '李四',
          },
          {
            clueId: 1002,
            name: '王五',
            cityCode: '440300',
            cityName: '深圳市',
            clueSourceId: 2,
            clueSourceName: '电话营销',
            clueState: 'pending',
            clueStateName: '待跟进',
            regisPhone: '13900139000',
            year: '2024',
          },
        ],
      },
    },
    null,
    2,
  )
}

function setErrorResponseExample() {
  responseInput.value = JSON.stringify(
    {
      code: 'not-a-number', // 错误：应该是 number
      msg: 'success',
      data: {
        current: 1,
        pages: 5,
        size: 10,
        total: 50,
        records: 'not-an-array', // 错误：应该是数组
      },
    },
    null,
    2,
  )
}

function clearAll() {
  requestInput.value = ''
  requestValidationResult.value = ''
  responseInput.value = ''
  responseValidationResult.value = ''
  fullProcessLog.value = []
}
</script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.3, duration: 0.3, y: 35, x: 0 },
    }"
    direction="vertical"
    :size="20"
    class="w-100%"
  >
    <AAlert
      message="Zod API 请求响应校验完整流程"
      description="本示例演示如何使用 Zod 在发送 API 请求前验证参数，在接收响应后验证数据结构，确保数据的类型安全。"
      type="info"
      show-icon
    />

    <!-- API URL 配置 -->
    <ACard title="API 配置" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <AFormItem label="API 地址">
          <AInput v-model:value="apiUrl" placeholder="请输入 API 地址" />
        </AFormItem>
        <AFormItem label="请求模式">
          <ASpace>
            <ASwitch v-model:checked="useMockApi" />
            <span>{{
              useMockApi
                ? '🤖 使用模拟 API（自动生成响应数据）'
                : '📝 使用手动输入的响应数据'
            }}</span>
          </ASpace>
          <div class="text-sm text-gray-500 mt-2">
            {{
              useMockApi
                ? '开启后，执行完整流程时会根据请求参数自动生成模拟响应数据'
                : '关闭后，执行完整流程时会使用下方手动输入的响应数据'
            }}
          </div>
        </AFormItem>
      </ASpace>
    </ACard>

    <!-- 步骤 1: 请求参数验证 -->
    <ACard title="步骤 1: 请求参数验证" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton
            size="small"
            type="primary"
            @click="setCorrectRequestExample"
          >
            填充正确请求参数
          </AButton>
          <AButton size="small" danger @click="setErrorRequestExample">
            填充错误请求参数
          </AButton>
        </ASpace>

        <ATextarea
          v-model:value="requestInput"
          placeholder="请输入请求参数 JSON"
          :rows="12"
        />

        <AButton type="primary" @click="validateRequest">
          验证请求参数
        </AButton>

        <ATextarea
          v-if="requestValidationResult"
          v-model:value="requestValidationResult"
          :rows="8"
          readonly
        />
      </ASpace>
    </ACard>

    <!-- 步骤 2: 响应数据验证 -->
    <ACard title="步骤 2: 响应数据验证" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton
            size="small"
            type="primary"
            @click="setCorrectResponseExample"
          >
            填充正确响应数据
          </AButton>
          <AButton size="small" danger @click="setErrorResponseExample">
            填充错误响应数据
          </AButton>
        </ASpace>

        <ATextarea
          v-model:value="responseInput"
          placeholder="请输入 API 响应 JSON"
          :rows="16"
        />

        <AButton type="primary" @click="validateResponse">
          验证响应数据
        </AButton>

        <ATextarea
          v-if="responseValidationResult"
          v-model:value="responseValidationResult"
          :rows="10"
          readonly
        />
      </ASpace>
    </ACard>

    <!-- 完整流程模拟 -->
    <ACard title="完整 API 请求流程模拟" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <AAlert
          message="提示"
          description="此操作将模拟完整的 API 请求流程：验证请求参数 → 发送请求 → 接收响应 → 验证响应数据"
          type="warning"
          show-icon
        />

        <ASpace>
          <AButton
            type="primary"
            size="large"
            :loading="isLoading"
            @click="simulateFullApiRequest"
          >
            {{ isLoading ? '执行中...' : '🚀 执行完整流程' }}
          </AButton>
          <AButton @click="clearAll">
            清空所有
          </AButton>
        </ASpace>

        <!-- 流程日志 -->
        <ACard
          v-if="fullProcessLog.length > 0"
          title="执行日志"
          :bordered="false"
          class="bg-gray-50"
        >
          <ATimeline>
            <ATimelineItem
              v-for="(log, index) in fullProcessLog"
              :key="index"
              :color="
                log.includes('✅')
                  ? 'green'
                  : log.includes('❌')
                    ? 'red'
                    : log.includes('🎉')
                      ? 'blue'
                      : 'gray'
              "
            >
              {{ log }}
            </ATimelineItem>
          </ATimeline>
        </ACard>
      </ASpace>
    </ACard>

    <!-- 代码示例 -->
    <ACard title="💡 代码实现示例" :bordered="false">
      <ATabs>
        <ATabPane key="1" tab="使用 Axios">
          <pre
            class="p-4 rounded bg-gray-100 overflow-x-auto"
          ><code>// 1. 定义 Schema
import { z } from 'zod'
import axios from 'axios'

const RequestSchema = z.object({
  cityCode: z.union([z.null(), z.string()]).optional(),
  pageNum: z.union([z.number(), z.null()]).optional(),
  pageSize: z.union([z.number(), z.null()]).optional(),
  // ... 其他字段
})

const ResponseSchema = z.object({
  code: z.union([z.number(), z.null()]).optional(),
  data: z.union([IPageSchema, z.null()]).optional(),
  msg: z.union([z.null(), z.string()]).optional(),
})

// 2. 创建带 Zod 校验的 API 请求函数
async function fetchPigeonholePage(params: unknown) {
  // 步骤 1: 验证请求参数
  const validatedParams = RequestSchema.parse(params)

  // 步骤 2: 发送 HTTP 请求
  const { data } = await axios.post('/api/pigeonhole/page', validatedParams)

  // 步骤 3: 验证响应数据
  const validatedData = ResponseSchema.parse(data)

  return validatedData
}

// 3. 使用示例
async function loadData() {
  try {
    const result = await fetchPigeonholePage({
      pageNum: 1,
      pageSize: 10,
      cityCode: '440100',
      name: '张三'
    })

    console.log('✅ 数据验证通过:', result)
    // 此时 result 的类型已经被 TypeScript 推断为正确的类型
    console.log('总记录数:', result.data?.total)

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ 数据验证失败:', error.issues)
    } else {
      console.error('❌ 请求失败:', error)
    }
  }
}</code></pre>
        </ATabPane>

        <ATabPane key="2" tab="使用 Fetch API">
          <pre
            class="p-4 rounded bg-gray-100 overflow-x-auto"
          ><code>// 使用 Fetch API 的实现
async function fetchPigeonholePage(params: unknown) {
  // 验证请求参数
  const validatedParams = RequestSchema.parse(params)

  // 发送请求
  const response = await fetch('/api/pigeonhole/page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedParams)
  })

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`)
  }

  const data = await response.json()

  // 验证响应数据
  const validatedData = ResponseSchema.parse(data)

  return validatedData
}

// 使用
const result = await fetchPigeonholePage({
  pageNum: 1,
  pageSize: 10
})</code></pre>
        </ATabPane>

        <ATabPane key="3" tab="Axios 拦截器">
          <pre
            class="p-4 rounded bg-gray-100 overflow-x-auto"
          ><code>// 在 Axios 拦截器中使用 Zod 进行全局校验
import axios from 'axios'
import { z } from 'zod'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: '/api'
})

// 请求拦截器 - 验证请求参数
apiClient.interceptors.request.use(
  (config) => {
    // 如果配置了 schema，则验证请求数据
    if (config.schema && config.data) {
      try {
        config.data = config.schema.parse(config.data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('请求参数验证失败:', error.issues)
          return Promise.reject(error)
        }
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器 - 验证响应数据
apiClient.interceptors.response.use(
  (response) => {
    // 如果配置了 responseSchema，则验证响应数据
    if (response.config.responseSchema) {
      try {
        response.data = response.config.responseSchema.parse(response.data)
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('响应数据验证失败:', error.issues)
          return Promise.reject(error)
        }
      }
    }
    return response
  },
  error => Promise.reject(error)
)

// 使用带校验的请求
const { data } = await apiClient.post('/pigeonhole/page', {
  pageNum: 1,
  pageSize: 10
}, {
  schema: RequestSchema,           // 请求参数校验
  responseSchema: ResponseSchema    // 响应数据校验
})</code></pre>
        </ATabPane>
      </ATabs>
    </ACard>
  </ASpace>
</template>

<style scoped lang="less">
pre {
  font-size: 12px;
  line-height: 1.5;
}
</style>
