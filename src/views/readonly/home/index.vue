<script setup lang="ts">
import { ref } from 'vue'

const articles = ref([
  {
    id: 1,
    title: 'Vue3 最新特性介绍',
    description: '深入了解 Vue3 的组合式 API、响应式系统等核心特性',
    views: 1234,
    likes: 89,
    createdAt: '2024-01-01',
  },
  {
    id: 2,
    title: 'TypeScript 类型系统详解',
    description: '全面掌握 TypeScript 的类型系统和高级类型',
    views: 567,
    likes: 45,
    createdAt: '2024-01-02',
  },
  {
    id: 3,
    title: 'Vite 构建工具实践',
    description: '使用 Vite 构建现代化的前端项目',
    views: 890,
    likes: 67,
    createdAt: '2024-01-03',
  },
])
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">
        只读内容
      </h2>
      <p class="text-gray-500">
        欢迎访问只读模块，这里的内容仅供查看
      </p>
    </div>

    <div class="gap-6 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
      <div
        v-for="article in articles"
        :key="article.id"
        class="p-6 border border-gray-100 rounded-lg bg-white cursor-pointer shadow transition-shadow hover:shadow-lg"
      >
        <h3 class="text-lg font-semibold mb-2">
          {{ article.title }}
        </h3>
        <p class="text-sm text-gray-600 mb-4">
          {{ article.description }}
        </p>

        <div class="text-sm text-gray-500 flex items-center justify-between">
          <div class="flex gap-4 items-center">
            <div class="flex gap-1 items-center">
              <CustomIcon icon="material-symbols:visibility-outline" :width="16" />
              <span>{{ article.views }}</span>
            </div>
            <div class="flex gap-1 items-center">
              <CustomIcon icon="material-symbols:favorite-outline" :width="16" />
              <span>{{ article.likes }}</span>
            </div>
          </div>
          <span>{{ article.createdAt }}</span>
        </div>
      </div>
    </div>

    <div class="mt-8 p-6 border border-blue-200 rounded-lg bg-blue-50">
      <div class="flex gap-3 items-start">
        <CustomIcon icon="material-symbols:info-outline" :width="24" class="text-blue-500 mt-0.5" />
        <div>
          <h4 class="text-blue-900 font-semibold mb-1">
            提示
          </h4>
          <p class="text-sm text-blue-700">
            作为访客用户，您只能查看此模块的内容，无法进行编辑或删除操作。
            如需更多权限，请联系管理员。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
