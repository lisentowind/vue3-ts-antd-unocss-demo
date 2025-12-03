<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue'
import { computed, ref } from 'vue'
import { z } from 'zod'
import { useMessage, useZodForm } from '@/hooks'

interface Menu {
  id: string
  title: string
  path: string
  icon?: string
  parentId?: string
  orderNum: number
  type: 'menu' | 'button'
  permission?: string
  children?: Menu[]
}

// 定义 Zod 表单校验 Schema
const menuFormSchema = z.object({
  title: z
    .string()
    .min(2, '菜单名称至少需要2个字符')
    .max(20, '菜单名称最多20个字符'),
  path: z
    .string()
    .min(1, '路径不能为空')
    .max(100, '路径最多100个字符')
    .regex(/^\/[a-z0-9/_-]*$/, '路径格式不正确，必须以/开头，只能包含小写字母、数字、斜杠、下划线和连字符'),
  icon: z
    .string()
    .max(100, '图标名称最多100个字符')
    .optional()
    .or(z.literal('')),
  parentId: z
    .string()
    .optional()
    .or(z.literal('')),
  orderNum: z
    .number({ message: '排序必须是数字' })
    .int('排序必须是整数')
    .min(0, '排序不能小于0')
    .max(9999, '排序不能大于9999'),
  type: z.enum(['menu', 'button'], { message: '请选择类型' }),
  permission: z
    .string()
    .max(100, '权限标识最多100个字符')
    .optional()
    .or(z.literal('')),
})

const columns = [
  { title: '菜单名称', dataIndex: 'title', key: 'title', width: 200 },
  { title: '路径', dataIndex: 'path', key: 'path' },
  { title: '图标', dataIndex: 'icon', key: 'icon' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '排序', dataIndex: 'orderNum', key: 'orderNum', width: 80 },
  { title: '权限标识', dataIndex: 'permission', key: 'permission' },
  { title: '操作', key: 'action', width: 200 },
]

const dataSource = ref<Menu[]>([
  {
    id: '1',
    title: '仪表盘',
    path: '/dashboard',
    icon: 'material-symbols:dashboard-outline',
    orderNum: 1,
    type: 'menu',
    permission: 'dashboard:view',
  },
  {
    id: '2',
    title: '系统管理',
    path: '/system',
    icon: 'material-symbols:settings-outline',
    orderNum: 2,
    type: 'menu',
    permission: 'system:view',
    children: [
      {
        id: '2-1',
        title: '用户管理',
        path: '/system/user',
        icon: 'material-symbols:person-outline',
        parentId: '2',
        orderNum: 1,
        type: 'menu',
        permission: 'system:user:view',
      },
      {
        id: '2-2',
        title: '角色管理',
        path: '/system/role',
        icon: 'material-symbols:group-outline',
        parentId: '2',
        orderNum: 2,
        type: 'menu',
        permission: 'system:role:view',
      },
      {
        id: '2-3',
        title: '菜单管理',
        path: '/system/menu',
        icon: 'material-symbols:menu',
        parentId: '2',
        orderNum: 3,
        type: 'menu',
        permission: 'system:menu:view',
      },
    ],
  },
  {
    id: '3',
    title: '内容管理',
    path: '/content',
    icon: 'material-symbols:article-outline',
    orderNum: 3,
    type: 'menu',
    permission: 'content:view',
  },
])

// 菜单类型选项
const typeOptions = [
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' },
]

// 获取父菜单选项（扁平化，排除按钮类型）
const parentMenuOptions = computed(() => {
  const flatMenus: Array<{ label: string, value: string }> = []

  function flatten(menus: Menu[], prefix = '') {
    menus.forEach((menu) => {
      if (menu.type === 'menu') {
        flatMenus.push({
          label: prefix + menu.title,
          value: menu.id,
        })
        if (menu.children) {
          flatten(menu.children, `${prefix + menu.title} / `)
        }
      }
    })
  }

  flatten(dataSource.value)
  return [{ label: '无（顶级菜单）', value: '' }, ...flatMenus]
})

const { msgWarning, msgSuccess, msgError } = useMessage()

const loading = ref(false)
const modalVisible = ref(false)
const modalTitle = ref('添加菜单')
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
} = useZodForm(menuFormSchema, {
  title: '',
  path: '',
  icon: '',
  parentId: '',
  orderNum: 0,
  type: 'menu',
  permission: '',
})

function handleEdit(record: Menu) {
  editingId.value = record.id
  modalTitle.value = '编辑菜单'
  modalVisible.value = true

  // 填充表单数据
  formData.title = record.title
  formData.path = record.path
  formData.icon = record.icon || ''
  formData.parentId = record.parentId || ''
  formData.orderNum = record.orderNum
  formData.type = record.type
  formData.permission = record.permission || ''
}

