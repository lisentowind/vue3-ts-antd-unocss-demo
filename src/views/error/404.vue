<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="bg-gray-50 flex min-h-screen items-center justify-center">
    <div class="text-center">
      <CustomIcon
        icon="material-symbols:error-outline"
        :width="120"
        class="text-gray-400 mb-8"
      />
      <h1 class="text-6xl text-gray-800 font-bold mb-4">
        404
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        抱歉，您访问的页面不存在
      </p>
      <div class="space-x-4">
        <AButton size="large" @click="goBack">
          返回上一页
        </AButton>
        <AButton type="primary" size="large" @click="goHome">
          回到首页
        </AButton>
      </div>
    </div>
  </div>
</template>
