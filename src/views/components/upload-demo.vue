<script lang="ts" setup>
import type { FileListItem } from '@/components/upload/customUpload.vue'
import { ref } from 'vue'

const p = ref<FileListItem[]>([])
const pL = ref<FileListItem[]>([])
</script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.5, duration: 0.3, y: 35, x: 0 },
    }"
    class="w-100%"
    direction="vertical"
  >
    <CustomUpload v-model:files="p" name="file" list-type="picture" />
    <CustomUpload
      v-model:files="pL"
      name="avatar"
      list-type="picture-card"
      :show-text="false"
    />
  </ASpace>
</template>

<style lang="less" scoped></style>
