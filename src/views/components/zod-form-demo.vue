<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue'
import { computed, ref, watch } from 'vue'
import { z } from 'zod'
import { useMessage, useZodForm } from '@/hooks'

const hasAge = ref(false)

// 定义年龄校验规则
const ageSchema = z
  .number({ message: '年龄必须是数字' })
  .int('年龄必须是整数')
  .min(18, '年龄至少18岁')
  .max(100, '年龄最多100岁')

// 动态创建 Zod 表单校验 Schema
const formSchema = computed(() =>
  z
    .object({
      username: z
        .string()
        .min(3, '用户名至少需要3个字符')
        .max(20, '用户名最多20个字符')
        .regex(/^\w+$/, '用户名只能包含字母、数字和下划线'),
      email: z.email('请输入有效的邮箱地址'),
      age: hasAge.value ? ageSchema : ageSchema.optional(),
      password: z
        .string()
        .min(6, '密码至少需要6个字符')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          '密码必须包含大小写字母和数字',
        ),
      confirmPassword: z
        .string()
        .min(6, '密码至少需要6个字符')
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          '密码必须包含大小写字母和数字',
        ),
      phone: z
        .string()
        .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
        .optional()
        .or(z.literal('')),
      website: z.url('请输入有效的网址').optional().or(z.literal('')),
      bio: z.string().max(200, '简介最多200个字符').optional(),
      gender: z.string().min(1, '请选择性别'),
      hobbies: z
        .array(z.string())
        .min(1, '至少选择一个爱好')
        .max(5, '最多选择5个爱好'),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: '两次输入的密码不一致',
      path: ['confirmPassword'],
    }),
)

type FormData = z.infer<typeof formSchema.value>

const data: FormData = {
  username: '',
  email: '',
  age: undefined,
  password: '',
  confirmPassword: '',
  phone: undefined,
  website: undefined,
  bio: undefined,
  gender: '',
  hobbies: [],
}
console.log('🚀 ~ 测试类型:', data)

// 下拉选项数据
const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' },
  { label: '其他', value: 'other' },
]

const hobbyOptions = [
  { label: '阅读', value: 'reading' },
  { label: '运动', value: 'sports' },
  { label: '音乐', value: 'music' },
  { label: '旅游', value: 'travel' },
  { label: '摄影', value: 'photography' },
  { label: '编程', value: 'coding' },
  { label: '游戏', value: 'gaming' },
  { label: '绘画', value: 'painting' },
]

const formRef = ref<FormInstance>()
const { msgSuccess, msgError } = useMessage()

// 使用 useZodForm 管理表单数据和校验
const {
  formData,
  validate,
  validateField,
  reset,
  getFieldError,
  hasFieldError,
  allRules,
  updateSchema,
} = useZodForm(formSchema.value, {
  username: '',
  email: '',
  age: undefined,
  password: '',
  confirmPassword: '',
  phone: '',
  website: '',
  bio: '',
  gender: 'male',
  hobbies: [],
})

// 监听 hasAge 变化，动态更新 schema
watch(hasAge, () => {
  updateSchema(formSchema.value)
})
// 提交表单
function handleSubmit() {
  const result = validate()

  if (result.success) {
    msgSuccess({
      content: '表单验证成功！',
    })
    console.log('验证通过的数据:', result.data)
  }
  else {
    msgError({
      content: result.errors.issues[0].message,
    })
  }
}

// 重置表单
function handleReset() {
  reset()
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
      :rules="allRules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <AFormItem
        label="用户名"
        name="username"
        :validate-status="hasFieldError('username') ? 'error' : ''"
        :help="getFieldError('username')"
      >
        <AInput
          v-model:value="formData.username"
          placeholder="请输入用户名 (3-20个字符)"
          @blur="() => validateField('username')"
        />
      </AFormItem>

      <AFormItem
        label="邮箱"
        name="email"
        :validate-status="hasFieldError('email') ? 'error' : ''"
        :help="getFieldError('email')"
      >
        <AInput
          v-model:value="formData.email"
          placeholder="请输入邮箱地址"
          @blur="() => validateField('email')"
        />
      </AFormItem>

      <AFormItem label="是否填写年龄" name="hasAge">
        <ASwitch v-model:checked="hasAge" />
        <span class="ml-2">{{ hasAge ? '必填' : '选填' }}</span>
      </AFormItem>

      <AFormItem
        label="年龄"
        name="age"
        :required="hasAge"
        :validate-status="hasFieldError('age') ? 'error' : ''"
        :help="getFieldError('age')"
      >
        <AInputNumber
          v-model:value="formData.age"
          :placeholder="
            hasAge ? '请输入年龄 (18-100) - 必填' : '请输入年龄 (18-100) - 选填'
          "
          :min="1"
          :max="150"
          class="w-100%"
          @blur="() => validateField('age')"
        />
      </AFormItem>

      <AFormItem
        label="密码"
        name="password"
        :validate-status="hasFieldError('password') ? 'error' : ''"
        :help="getFieldError('password')"
      >
        <AInputPassword
          v-model:value="formData.password"
          placeholder="请输入密码 (包含大小写字母和数字)"
          @blur="() => validateField('password')"
        />
      </AFormItem>

      <AFormItem
        label="确认密码"
        name="confirmPassword"
        :validate-status="hasFieldError('confirmPassword') ? 'error' : ''"
        :help="getFieldError('confirmPassword')"
      >
        <AInputPassword
          v-model:value="formData.confirmPassword"
          placeholder="请再次输入密码"
          @blur="() => validateField('confirmPassword')"
        />
      </AFormItem>

      <AFormItem
        label="手机号"
        name="phone"
        :validate-status="hasFieldError('phone') ? 'error' : ''"
        :help="getFieldError('phone')"
      >
        <AInput
          v-model:value="formData.phone"
          placeholder="请输入手机号 (选填)"
          @blur="() => validateField('phone')"
        />
      </AFormItem>

      <AFormItem
        label="个人网站"
        name="website"
        :validate-status="hasFieldError('website') ? 'error' : ''"
        :help="getFieldError('website')"
      >
        <AInput
          v-model:value="formData.website"
          placeholder="请输入个人网站 URL (选填)"
          @blur="() => validateField('website')"
        />
      </AFormItem>

      <AFormItem
        label="个人简介"
        name="bio"
        :validate-status="hasFieldError('bio') ? 'error' : ''"
        :help="getFieldError('bio')"
      >
        <ATextarea
          v-model:value="formData.bio"
          placeholder="请输入个人简介 (最多200字)"
          :rows="4"
          @blur="() => validateField('bio')"
        />
      </AFormItem>

      <AFormItem
        label="性别"
        name="gender"
        :validate-status="hasFieldError('gender') ? 'error' : ''"
        :help="getFieldError('gender')"
      >
        <ASelect
          v-model:value="formData.gender"
          placeholder="请选择性别"
          :options="genderOptions"
          @blur="() => validateField('gender')"
        />
      </AFormItem>

      <AFormItem
        label="兴趣爱好"
        name="hobbies"
        :validate-status="hasFieldError('hobbies') ? 'error' : ''"
        :help="getFieldError('hobbies')"
      >
        <ASelect
          v-model:value="formData.hobbies"
          mode="multiple"
          placeholder="请选择兴趣爱好 (1-5个)"
          :options="hobbyOptions"
          :max-tag-count="3"
          @blur="() => validateField('hobbies')"
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