function handleDelete(record: Menu) {
  msgWarning({ content: `删除菜单：${record.title}` })
}

function handleAdd() {
  editingId.value = null
  modalTitle.value = '添加菜单'
  modalVisible.value = true
  reset()
}

// 提交表单
function handleSubmit() {
  const result = validate()

  if (result.success) {
    if (editingId.value) {
      msgSuccess({ content: '菜单编辑成功！' })
    }
    else {
      // 添加逻辑
      const newMenu: Menu = {
        id: String(Date.now()),
        ...result.data,
        icon: result.data.icon || undefined,
        parentId: result.data.parentId || undefined,
        permission: result.data.permission || undefined,
      }
      dataSource.value.push(newMenu)
      msgSuccess({ content: '菜单添加成功！' })
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
      <h2 class="text-xl text-gray-800 font-semibold">
        菜单管理
      </h2>
      <AButton type="primary" @click="handleAdd">
        <template #icon>
          <CustomIcon icon="material-symbols:add" class="color-white m-[0_5px_3px_0] inline-block" />
        </template>
        添加菜单
      </AButton>
    </div>

    <ATable
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      row-key="id"
      :pagination="false"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'icon'">
          <div class="flex items-center justify-center">
            <CustomIcon v-if="record.icon" :icon="record.icon" :width="24" />
            <span v-else class="text-gray-400">-</span>
          </div>
        </template>

        <template v-else-if="column.key === 'type'">
          <ATag :color="record.type === 'menu' ? 'blue' : 'green'">
            {{ record.type === 'menu' ? '菜单' : '按钮' }}
          </ATag>
        </template>

        <template v-else-if="column.key === 'action'">
          <ASpace>
            <AButton type="link" size="small" @click="handleEdit(record as any)">
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

    <!-- 菜单表单模态框 -->
    <AModal
      v-model:open="modalVisible"
      :title="modalTitle"
      :width="700"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <AForm
        ref="formRef"
        :model="formData"
        :rules="allRules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 19 }"
      >
        <AFormItem
          label="菜单名称"
          name="title"
          :validate-status="hasFieldError('title') ? 'error' : ''"
          :help="getFieldError('title')"
        >
          <AInput
            v-model:value="formData.title"
            placeholder="请输入菜单名称 (2-20个字符)"
            @blur="() => validateField('title')"
          />
        </AFormItem>

        <AFormItem
          label="路径"
          name="path"
          :validate-status="hasFieldError('path') ? 'error' : ''"
          :help="getFieldError('path')"
        >
          <AInput
            v-model:value="formData.path"
            placeholder="例如: /system/user"
            @blur="() => validateField('path')"
          />
        </AFormItem>

        <AFormItem
          label="图标"
          name="icon"
          :validate-status="hasFieldError('icon') ? 'error' : ''"
          :help="getFieldError('icon')"
        >
          <AInput
            v-model:value="formData.icon"
            placeholder="例如: material-symbols:menu (选填)"
            @blur="() => validateField('icon')"
          />
        </AFormItem>

        <AFormItem
          label="父菜单"
          name="parentId"
          :validate-status="hasFieldError('parentId') ? 'error' : ''"
          :help="getFieldError('parentId')"
        >
          <ASelect
            v-model:value="formData.parentId"
            placeholder="请选择父菜单"
            :options="parentMenuOptions"
            @blur="() => validateField('parentId')"
          />
        </AFormItem>

        <AFormItem
          label="类型"
          name="type"
          :validate-status="hasFieldError('type') ? 'error' : ''"
          :help="getFieldError('type')"
        >
          <ASelect
            v-model:value="formData.type"
            placeholder="请选择类型"
            :options="typeOptions"
            @blur="() => validateField('type')"
          />
        </AFormItem>

        <AFormItem
          label="排序"
          name="orderNum"
          :validate-status="hasFieldError('orderNum') ? 'error' : ''"
          :help="getFieldError('orderNum')"
        >
          <AInputNumber
            v-model:value="formData.orderNum"
            placeholder="请输入排序 (0-9999)"
            :min="0"
            :max="9999"
            class="w-100%"
            @blur="() => validateField('orderNum')"
          />
        </AFormItem>

        <AFormItem
          label="权限标识"
          name="permission"
          :validate-status="hasFieldError('permission') ? 'error' : ''"
          :help="getFieldError('permission')"
        >
          <AInput
            v-model:value="formData.permission"
            placeholder="例如: system:menu:view (选填)"
            @blur="() => validateField('permission')"
          />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>
