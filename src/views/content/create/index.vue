<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { useMessage, useZodForm } from '@/hooks'

const router = useRouter()
const { msgSuccess, msgError } = useMessage()

// 定义 Zod 表单校验 Schema
const contentFormSchema = z.object({
  title: z.string().min(2, '标题至少需要2个字符').max(100, '标题最多100个字符'),
  category: z.string().min(1, '请选择分类'),
  tags: z.array(z.string()).max(10, '最多选择10个标签').optional(),
  content: z
    .string()
    .min(10, '内容至少需要10个字符')
    .max(10000, '内容最多10000个字符'),
  status: z.enum(['draft', 'published'], { message: '请选择状态' }),
})

// 分类选项
const categoryOptions = [
  { label: '技术文章', value: '技术文章' },
  { label: '教程', value: '教程' },
  { label: '新闻', value: '新闻' },
  { label: '产品介绍', value: '产品介绍' },
  { label: '案例分享', value: '案例分享' },
]

const loading = ref(false)
const formRef = ref<FormInstance>()

// 使用 useZodForm 管理表单数据和校验
const {
  formData,
  validate,
  validateField,
  reset,
  getFieldError,
  hasFieldError,
  allRules,
} = useZodForm(contentFormSchema, {
  title: '',
  category: '',
  tags: [],
  content: '',
  status: 'draft',
})

async function handleSubmit() {
  const result = validate()

  if (result.success) {
    try {
      loading.value = true
      // 这里调用实际的保存 API
      await new Promise(resolve => setTimeout(resolve, 1000))

      msgSuccess({ content: '内容创建成功！' })
      router.push('/content/list')
    }
    catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error)
      msgError({ content: '创建失败' })
    }
    finally {
      loading.value = false
    }
  }
  else {
    msgError({ content: result.errors.issues[0].message })
  }
}

function handleCancel() {
  router.back()
}

function handleReset() {
  reset()
}
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="text-xl font-semibold">
        创建内容
      </h2>
    </div>

    <AForm ref="formRef" :model="formData" :rules="allRules" layout="vertical">
      <AFormItem
        label="标题"
        name="title"
        :validate-status="hasFieldError('title') ? 'error' : ''"
        :help="getFieldError('title')"
      >
        <AInput
          v-model:value="formData.title"
          placeholder="请输入标题 (2-100个字符)"
          size="large"
          @blur="() => validateField('title')"
        />
      </AFormItem>

      <AFormItem
        label="分类"
        name="category"
        :validate-status="hasFieldError('category') ? 'error' : ''"
        :help="getFieldError('category')"
      >
        <ASelect
          v-model:value="formData.category"
          placeholder="请选择分类"
          size="large"
          :options="categoryOptions"
          @blur="() => validateField('category')"
        />
      </AFormItem>

      <AFormItem
        label="标签"
        name="tags"
        :validate-status="hasFieldError('tags') ? 'error' : ''"
        :help="getFieldError('tags')"
      >
        <ASelect
          v-model:value="formData.tags"
          mode="tags"
          placeholder="请输入标签 (最多10个)"
          size="large"
          @blur="() => validateField('tags')"
        />
      </AFormItem>

      <AFormItem
        label="内容"
        name="content"
        :validate-status="hasFieldError('content') ? 'error' : ''"
        :help="getFieldError('content')"
      >
        <ATextarea
          v-model:value="formData.content"
          placeholder="请输入内容 (10-10000个字符)"
          :rows="10"
          @blur="() => validateField('content')"
        />
      </AFormItem>

      <AFormItem
        label="状态"
        name="status"
        :validate-status="hasFieldError('status') ? 'error' : ''"
        :help="getFieldError('status')"
      >
        <ARadioGroup
          v-model:value="formData.status"
          @blur="() => validateField('status')"
        >
          <ARadio value="draft">
            草稿
          </ARadio>
          <ARadio value="published">
            发布
          </ARadio>
        </ARadioGroup>
      </AFormItem>

      <AFormItem>
        <ASpace>
          <AButton type="primary" :loading="loading" @click="handleSubmit">
            保存
          </AButton>
          <AButton @click="handleReset">
            重置
          </AButton>
          <AButton @click="handleCancel">
            取消
          </AButton>
        </ASpace>
      </AFormItem>
    </AForm>
  </div>
</template>
