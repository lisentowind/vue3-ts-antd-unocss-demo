<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { ref } from 'vue'
import { z } from 'zod'
import { useMessage, useZodForm } from '@/hooks'

const { msgSuccess, msgError } = useMessage()
const formRef = ref<FormInstance>()

// ========== 示例 1: 用户注册表单 ==========
const userSchema = z
  .object({
    username: z
      .string()
      .min(3, '用户名至少需要3个字符')
      .max(20, '用户名最多20个字符')
      .regex(/^\w+$/, '用户名只能包含字母、数字和下划线'),
    email: z.email('请输入有效的邮箱地址'),
    age: z
      .number({ message: '年龄必须是数字' })
      .int('年龄必须是整数')
      .min(18, '年龄至少18岁')
      .max(100, '年龄最多100岁')
      .optional(),
    password: z
      .string()
      .min(6, '密码至少需要6个字符')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字'),
    confirmPassword: z.string(),
    phone: z
      .string()
      .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
      .optional()
      .or(z.literal('')),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

const {
  formData: userFormData,
  allRules: userFormAllRules,
  validate: userFormValidate,
  reset: userFormReset,
  getFieldError: userFormGetFieldError,
  hasFieldError: userFormHasFieldError,
  validateField: userFormValidateField,
} = useZodForm(userSchema, {
  username: '',
  email: '',
  age: undefined,
  password: '',
  confirmPassword: '',
  phone: undefined,
})

function handleUserSubmit() {
  const result = userFormValidate()

  if (result.success) {
    msgSuccess({ content: '用户注册表单验证成功！' })
    console.log('验证通过的数据:', result.data)
  }
  else {
    msgError({ content: '表单验证失败，请检查输入！' })
  }
}

function handleUserReset() {
  userFormReset()
  formRef.value?.resetFields()
}

// ========== 示例 2: 动态配置表单 ==========
const configSchema = z.object({
  appName: z.string().min(1, '应用名称不能为空'),
  appPort: z
    .number({ message: '端口必须是数字' })
    .int('端口必须是整数')
    .min(1, '端口号最小为1')
    .max(65535, '端口号最大为65535'),
  enableCache: z.boolean(),
  enableLogging: z.boolean(),
  logLevel: z.enum(['debug', 'info', 'warn', 'error'], {
    message: '请选择有效的日志级别',
  }),
  maxConnections: z
    .number({ message: '最大连接数必须是数字' })
    .int('最大连接数必须是整数')
    .positive('最大连接数必须是正数')
    .default(100),
  apiUrl: z.url('请输入有效的 URL').optional(),
})

const configForm = useZodForm(configSchema, {
  appName: 'MyApp',
  appPort: 3000,
  enableCache: true,
  enableLogging: false,
  logLevel: 'info',
  maxConnections: 100,
  apiUrl: '',
})

function handleConfigSubmit() {
  const result = configForm.validate()

  if (result.success) {
    msgSuccess({ content: '配置保存成功！' })
    console.log('配置数据:', result.data)
  }
  else {
    msgError({ content: '配置验证失败！' })
  }
}

// ========== 示例 3: 实时验证 ==========
const realtimeSchema = z.object({
  productName: z.string().min(2, '产品名称至少2个字符'),
  price: z
    .number({ message: '价格必须是数字' })
    .positive('价格必须大于0')
    .max(999999, '价格不能超过999999')
    .optional(),
  stock: z
    .number({ message: '库存必须是数字' })
    .int('库存必须是整数')
    .min(0, '库存不能为负数')
    .optional(),
  description: z.string().max(500, '描述最多500个字符').optional(),
})

const realtimeForm = useZodForm(realtimeSchema, {
  productName: '',
  price: undefined,
  stock: undefined,
  description: '',
})

// 实时验证字段
function handleBlur(field: keyof z.infer<typeof realtimeSchema>) {
  realtimeForm.validateField(field)
}

// ========== 示例 4: 条件验证 ==========
const shippingSchema = z
  .object({
    country: z.string().min(1, '请选择国家'),
    needsShipping: z.boolean(),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.needsShipping)
      return

    if (!data.address) {
      ctx.addIssue({
        code: 'custom',
        message: '请填写地址',
        path: ['address'],
      })
    }

    if (!data.city) {
      ctx.addIssue({
        code: 'custom',
        message: '请填写城市',
        path: ['city'],
      })
    }

    if (!data.zipCode) {
      ctx.addIssue({
        code: 'custom',
        message: '请填写邮编',
        path: ['zipCode'],
      })
    }
  })

const shippingForm = useZodForm(shippingSchema, {
  country: '',
  needsShipping: false,
  address: '',
  city: '',
  zipCode: '',
})

function handleShippingSubmit() {
  const result = shippingForm.validate()

  if (result.success) {
    msgSuccess({ content: '配送信息保存成功！' })
    console.log('配送数据:', result.data)
  }
  else {
    msgError({ content: '配送信息验证失败！' })
  }
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
      message="useZodForm Hooks 示例"
      description="本示例演示如何使用 useZodForm hooks 进行动态表单校验，包括整体验证、字段验证、实时验证、条件验证等。"
      type="info"
      show-icon
    />

    <!-- 示例 1: 用户注册表单 -->
    <ACard title="示例 1: 用户注册表单（完整验证）" :bordered="false">
      <AForm
        ref="formRef"
        :model="userFormData"
        :rules="userFormAllRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <AFormItem
          label="用户名"
          name="username"
          :validate-status="userFormHasFieldError('username') ? 'error' : ''"
          :help="userFormGetFieldError('username')"
        >
          <AInput
            v-model:value="userFormData.username"
            placeholder="请输入用户名"
            @blur="userFormValidateField('username')"
          />
        </AFormItem>

        <AFormItem
          label="邮箱"
          name="email"
          :validate-status="userFormHasFieldError('email') ? 'error' : ''"
          :help="userFormGetFieldError('email')"
        >
          <AInput
            v-model:value="userFormData.email"
            placeholder="请输入邮箱"
            @blur="userFormValidateField('email')"
          />
        </AFormItem>

        <AFormItem
          label="年龄"
          name="age"
          :validate-status="userFormHasFieldError('age') ? 'error' : ''"
          :help="userFormGetFieldError('age')"
        >
          <AInputNumber
            v-model:value="userFormData.age"
            placeholder="请输入年龄"
            class="w-100%"
            @blur="userFormValidateField('age')"
          />
        </AFormItem>

        <AFormItem
          label="密码"
          name="password"
          :validate-status="userFormHasFieldError('password') ? 'error' : ''"
          :help="userFormGetFieldError('password')"
        >
          <AInputPassword
            v-model:value="userFormData.password"
            placeholder="请输入密码"
            @blur="userFormValidateField('password')"
          />
        </AFormItem>

        <AFormItem
          label="确认密码"
          name="confirmPassword"
          :validate-status="
            userFormHasFieldError('confirmPassword') ? 'error' : ''
          "
          :help="userFormGetFieldError('confirmPassword')"
        >
          <AInputPassword
            v-model:value="userFormData.confirmPassword"
            placeholder="请再次输入密码"
            @blur="userFormValidateField('confirmPassword')"
          />
        </AFormItem>

        <AFormItem
          label="手机号"
          name="phone"
          :validate-status="userFormHasFieldError('phone') ? 'error' : ''"
          :help="userFormGetFieldError('phone')"
        >
          <AInput
            v-model:value="userFormData.phone"
            placeholder="请输入手机号（选填）"
            @blur="userFormValidateField('phone')"
          />
        </AFormItem>

        <AFormItem :wrapper-col="{ offset: 6, span: 18 }">
          <ASpace>
            <AButton type="primary" @click="handleUserSubmit">
              提交
            </AButton>
            <AButton @click="handleUserReset">
              重置
            </AButton>
          </ASpace>
        </AFormItem>
      </AForm>
    </ACard>

    <!-- 示例 2: 动态配置表单 -->
    <ACard title="示例 2: 应用配置表单（枚举验证）" :bordered="false">
      <AForm
        :model="configForm.formData"
        :rules="configForm.allRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <AFormItem
          label="应用名称"
          name="appName"
          :validate-status="configForm.hasFieldError('appName') ? 'error' : ''"
          :help="configForm.getFieldError('appName')"
        >
          <AInput v-model:value="configForm.formData.appName" />
        </AFormItem>

        <AFormItem
          label="应用端口"
          name="appPort"
          :validate-status="configForm.hasFieldError('appPort') ? 'error' : ''"
          :help="configForm.getFieldError('appPort')"
        >
          <AInputNumber
            v-model:value="configForm.formData.appPort"
            class="w-100%"
            :min="1"
            :max="65535"
          />
        </AFormItem>

        <AFormItem label="启用缓存" name="enableCache">
          <ASwitch v-model:checked="configForm.formData.enableCache" />
        </AFormItem>

        <AFormItem label="启用日志" name="enableLogging">
          <ASwitch v-model:checked="configForm.formData.enableLogging" />
        </AFormItem>

        <AFormItem
          label="日志级别"
          name="logLevel"
          :validate-status="configForm.hasFieldError('logLevel') ? 'error' : ''"
          :help="configForm.getFieldError('logLevel')"
        >
          <ASelect v-model:value="configForm.formData.logLevel" class="w-100%">
            <ASelectOption value="debug">
              Debug
            </ASelectOption>
            <ASelectOption value="info">
              Info
            </ASelectOption>
            <ASelectOption value="warn">
              Warn
            </ASelectOption>
            <ASelectOption value="error">
              Error
            </ASelectOption>
          </ASelect>
        </AFormItem>

        <AFormItem
          label="最大连接数"
          name="maxConnections"
          :validate-status="
            configForm.hasFieldError('maxConnections') ? 'error' : ''
          "
          :help="configForm.getFieldError('maxConnections')"
        >
          <AInputNumber
            v-model:value="configForm.formData.maxConnections"
            class="w-100%"
            :min="1"
          />
        </AFormItem>

        <AFormItem
          label="API 地址"
          name="apiUrl"
          :validate-status="configForm.hasFieldError('apiUrl') ? 'error' : ''"
          :help="configForm.getFieldError('apiUrl')"
        >
          <AInput
            v-model:value="configForm.formData.apiUrl"
            placeholder="https://api.example.com"
          />
        </AFormItem>

        <AFormItem :wrapper-col="{ offset: 6, span: 18 }">
          <ASpace>
            <AButton type="primary" @click="handleConfigSubmit">
              保存配置
            </AButton>
            <AButton @click="configForm.reset">
              重置
            </AButton>
          </ASpace>
        </AFormItem>
      </AForm>
    </ACard>

    <!-- 示例 3: 实时验证 -->
    <ACard title="示例 3: 产品信息表单（实时验证）" :bordered="false">
      <AAlert
        message="提示"
        description="失焦时会自动验证该字段"
        type="warning"
        show-icon
        class="mb-4"
      />

      <AForm
        :model="realtimeForm.formData"
        :rules="realtimeForm.allRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <AFormItem
          label="产品名称"
          name="productName"
          :validate-status="
            realtimeForm.hasFieldError('productName') ? 'error' : ''
          "
          :help="realtimeForm.getFieldError('productName')"
        >
          <AInput
            v-model:value="realtimeForm.formData.productName"
            placeholder="请输入产品名称"
            @blur="handleBlur('productName')"
          />
        </AFormItem>

        <AFormItem
          label="价格"
          name="price"
          :validate-status="realtimeForm.hasFieldError('price') ? 'error' : ''"
          :help="realtimeForm.getFieldError('price')"
        >
          <AInputNumber
            v-model:value="realtimeForm.formData.price"
            placeholder="请输入价格"
            class="w-100%"
            :precision="2"
            @blur="handleBlur('price')"
          />
        </AFormItem>

        <AFormItem
          label="库存"
          name="stock"
          :validate-status="realtimeForm.hasFieldError('stock') ? 'error' : ''"
          :help="realtimeForm.getFieldError('stock')"
        >
          <AInputNumber
            v-model:value="realtimeForm.formData.stock"
            placeholder="请输入库存"
            class="w-100%"
            @blur="handleBlur('stock')"
          />
        </AFormItem>

        <AFormItem
          label="产品描述"
          name="description"
          :validate-status="
            realtimeForm.hasFieldError('description') ? 'error' : ''
          "
          :help="realtimeForm.getFieldError('description')"
        >
          <ATextarea
            v-model:value="realtimeForm.formData.description"
            placeholder="请输入产品描述"
            :rows="4"
            @blur="handleBlur('description')"
          />
        </AFormItem>

        <AFormItem :wrapper-col="{ offset: 6, span: 18 }">
          <ASpace>
            <AButton
              type="primary"
              @click="
                () => {
                  const result = realtimeForm.validate()
                  if (result.success) {
                    msgSuccess({ content: '产品信息验证成功！' })
                  }
                  else {
                    msgError({ content: '产品信息验证失败！' })
                  }
                }
              "
            >
              提交
            </AButton>
            <AButton @click="realtimeForm.reset">
              重置
            </AButton>
          </ASpace>
        </AFormItem>
      </AForm>
    </ACard>

    <!-- 示例 4: 条件验证 -->
    <ACard title="示例 4: 配送信息表单（条件验证）" :bordered="false">
      <AAlert
        message="提示"
        description="启用配送时，地址、城市、邮编为必填项"
        type="warning"
        show-icon
        class="mb-4"
      />

      <AForm
        :model="shippingForm.formData"
        :rules="shippingForm.allRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <AFormItem
          label="国家"
          name="country"
          :validate-status="
            shippingForm.hasFieldError('country') ? 'error' : ''
          "
          :help="shippingForm.getFieldError('country')"
        >
          <ASelect v-model:value="shippingForm.formData.country" class="w-100%">
            <ASelectOption value="CN">
              中国
            </ASelectOption>
            <ASelectOption value="US">
              美国
            </ASelectOption>
            <ASelectOption value="JP">
              日本
            </ASelectOption>
          </ASelect>
        </AFormItem>

        <AFormItem label="需要配送" name="needsShipping">
          <ASwitch v-model:checked="shippingForm.formData.needsShipping" />
        </AFormItem>

        <template v-if="shippingForm.formData.needsShipping">
          <AFormItem
            label="详细地址"
            name="address"
            :rules="
              shippingForm.formData.needsShipping ? [{ required: true }] : []
            "
            :validate-status="
              shippingForm.hasFieldError('address') ? 'error' : ''
            "
            :help="shippingForm.getFieldError('address')"
          >
            <AInput
              v-model:value="shippingForm.formData.address"
              placeholder="请输入详细地址"
            />
          </AFormItem>

          <AFormItem
            label="城市"
            name="city"
            :rules="
              shippingForm.formData.needsShipping ? [{ required: true }] : []
            "
            :validate-status="shippingForm.hasFieldError('city') ? 'error' : ''"
            :help="shippingForm.getFieldError('city')"
          >
            <AInput
              v-model:value="shippingForm.formData.city"
              placeholder="请输入城市"
            />
          </AFormItem>

          <AFormItem
            label="邮政编码"
            name="zipCode"
            :rules="
              shippingForm.formData.needsShipping ? [{ required: true }] : []
            "
            :validate-status="
              shippingForm.hasFieldError('zipCode') ? 'error' : ''
            "
            :help="shippingForm.getFieldError('zipCode')"
          >
            <AInput
              v-model:value="shippingForm.formData.zipCode"
              placeholder="请输入邮政编码"
            />
          </AFormItem>
        </template>

        <AFormItem :wrapper-col="{ offset: 6, span: 18 }">
          <ASpace>
            <AButton type="primary" @click="handleShippingSubmit">
              提交
            </AButton>
            <AButton @click="shippingForm.reset">
              重置
            </AButton>
          </ASpace>
        </AFormItem>
      </AForm>
    </ACard>
  </ASpace>
</template>

<style scoped lang="less"></style>
