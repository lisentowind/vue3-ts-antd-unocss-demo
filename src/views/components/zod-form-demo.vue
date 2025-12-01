<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { reactive, ref } from 'vue'
import { z } from 'zod'
import { useMessage, useResetFormReactive } from '@/hooks'

// 定义 Zod 表单校验 Schema
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, '用户名至少需要3个字符')
      .max(20, '用户名最多20个字符')
      .regex(/^\w+$/, '用户名只能包含字母、数字和下划线'),
    email: z.string().email('请输入有效的邮箱地址'),
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
      .optional(),
    website: z.string().url('请输入有效的网址').optional().or(z.literal('')),
    bio: z.string().max(200, '简介最多200个字符').optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

type FormData = z.infer<typeof formSchema>

const formRef = ref<FormInstance>()
const { msgSuccess, msgError } = useMessage()

// 使用 useResetFormReactive 管理表单数据
const { state: formData, reset: resetFormData } = useResetFormReactive<
  Partial<FormData>
>({
  username: '',
  email: '',
  age: undefined,
  password: '',
  confirmPassword: '',
  phone: '',
  website: '',
  bio: '',
})

// 错误信息
const errors = reactive<Record<string, string>>({})

// 验证单个字段
function validateField(field: keyof FormData) {
  try {
    // 清空该字段的错误
    errors[field] = ''

    // 验证整个表单数据
    formSchema.parse(formData)
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      // 找到对应字段的错误
      const fieldError = err.issues.find(issue => issue.path[0] === field)
      if (fieldError) {
        errors[field] = fieldError.message
      }
    }
  }
}

// 提交表单
function handleSubmit() {
  try {
    // 清空所有错误
    Object.keys(errors).forEach((key) => {
      errors[key] = ''
    })

    // 验证整个表单
    const validatedData = formSchema.parse(formData)

    msgSuccess({
      content: '表单验证成功！',
    })

    console.log('验证通过的数据:', validatedData)
  }
  catch (err) {
    if (err instanceof z.ZodError) {
      // 收集所有错误信息
      err.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      msgError({
        content: err.issues[0].message,
      })
    }
  }
}

// 重置表单
function handleReset() {
  // 使用 hooks 重置表单数据
  resetFormData()

  // 清空所有错误信息
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
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
      message="Zod 表单校验示例"
      description="本示例演示了使用 Zod 进行复杂的表单数据校验，包括字符串验证、数字验证、正则匹配、自定义验证等。"
      type="info"
      show-icon
    />

    <AForm
      ref="formRef"
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <AFormItem
        label="用户名"
        :validate-status="errors.username ? 'error' : ''"
        :help="errors.username"
      >
        <AInput
          v-model:value="formData.username"
          placeholder="请输入用户名 (3-20个字符)"
          @blur="validateField('username')"
        />
      </AFormItem>

      <AFormItem
        label="邮箱"
        :validate-status="errors.email ? 'error' : ''"
        :help="errors.email"
      >
        <AInput
          v-model:value="formData.email"
          placeholder="请输入邮箱地址"
          @blur="validateField('email')"
        />
      </AFormItem>

      <AFormItem
        label="年龄"
        :validate-status="errors.age ? 'error' : ''"
        :help="errors.age"
      >
        <AInputNumber
          v-model:value="formData.age"
          placeholder="请输入年龄 (18-100)"
          :min="1"
          :max="150"
          class="w-100%"
          @blur="validateField('age')"
        />
      </AFormItem>

      <AFormItem
        label="密码"
        :validate-status="errors.password ? 'error' : ''"
        :help="errors.password"
      >
        <AInputPassword
          v-model:value="formData.password"
          placeholder="请输入密码 (包含大小写字母和数字)"
          @blur="validateField('password')"
        />
      </AFormItem>

      <AFormItem
        label="确认密码"
        :validate-status="errors.confirmPassword ? 'error' : ''"
        :help="errors.confirmPassword"
      >
        <AInputPassword
          v-model:value="formData.confirmPassword"
          placeholder="请再次输入密码"
          @blur="validateField('confirmPassword')"
        />
      </AFormItem>

      <AFormItem
        label="手机号"
        :validate-status="errors.phone ? 'error' : ''"
        :help="errors.phone"
      >
        <AInput
          v-model:value="formData.phone"
          placeholder="请输入手机号 (选填)"
          @blur="validateField('phone')"
        />
      </AFormItem>

      <AFormItem
        label="个人网站"
        :validate-status="errors.website ? 'error' : ''"
        :help="errors.website"
      >
        <AInput
          v-model:value="formData.website"
          placeholder="请输入个人网站 URL (选填)"
          @blur="validateField('website')"
        />
      </AFormItem>

      <AFormItem
        label="个人简介"
        :validate-status="errors.bio ? 'error' : ''"
        :help="errors.bio"
      >
        <ATextarea
          v-model:value="formData.bio"
          placeholder="请输入个人简介 (最多200字)"
          :rows="4"
          @blur="validateField('bio')"
        />
      </AFormItem>

      <AFormItem :wrapper-col="{ offset: 6, span: 18 }">
        <ASpace>
          <AButton type="primary" @click="handleSubmit">
            提交表单
          </AButton>
          <AButton @click="handleReset">
            重置
          </AButton>
        </ASpace>
      </AFormItem>
    </AForm>
  </ASpace>
</template>

<style scoped lang="less"></style>
