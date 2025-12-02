<script lang="ts" setup>
import dayjs from 'dayjs'
import { ref } from 'vue'
import { z } from 'zod'
import { useMessage } from '@/hooks'

const { msgSuccess, msgError, msgWarning } = useMessage()

// ========== 示例 1: 基础数据类型验证 ==========
const basicSchema = z.object({
  name: z.string(),
  age: z.number().positive(),
  isActive: z.boolean(),
})

const basicInput = ref('')
const basicResult = ref('')

function validateBasicData() {
  try {
    const data = JSON.parse(basicInput.value)
    const validated = basicSchema.parse(data)
    basicResult.value = `✅ 验证成功！\n${JSON.stringify(validated, null, 2)}`
    msgSuccess({ content: '基础数据验证通过' })
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      basicResult.value = `❌ 验证失败：\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
      msgError({ content: '验证失败' })
    }
    else {
      basicResult.value = `❌ JSON 解析失败`
      msgError({ content: 'JSON 格式错误' })
    }
  }
}

// ========== 示例 2: API 响应数据验证 ==========
const userApiSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    id: z.number(),
    username: z.string(),
    email: z.email(),
    avatar: z.url().optional(),
    roles: z.array(z.string()),
    createdAt: z.string().transform(val => dayjs(val).format('YYYY年MM月DD日 HH:mm:ss')),
  }),
})

const apiInput = ref('')
const apiResult = ref('')

function validateApiResponse() {
  try {
    const data = JSON.parse(apiInput.value)
    const validated = userApiSchema.parse(data)
    apiResult.value = `✅ API 响应验证成功！\n${JSON.stringify(validated, null, 2)}`
    msgSuccess({ content: 'API 数据验证通过' })
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      apiResult.value = `❌ API 响应验证失败：\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
      msgError({ content: 'API 数据验证失败' })
    }
    else {
      apiResult.value = `❌ JSON 解析失败`
      msgError({ content: 'JSON 格式错误' })
    }
  }
}

// ========== 示例 3: 配置对象验证 ==========
const configSchema = z.object({
  app: z.object({
    name: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    port: z.number().int().min(1).max(65535),
    debug: z.boolean().default(false),
  }),
  database: z.object({
    host: z.string(),
    port: z.number().int().positive(),
    username: z.string(),
    password: z.string().min(8),
  }),
  features: z.object({
    enableCache: z.boolean(),
    enableLogging: z.boolean(),
    maxConnections: z.number().int().positive().default(100),
  }),
})

const configInput = ref('')
const configResult = ref('')

function validateConfig() {
  try {
    const data = JSON.parse(configInput.value)
    const validated = configSchema.parse(data)
    configResult.value = `✅ 配置验证成功！\n${JSON.stringify(validated, null, 2)}`
    msgSuccess({ content: '配置数据验证通过' })
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      configResult.value = `❌ 配置验证失败：\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
      msgError({ content: '配置验证失败' })
    }
    else {
      configResult.value = `❌ JSON 解析失败`
      msgError({ content: 'JSON 格式错误' })
    }
  }
}

// ========== 示例 4: 数据转换和安全解析 ==========
const transformSchema = z.object({
  price: z.string().transform(val => Number.parseFloat(val)),
  quantity: z.string().transform(val => Number.parseInt(val)),
  createdAt: z.string().transform(val => dayjs(val).format('YYYY年MM月DD日 HH:mm:ss')),
})

const transformInput = ref('')
const transformResult = ref('')

function validateAndTransform() {
  try {
    const data = JSON.parse(transformInput.value)
    const validated = transformSchema.parse(data)
    transformResult.value = `✅ 转换成功！\n原始数据:\n${JSON.stringify(data, null, 2)}\n\n转换后:\n${JSON.stringify({
      price: validated.price,
      quantity: validated.quantity,
      createdAt: validated.createdAt,
    }, null, 2)}`
    msgSuccess({ content: '数据转换成功' })
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      transformResult.value = `❌ 转换失败：\n${err.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
      msgError({ content: '数据转换失败' })
    }
    else {
      transformResult.value = `❌ JSON 解析失败`
      msgError({ content: 'JSON 格式错误' })
    }
  }
}

