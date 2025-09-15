<script lang="ts" setup>
import { useMessage, useModal } from './hooks'

// 引入全局消息组件
const { msgContextHolder } = useMessage()
// 引入全局模态框组件 函数式的简单弹窗
const { modalContextHolder } = useModal()
</script>

<template>
  <a-config-provider>
    <msgContextHolder />
    <modalContextHolder />
    <router-view v-slot="{ Component }">
      <transition mode="out-in" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </a-config-provider>
</template>

<style lang="less" scoped></style>
