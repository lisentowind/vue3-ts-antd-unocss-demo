<script lang="ts" setup>
import type { FileListItem } from '@/components/upload/customUpload.vue'
import { ref } from 'vue'

const p = ref<FileListItem[]>([])
const pc = ref<FileListItem[]>([])
</script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.5, duration: 0.3, y: 35, x: 0 },
    }"
    class="w-100%"
    direction="vertical"
  >
    <CustomUpload
      v-model:files="p"
      :can-drop-file="true"
      :max-concurrency="3"
      :max-retry-attempts="1"
      name="file"
      list-type="picture"
    />
    <!-- 默认比例裁剪 -->
    <CustomUpload
      v-model:files="pc"
      :can-drop-file="true"
      text="默认比例裁剪"
      name="avatar"
      list-type="picture-card"
    />
    <!-- 固定比例裁剪 -->
    <CustomUpload
      v-model:files="pc"
      :can-drop-file="true"
      :fixed="true"
      :fixed-box="false"
      :fixed-number="[1, 1]"
      text="固定比例裁剪"
      name="avatar"
      list-type="picture-card"
    />

    <CustomUpload
      v-model:files="p"
      text="插槽自定义😊"
      name="file"
      list-type="text"
    >
      <template #select="{ text, onSelectClick }">
        <div @click="onSelectClick">
          {{ text }}
        </div>
      </template>
    </CustomUpload>
  </ASpace>
</template>

<style lang="less" scoped></style>