// ========== 示例 5: safeParse 安全解析 ==========
const safeParseInput = ref('')
const safeParseResult = ref('')

function performSafeParse() {
  try {
    const data = JSON.parse(safeParseInput.value)
    const result = userApiSchema.safeParse(data)

    if (result.success) {
      safeParseResult.value = `✅ safeParse 成功！\n${JSON.stringify(result.data, null, 2)}`
      msgSuccess({ content: 'safeParse 验证通过' })
    }
    else {
      safeParseResult.value = `❌ safeParse 失败：\n${result.error.issues.map(e => `- ${e.path.join('.')}: ${e.message}`).join('\n')}`
      msgWarning({ content: 'safeParse 验证失败（不抛出异常）' })
    }
  }
  catch {
    safeParseResult.value = `❌ JSON 解析失败`
    msgError({ content: 'JSON 格式错误' })
  }
}

// 设置示例数据
function setBasicExample() {
  basicInput.value = JSON.stringify({
    name: '张三',
    age: 25,
    isActive: true,
  }, null, 2)
}

function setBasicErrorExample() {
  basicInput.value = JSON.stringify({
    name: '张三',
    age: -5, // 错误：年龄必须是正数
    isActive: 'yes', // 错误：应该是 boolean
  }, null, 2)
}

function setApiExample() {
  apiInput.value = JSON.stringify({
    code: 200,
    message: 'success',
    data: {
      id: 1001,
      username: 'johndoe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
      roles: ['user', 'admin'],
      createdAt: new Date().toISOString(),
    },
  }, null, 2)
}

function setApiErrorExample() {
  apiInput.value = JSON.stringify({
    code: 200,
    message: 'success',
    data: {
      id: 1001,
      username: 'johndoe',
      email: 'invalid-email', // 错误：不是有效的邮箱
      avatar: 'not-a-url', // 错误：不是有效的 URL
      roles: 'admin', // 错误：应该是数组
      createdAt: '2024-01-01', // 错误：不是 datetime 格式
    },
  }, null, 2)
}

function setConfigExample() {
  configInput.value = JSON.stringify({
    app: {
      name: 'MyApp',
      version: '1.0.0',
      port: 3000,
      debug: true,
    },
    database: {
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
    },
    features: {
      enableCache: true,
      enableLogging: false,
      maxConnections: 200,
    },
  }, null, 2)
}

function setConfigErrorExample() {
  configInput.value = JSON.stringify({
    app: {
      name: '',
      version: '1.0', // 错误：版本号格式不正确，应该是 x.y.z
      port: 99999, // 错误：端口号超出范围
      debug: true,
    },
    database: {
      host: 'localhost',
      port: -1, // 错误：端口号必须是正数
      username: 'admin',
      password: '123', // 错误：密码长度不足 8 位
    },
    features: {
      enableCache: true,
      enableLogging: false,
      maxConnections: -10, // 错误：连接数必须是正数
    },
  }, null, 2)
}

function setTransformExample() {
  transformInput.value = JSON.stringify({
    price: '99.99',
    quantity: '10',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), // 模拟后端返回的日期格式
  }, null, 2)
}

function setTransformErrorExample() {
  transformInput.value = JSON.stringify({
    price: 'abc', // 错误：无法转换为数字
    quantity: 'xyz', // 错误：无法转换为整数
    createdAt: 'invalid-date', // 错误：无效的日期格式
  }, null, 2)
}

function setSafeParseExample() {
  safeParseInput.value = JSON.stringify({
    code: 200,
    message: 'success',
    data: {
      id: 1001,
      username: 'johndoe',
      email: 'john@example.com',
      roles: ['user'],
      createdAt: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
    },
  }, null, 2)
}

