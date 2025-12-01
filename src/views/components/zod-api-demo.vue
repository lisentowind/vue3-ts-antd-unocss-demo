<script lang="ts" setup>
import { ref } from 'vue'
import { z } from 'zod'
import { useMessage } from '@/hooks'

const { msgSuccess, msgError, msgWarning } = useMessage()

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
type Request = z.infer<typeof RequestSchema>

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
  registPhone: z.union([z.null(), z.string()]).optional(),
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
type Response = z.infer<typeof ResponseSchema>

// ========== 状态管理 ==========
const requestInput = ref('')
const requestValidationResult = ref('')
const apiUrl = ref('https://api.example.com/pigeonhole/page')
const responseInput = ref('')
const responseValidationResult = ref('')
const fullProcessLog = ref<string[]>([])
const isLoading = ref(false)

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

    requestValidationResult.value = `✅ 请求参数验证成功！\n\n验证后的数据:\n${JSON.stringify(validated, null, 2)}`
    msgSuccess({ content: '请求参数验证通过' })

    fullProcessLog.value.push(`📤 准备发送请求: ${apiUrl.value}`)
    fullProcessLog.value.push(`📦 请求体: ${JSON.stringify(validated, null, 2)}`)
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      const errorMsg = `❌ 请求参数验证失败:\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
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

    responseValidationResult.value = `✅ 响应数据验证成功！\n\n验证后的数据:\n${JSON.stringify(validated, null, 2)}`
    msgSuccess({ content: '响应数据验证通过' })

    fullProcessLog.value.push('🎉 完整流程执行成功')
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      const errorMsg = `❌ 响应数据验证失败:\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
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
    requestValidationResult.value = `✅ 请求参数验证成功！\n${JSON.stringify(validatedRequest, null, 2)}`
    fullProcessLog.value.push('✅ 请求参数验证通过')

    // 步骤 3: 模拟发送 HTTP 请求（延迟 1 秒）
    fullProcessLog.value.push(`📤 步骤 3: 发送 POST 请求到 ${apiUrl.value}`)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 步骤 4: 模拟接收响应
    fullProcessLog.value.push('📥 步骤 4: 收到 API 响应')
    const responseData = JSON.parse(responseInput.value)

    // 步骤 5: 验证响应数据
    fullProcessLog.value.push('🔍 步骤 5: 验证响应数据结构')
    const validatedResponse = ResponseSchema.parse(responseData)
    responseValidationResult.value = `✅ 响应数据验证成功！\n${JSON.stringify(validatedResponse, null, 2)}`
    fullProcessLog.value.push('✅ 响应数据验证通过')

    // 步骤 6: 完成
    fullProcessLog.value.push('🎉 步骤 6: 完整 API 请求流程执行成功！')
    msgSuccess({ content: '完整 API 流程执行成功' })
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      const errorMsg = `❌ 验证失败:\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
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
  requestInput.value = JSON.stringify({
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
  }, null, 2)
}

function setErrorRequestExample() {
  requestInput.value = JSON.stringify({
    cityCode: '440100',
    clueSourceId: 'not-a-number', // 错误：应该是 number
    clueState: 'active',
    endTime: 'invalid-date', // 错误：日期格式不正确
    name: '张三',
    pageNum: 1,
    pageSize: 10,
  }, null, 2)
}

function setCorrectResponseExample() {
  responseInput.value = JSON.stringify({
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
          registPhone: '13800138000',
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
          registPhone: '13900139000',
          year: '2024',
        },
      ],
    },
  }, null, 2)
}

function setErrorResponseExample() {
  responseInput.value = JSON.stringify({
    code: 'not-a-number', // 错误：应该是 number
    msg: 'success',
    data: {
      current: 1,
      pages: 5,
      size: 10,
      total: 50,
      records: 'not-an-array', // 错误：应该是数组
    },
  }, null, 2)
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
      <AFormItem label="API 地址">
        <AInput v-model:value="apiUrl" placeholder="请输入 API 地址" />
      </AFormItem>
    </ACard>

    <!-- 步骤 1: 请求参数验证 -->
    <ACard title="步骤 1: 请求参数验证" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton size="small" type="primary" @click="setCorrectRequestExample">
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
          <AButton size="small" type="primary" @click="setCorrectResponseExample">
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
              :color="log.includes('✅') ? 'green' : log.includes('❌') ? 'red' : log.includes('🎉') ? 'blue' : 'gray'"
            >
              {{ log }}
            </ATimelineItem>
          </ATimeline>
        </ACard>
      </ASpace>
    </ACard>

    <!-- 代码示例 -->
    <ACard title="💡 代码实现示例" :bordered="false">
      <pre class="bg-gray-100 p-4 rounded overflow-x-auto"><code>// 1. 定义 Schema
import { z } from 'zod'

const RequestSchema = z.object({
  cityCode: z.union([z.null(), z.string()]).optional(),
  pageNum: z.union([z.number(), z.null()]).optional(),
  // ... 其他字段
})

const ResponseSchema = z.object({
  code: z.union([z.number(), z.null()]).optional(),
  data: z.union([IPageSchema, z.null()]).optional(),
  msg: z.union([z.null(), z.string()]).optional(),
})

// 2. 发送请求前验证参数
async function fetchData(params: unknown) {
  // 验证请求参数
  const validatedParams = RequestSchema.parse(params)

  // 发送请求
  const response = await fetch('/api/pigeonhole/page', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validatedParams)
  })

  const data = await response.json()

  // 验证响应数据
  const validatedData = ResponseSchema.parse(data)

  return validatedData
}

// 3. 使用
try {
  const result = await fetchData({
    pageNum: 1,
    pageSize: 10,
    cityCode: '440100'
  })
  console.log('验证通过的数据:', result)
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('验证失败:', error.issues)
  }
}</code></pre>
    </ACard>
  </ASpace>
</template>

<style scoped lang="less">
pre {
  font-size: 12px;
  line-height: 1.5;
}
</style>
