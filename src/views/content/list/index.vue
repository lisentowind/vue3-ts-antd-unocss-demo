<script setup lang="ts">
import { ref } from 'vue'
import { useMessage } from '@/hooks'

interface Content {
  id: string
  title: string
  author: string
  category: string
  status: 'published' | 'draft'
  views: number
  createdAt: string
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '作者', dataIndex: 'author', key: 'author' },
  { title: '分类', dataIndex: 'category', key: 'category' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '浏览量', dataIndex: 'views', key: 'views' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '操作', key: 'action', width: 200 },
]

const dataSource = ref<Content[]>([
  {
    id: '1',
    title: 'Vue3 权限系统实现指南',
    author: '张三',
    category: '技术文章',
    status: 'published',
    views: 1234,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践',
    author: '李四',
    category: '技术文章',
    status: 'published',
    views: 567,
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    title: 'Ant Design Vue 组件库使用',
    author: '王五',
    category: '教程',
    status: 'draft',
    views: 89,
    createdAt: '2024-01-03',
  },
])

const { msgInfo, msgWarning } = useMessage()

const loading = ref(false)

function handleEdit(record: Content) {
  msgInfo({ content: `编辑内容：${record.title}` })
}

function handleDelete(record: Content) {
  msgWarning({ content: `删除内容：${record.title}` })
}

function handleView(record: Content) {
  msgInfo({ content: `查看内容：${record.title}` })
}
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-xl font-semibold">
        内容列表
      </h2>
      <ASpace>
        <AInputSearch placeholder="搜索内容" style="width: 200px" />
        <AButton type="primary">
          <template #icon>
            <CustomIcon
              icon="material-symbols:add"
              class="color-white m-[0_5px_3px_0] inline-block"
            />
          </template>
          创建内容
        </AButton>
      </ASpace>
    </div>

    <ATable
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      row-key="id"
      :pagination="{ pageSize: 10 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <ATag :color="record.status === 'published' ? 'green' : 'orange'">
            {{ record.status === 'published' ? '已发布' : '草稿' }}
          </ATag>
        </template>

        <template v-else-if="column.key === 'action'">
          <ASpace>
            <AButton
              type="link"
              size="small"
              @click="handleView(record as any)"
            >
              查看
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
  </div>
</template>