function setSafeParseErrorExample() {
  safeParseInput.value = JSON.stringify({
    code: 200,
    message: 'success',
    data: {
      id: 1001,
      username: 'johndoe',
      email: 'not-an-email', // 错误：邮箱格式不正确
      roles: ['user'],
      createdAt: new Date().toISOString(),
    },
  }, null, 2)
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
      message="Zod 数据校验示例"
      description="本示例演示了 Zod 在各种场景下的数据校验应用，包括基础类型、API 响应、配置对象、数据转换等。"
      type="info"
      show-icon
    />

    <!-- 示例 1: 基础数据类型验证 -->
    <ACard title="1. 基础数据类型验证" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton size="small" type="primary" @click="setBasicExample">
            填充正确数据
          </AButton>
          <AButton size="small" danger @click="setBasicErrorExample">
            填充错误数据
          </AButton>
        </ASpace>
        <ATextarea
          v-model:value="basicInput"
          placeholder="请输入 JSON 数据"
          :rows="6"
        />
        <AButton type="primary" @click="validateBasicData">
          验证数据
        </AButton>
        <ATextarea
          v-if="basicResult"
          v-model:value="basicResult"
          :rows="6"
          readonly
        />
      </ASpace>
    </ACard>

    <!-- 示例 2: API 响应验证 -->
    <ACard title="2. API 响应数据验证" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton size="small" type="primary" @click="setApiExample">
            填充正确数据
          </AButton>
          <AButton size="small" danger @click="setApiErrorExample">
            填充错误数据
          </AButton>
        </ASpace>
        <ATextarea
          v-model:value="apiInput"
          placeholder="请输入 API 响应 JSON"
          :rows="10"
        />
        <AButton type="primary" @click="validateApiResponse">
          验证 API 响应
        </AButton>
        <ATextarea
          v-if="apiResult"
          v-model:value="apiResult"
          :rows="10"
          readonly
        />
      </ASpace>
    </ACard>

    <!-- 示例 3: 配置对象验证 -->
    <ACard title="3. 配置对象验证" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton size="small" type="primary" @click="setConfigExample">
            填充正确数据
          </AButton>
          <AButton size="small" danger @click="setConfigErrorExample">
            填充错误数据
          </AButton>
        </ASpace>
        <ATextarea
          v-model:value="configInput"
          placeholder="请输入配置对象 JSON"
          :rows="12"
        />
        <AButton type="primary" @click="validateConfig">
          验证配置
        </AButton>
        <ATextarea
          v-if="configResult"
          v-model:value="configResult"
          :rows="12"
          readonly
        />
      </ASpace>
    </ACard>

    <!-- 示例 4: 数据转换 -->
    <ACard title="4. 数据转换 (transform)" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton size="small" type="primary" @click="setTransformExample">
            填充正确数据
          </AButton>
          <AButton size="small" danger @click="setTransformErrorExample">
            填充错误数据
          </AButton>
        </ASpace>
        <ATextarea
          v-model:value="transformInput"
          placeholder="请输入需要转换的 JSON"
          :rows="6"
        />
        <AButton type="primary" @click="validateAndTransform">
          验证并转换
        </AButton>
        <ATextarea
          v-if="transformResult"
          v-model:value="transformResult"
          :rows="10"
          readonly
        />
      </ASpace>
    </ACard>

    <!-- 示例 5: safeParse 安全解析 -->
    <ACard title="5. safeParse 安全解析 (不抛出异常)" :bordered="false">
      <ASpace direction="vertical" :size="12" class="w-100%">
        <ASpace>
          <AButton size="small" type="primary" @click="setSafeParseExample">
            填充正确数据
          </AButton>
          <AButton size="small" danger @click="setSafeParseErrorExample">
            填充错误数据
          </AButton>
        </ASpace>
        <ATextarea
          v-model:value="safeParseInput"
          placeholder="请输入 JSON 数据"
          :rows="10"
        />
        <AButton type="primary" @click="performSafeParse">
          安全解析 (safeParse)
        </AButton>
        <ATextarea
          v-if="safeParseResult"
          v-model:value="safeParseResult"
          :rows="10"
          readonly
        />
      </ASpace>
    </ACard>
  </ASpace>
</template>

<style scoped lang="less"></style>
