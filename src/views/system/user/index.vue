<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useMessage, useZodForm } from '@/hooks'

interface User {
  id: string
  username: string
  nickname: string
  email: string
  phone?: string
  roles: string[]
  status: 'active' | 'disabled'
  createdAt: string
}

// Zod 表单验证Schema
const userFormSchema = z.object({
  username: z
    .string()
    .min(3, '用户名至少3个字符')
    .max(20, '用户名最多20个字符')
    .regex(/^\w+$/, '用户名只能包含字母、数字和下划线'),
  nickname: z.string().min(2, '昵称至少2个字符').max(20, '昵称最多20个字符'),
  email: z.email('请输入有效的邮箱地址'),
  phone: z
    .string()
    .regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码')
    .optional()
    .or(z.literal('')),
  password: z
    .string()
    .min(6, '密码至少6个字符')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, '密码必须包含大小写字母和数字')
    .optional()
    .or(z.literal('')),
  roles: z.array(z.string()).min(1, '至少选择一个角色'),
  status: z.enum(['active', 'disabled']),
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', key: 'username' },
  { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '角色', dataIndex: 'roles', key: 'roles' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 150 },
  { title: '操作', key: 'action', width: 200 },
]

const dataSource = ref<User[]>([
  {
    id: '1',
    username: 'admin',
    nickname: '超级管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    roles: ['admin'],
    status: 'active',
    createdAt: '2024-01-01 10:00:00',
  },
  {
    id: '2',
    username: 'editor',
    nickname: '编辑人员',
    email: 'editor@example.com',
    phone: '13800138001',
    roles: ['editor'],
    status: 'active',
    createdAt: '2024-01-02 10:00:00',
  },
  {
    id: '3',
    username: 'guest',
    nickname: '访客',
    email: 'guest@example.com',
    roles: ['guest'],
    status: 'active',
    createdAt: '2024-01-03 10:00:00',
  },
])

// 角色选项
const roleOptions = [
  { label: '超级管理员', value: 'admin' },
  { label: '编辑人员', value: 'editor' },
  { label: '访客', value: 'guest' },
]

// 状态选项
const statusOptions = [
  { label: '正常', value: 'active' },
  { label: '禁用', value: 'disabled' },
]

const { msgSuccess, msgWarning, msgError } = useMessage()

const loading = ref(false)
const modalVisible = ref(false)
const modalTitle = ref('')
const editingId = ref<string>('')

// 使用 useZodForm
const {
  formData,
  validate,
  validateField,
  reset,
  getFieldError,
  hasFieldError,
  allRules,
  setValues,
} = useZodForm(userFormSchema, {
  username: '',
  nickname: '',
  email: '',
  phone: '',
  password: '',
  roles: [],
  status: 'active',
})

// 打开新增弹窗
function handleAdd() {
  modalTitle.value = '新增用户'
  editingId.value = ''
  reset()
  modalVisible.value = true
}

// 打开编辑弹窗
function handleEdit(record: User) {
  modalTitle.value = '编辑用户'
  editingId.value = record.id
  setValues({
    username: record.username,
    nickname: record.nickname,
    email: record.email,
    phone: record.phone || '',
    password: '',
    roles: record.roles,
    status: record.status,
  })
  modalVisible.value = true
}

// 提交表单
function handleSubmit() {
  const result = validate()

  if (!result.success) {
    msgError({ content: result.errors.issues[0].message })
    return
  }

  // 模拟保存
  if (editingId.value) {
    // 编辑
    const index = dataSource.value.findIndex(
      item => item.id === editingId.value,
    )
    if (index !== -1) {
      dataSource.value[index] = {
        ...dataSource.value[index],
        ...result.data,
      }
      msgSuccess({ content: '编辑成功' })
    }
  }
  else {
    // 新增
    const newUser: User = {
      id: String(Date.now()),
      ...result.data,
      phone: result.data.phone || undefined,
      createdAt: new Date().toLocaleString('zh-CN'),
    }
    dataSource.value.push(newUser)
    msgSuccess({ content: '新增成功' })
  }

  modalVisible.value = false
}

// 删除用户
function handleDelete(record: User) {
  msgWarning({ content: `确定删除用户：${record.nickname}？` })
  // 这里应该显示确认对话框，简化处理
  const index = dataSource.value.findIndex(item => item.id === record.id)
  if (index !== -1) {
    dataSource.value.splice(index, 1)
    msgSuccess({ content: '删除成功' })
  }
}

function getRoleColor(role: string) {
  const colorMap: Record<string, string> = {
    admin: 'red',
    editor: 'blue',
    guest: 'green',
  }
  return colorMap[role] || 'default'
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl text-gray-800 font-semibold">
        用户管理
      </h2>
      <AButton type="primary" @click="handleAdd">
        <template #icon>
          <CustomIcon icon="material-symbols:add" class="color-white m-[0_5px_3px_0] inline-block" />
        </template>
        添加用户
      </AButton>
    </div>

    <ATable
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      row-key="id"
      :pagination="{ pageSize: 10 }"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'roles'">
          <ATag
            v-for="role in record.roles"
            :key="role"
            :color="getRoleColor(role)"
          >
            {{ role }}
          </ATag>
        </template>

        <template v-else-if="column.key === 'status'">
          <ABadge
            :status="record.status === 'active' ? 'success' : 'error'"
            :text="record.status === 'active' ? '正常' : '禁用'"
          />
        </template>

        <template v-else-if="column.key === 'action'">
          <ASpace>
            <AButton
              type="link"
              size="small"
              @click="handleEdit(record as any)"
            >
              编辑
            </AButton>
            <AButton
              type="link"
              size="small"
              danger
              @click="handleDelete(record as any)"
            >
              删除
            </AButton>
          </ASpace>
        </template>
      </template>
    </ATable>

    <!-- 用户表单弹窗 -->
    <AModal
      v-model:open="modalVisible"
      :title="modalTitle"
      width="600px"
      @ok="handleSubmit"
    >
      <AForm
        :model="formData"
        :rules="allRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        class="mt-4"
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
            :disabled="!!editingId"
            @blur="() => validateField('username')"
          />
        </AFormItem>

        <AFormItem
          label="昵称"
          name="nickname"
          :validate-status="hasFieldError('nickname') ? 'error' : ''"
          :help="getFieldError('nickname')"
        >
          <AInput
            v-model:value="formData.nickname"
            placeholder="请输入昵称"
            @blur="() => validateField('nickname')"
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
            placeholder="请输入邮箱"
            @blur="() => validateField('email')"
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
          label="密码"
          name="password"
          :validate-status="hasFieldError('password') ? 'error' : ''"
          :help="getFieldError('password')"
        >
          <AInputPassword
            v-model:value="formData.password"
            :placeholder="editingId ? '留空则不修改密码' : '请输入密码'"
            @blur="() => validateField('password')"
          />
        </AFormItem>

        <AFormItem
          label="角色"
          name="roles"
          :validate-status="hasFieldError('roles') ? 'error' : ''"
          :help="getFieldError('roles')"
        >
          <ASelect
            v-model:value="formData.roles"
            mode="multiple"
            placeholder="请选择角色"
            :options="roleOptions"
            @blur="() => validateField('roles')"
          />
        </AFormItem>

        <AFormItem
          label="状态"
          name="status"
          :validate-status="hasFieldError('status') ? 'error' : ''"
          :help="getFieldError('status')"
        >
          <ASelect
            v-model:value="formData.status"
            placeholder="请选择状态"
            :options="statusOptions"
            @blur="() => validateField('status')"
          />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>
