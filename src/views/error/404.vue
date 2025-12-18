<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const userStore = useUserStore()

function goBack() {
  router.back()
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="error-404-page">
    <div class="content">
      <h1 class="error-code">404</h1>
      <p class="error-message">页面不存在</p>

      <div v-if="userStore.getUserRoles.includes('guest')" class="guest-tip">
        <p>作为访客用户，部分页面可能无权访问</p>
      </div>

      <div class="actions">
        <AButton @click="goBack">返回上一页</AButton>
        <AButton type="primary" @click="goHome">回到首页</AButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-404-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content {
  text-align: center;
  padding: 40px 20px;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #333;
  margin: 0 0 20px 0;
  line-height: 1;
}

.error-message {
  font-size: 20px;
  color: #666;
  margin: 0 0 30px 0;
}

.guest-tip {
  margin-bottom: 30px;
}

.guest-tip p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
</style>
