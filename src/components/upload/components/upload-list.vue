<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue'
import type { FileListItem } from '../customUpload.vue'

interface UploadListProps {
  listType: UploadProps['listType']
  list: FileListItem[]
}

const props = defineProps<UploadListProps>()
</script>

<template>
  <div class="w-100%">
    <template v-for="file in props.list" :key="file.uid">
      <ARow
        class="m-[5px_0] w-100% cursor-pointer border-1px border-transparent rounded-[8px] border-solid p-[10px_15px] transition-all hover:border-primary hover:bg-primary-1"
      >
        <ACol span="3">
          图标
        </ACol>
        <ACol span="8">
          <ATypographyText
            class="w-100%"
            :ellipsis="{ tooltip: file.name }"
            :content="file.name"
          />
        </ACol>
        <ACol span="9">
          进度
        </ACol>
        <ACol span="4">
          操作
        </ACol>
      </ARow>
    </template>
  </div>
</template>

<style lang="less" scoped></style>
