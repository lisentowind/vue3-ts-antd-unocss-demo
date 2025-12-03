<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const stats = ref([
  {
    title: '总用户数',
    value: '1,234',
    icon: 'material-symbols:person-outline',
    color: '#1890ff',
    trend: '+12%',
    trendUp: true,
  },
  {
    title: '今日访问',
    value: '567',
    icon: 'material-symbols:visibility-outline',
    color: '#52c41a',
    trend: '+8%',
    trendUp: true,
  },
  {
    title: '订单数',
    value: '890',
    icon: 'material-symbols:shopping-cart-outline',
    color: '#faad14',
    trend: '-3%',
    trendUp: false,
  },
  {
    title: '收入',
    value: '¥12,345',
    icon: 'material-symbols:payments-outline',
    color: '#f5222d',
    trend: '+25%',
    trendUp: true,
  },
])

const recentActivities = ref([
  { id: 1, user: '张三', action: '创建了新用户', time: '5分钟前' },
  { id: 2, user: '李四', action: '更新了文章内容', time: '10分钟前' },
  { id: 3, user: '王五', action: '删除了过期数据', time: '15分钟前' },
  { id: 4, user: '赵六', action: '修改了系统配置', time: '20分钟前' },
])
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">
        欢迎回来，{{ userStore.userInfo?.nickname }}！
      </h2>
      <p class="text-gray-500">
        这是您的工作台概览
      </p>
    </div>

    <!-- 统计卡片 -->
    <div class="mb-6 gap-6 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2">
      <div
        v-for="stat in stats"
        :key="stat.title"
        class="p-6 border border-gray-100 rounded-lg bg-white shadow"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">
              {{ stat.title }}
            </p>
            <p class="text-2xl font-bold">
              {{ stat.value }}
            </p>
          </div>
          <div
            class="rounded-full flex h-14 w-14 items-center justify-center"
            :style="{ backgroundColor: `${stat.color}20` }"
          >
            <CustomIcon :icon="stat.icon" :width="28" :style="{ color: stat.color }" />
          </div>
        </div>
        <div class="flex items-center">
          <CustomIcon
            :icon="stat.trendUp ? 'material-symbols:trending-up' : 'material-symbols:trending-down'"
            :width="16"
            :class="stat.trendUp ? 'text-green-500' : 'text-red-500'"
          />
          <span
            class="text-sm ml-1"
            :class="stat.trendUp ? 'text-green-500' : 'text-red-500'"
          >
            {{ stat.trend }}
          </span>
          <span class="text-sm text-gray-400 ml-2">vs 上周</span>
        </div>
      </div>
    </div>

    <div class="gap-6 grid grid-cols-1 lg:grid-cols-2">
      <!-- 最近活动 -->
      <div class="p-6 border border-gray-100 rounded-lg bg-white shadow">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-semibold">
            最近活动
          </h3>
          <AButton type="link" size="small">
            查看全部
          </AButton>
        </div>

        <AList :data-source="recentActivities" :split="false">
          <template #renderItem="{ item }">
            <AListItem>
              <div class="flex gap-3 w-full items-center">
                <AAvatar :style="{ backgroundColor: '#1890ff' }">
                  {{ item.user.charAt(0) }}
                </AAvatar>
                <div class="flex-1">
                  <p class="font-medium">
                    {{ item.user }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ item.action }}
                  </p>
                </div>
                <span class="text-sm text-gray-400">{{ item.time }}</span>
              </div>
            </AListItem>
          </template>
        </AList>
      </div>

      <!-- 快捷操作 -->
      <div class="p-6 border border-gray-100 rounded-lg bg-white shadow">
        <h3 class="text-lg font-semibold mb-4">
          快捷操作
        </h3>

        <div class="gap-4 grid grid-cols-2">
          <AButton size="large" class="flex flex-col gap-2 h-20 items-center justify-center">
            <CustomIcon icon="material-symbols:add-circle-outline" :width="24" />
            <span>新建用户</span>
          </AButton>

          <AButton size="large" class="flex flex-col gap-2 h-20 items-center justify-center">
            <CustomIcon icon="material-symbols:article-outline" :width="24" />
            <span>发布文章</span>
          </AButton>

          <AButton size="large" class="flex flex-col gap-2 h-20 items-center justify-center">
            <CustomIcon icon="material-symbols:settings-outline" :width="24" />
            <span>系统设置</span>
          </AButton>

          <AButton size="large" class="flex flex-col gap-2 h-20 items-center justify-center">
            <CustomIcon icon="material-symbols:analytics-outline" :width="24" />
            <span>数据报表</span>
          </AButton>
        </div>
      </div>
    </div>
  </div>
</template>
