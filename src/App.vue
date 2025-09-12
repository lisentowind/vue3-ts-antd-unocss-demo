<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="h-100vh w-100vw flex items-center justify-center">
    <div
      class="[background-image:linear-gradient(45deg,#60a5fa,#a78bfa,#ec4899)] h-500px w-500px flex items-center justify-center rounded-md"
    >
      <span class="text-5xl text-white">1</span>
      <Icon size="25px" color="white" icon="tabler:align-box-center-middle-filled" />
    </div>
  </div>
</template>

<style scoped lang="less">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
