<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { ref } from 'vue'
import { z } from 'zod'
import { useMessage, useZodForm } from '@/hooks'

interface Role {
  id: string
  name: string
  code: string
  description: string
  permissions: string[]
  userCount: number
  createdAt: string
}

// 定义 Zod 表单校验 Schema
const roleFormSchema = z.object({
  name: z
    .string()
    .min(2, '角色名称至少需要2个字符')
    .max(20, '角色名称最多20个字符'),
  code: z
    .string()
    .min(2, '角色代码至少需要2个字符')
    .max(50, '角色代码最多50个字符')
    .regex(
      /^[a-z][a-z0-9_]*$/,
      '角色代码只能包含小写字母、数字和下划线，且必须以字母开头',
    ),
  description: z
    .string()
    .max(200, '描述最多200个字符')
    .optional()
    .or(z.literal('')),
  permissions: z
    .array(z.string())
    .min(1, '至少选择一个权限')
    .max(50, '最多选择50个权限'),
})

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '角色名称', dataIndex: 'name', key: 'name' },
  { title: '角色代码', dataIndex: 'code', key: 'code' },
  { title: '描述', dataIndex: 'description', key: 'description' },
  { title: '权限数量', dataIndex: 'permissions', key: 'permissions' },
  { title: '用户数', dataIndex: 'userCount', key: 'userCount' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'action', width: 200 },
]

const dataSource = ref<Role[]>([
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有系统所有权限',
    permissions: ['*'],
    userCount: 1,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: '编辑人员',
    code: 'editor',
    description: '可以管理内容相关功能',
    permissions: ['content:read', 'content:write'],
    userCount: 5,
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    name: '访客',
    code: 'guest',
    description: '只能查看内容',
    permissions: ['content:read'],
    userCount: 10,
    createdAt: '2024-01-03',
  },
])

// 可选权限列表
const permissionOptions = [
  { label: '所有权限', value: '*' },
  { label: '仪表盘查看', value: 'dashboard:view' },
  { label: '内容查看', value: 'content:read' },
  { label: '内容编辑', value: 'content:write' },
  { label: '内容删除', value: 'content:delete' },
  { label: '系统查看', value: 'system:view' },
  { label: '用户管理', value: 'system:user:view' },
  { label: '角色管理', value: 'system:role:view' },
  { label: '菜单管理', value: 'system:menu:view' },
]

const { msgInfo, msgWarning, msgSuccess, msgError } = useMessage()

const loading = ref(false)
const modalVisible = ref(false)
const modalTitle = ref('添加角色')
const editingId = ref<string | null>(null)
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
} = useZodForm(roleFormSchema, {
  name: '',
  code: '',
  description: '',
  permissions: [],
})

function handleEdit(record: Role) {
  editingId.value = record.id
  modalTitle.value = '编辑角色'
  modalVisible.value = true

  // 填充表单数据
  formData.name = record.name
  formData.code = record.code
  formData.description = record.description
  formData.permissions = [...record.permissions]
}

function handleDelete(record: Role) {
  msgWarning({ content: `删除角色：${record.name}` })
}

function handleAdd() {
  editingId.value = null
  modalTitle.value = '添加角色'
  modalVisible.value = true
  reset()
}

function handlePermission(record: Role) {
  msgInfo({ content: `配置权限：${record.name}` })
}

// 提交表单
function handleSubmit() {
  const result = validate()

  if (result.success) {
    if (editingId.value) {
      // 编辑逻辑
      const index = dataSource.value.findIndex(
        item => item.id === editingId.value,
      )
      if (index !== -1) {
        dataSource.value[index] = {
          ...dataSource.value[index],
          ...result.data,
        }
      }
      msgSuccess({ content: '角色编辑成功！' })
    }
    else {
      // 添加逻辑
      const newRole: Role = {
        id: String(Date.now()),
        ...result.data,
        description: result.data.description || '',
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      dataSource.value.push(newRole)
      msgSuccess({ content: '角色添加成功！' })
    }
    modalVisible.value = false
  }
  else {
    msgError({ content: result.errors.issues[0].message })
  }
}

// 取消
function handleCancel() {
  modalVisible.value = false
  reset()
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        角色管理
      </h2>
      <AButton type="primary" @click="handleAdd">
        <template #icon>
          <CustomIcon
            icon="material-symbols:add"
            class="color-white m-[0_5px_3px_0] inline-block"
          />
        </template>
        添加角色
      </AButton>
    </div>

    <ATable
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      row-key="id"
      :pagination="{ pageSize: 10 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'permissions'">
          <ATag color="blue">
            {{ record.permissions.length }}
          </ATag>
        </template>

        <template v-else-if="column.key === 'action'">
          <ASpace>
            <AButton
              type="link"
              size="small"
              @click="handlePermission(record as any)"
            >
              权限配置
            </AButton>
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

    <!-- 角色表单模态框 -->
    <AModal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="600"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <AForm
        ref="formRef"
        :model="formData"
        :rules="allRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <AFormItem
          label="角色名称"
          name="name"
          :validate-status="hasFieldError('name') ? 'error' : ''"
          :help="getFieldError('name')"
        >
          <AInput
            v-model:value="formData.name"
            placeholder="请输入角色名称 (2-20个字符)"
            @blur="() => validateField('name')"
          />
        </AFormItem>

        <AFormItem
          label="角色代码"
          name="code"
          :validate-status="hasFieldError('code') ? 'error' : ''"
          :help="getFieldError('code')"
        >
          <AInput
            v-model:value="formData.code"
            placeholder="例如: admin, editor, guest"
            @blur="() => validateField('code')"
          />
        </AFormItem>

        <AFormItem
          label="描述"
          name="description"
          :validate-status="hasFieldError('description') ? 'error' : ''"
          :help="getFieldError('description')"
        >
          <ATextarea
            v-model:value="formData.description"
            placeholder="请输入角色描述 (最多200字)"
            :rows="3"
            @blur="() => validateField('description')"
          />
        </AFormItem>

        <AFormItem
          label="权限配置"
          name="permissions"
          :validate-status="hasFieldError('permissions') ? 'error' : ''"
          :help="getFieldError('permissions')"
        >
          <ASelect
            v-model:value="formData.permissions"
            mode="multiple"
            placeholder="请选择权限 (至少1个)"
            :options="permissionOptions"
            :max-tag-count="3"
            @blur="() => validateField('permissions')"
          />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>
