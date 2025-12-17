<script lang="ts" setup>
import type { FileActionEvent } from '../config'
import type { CustomUploadProps, FileListItem } from '../customUpload.vue'
import type { ListControlBtn } from './upload-list.vue'
import { computed } from 'vue'
import { useThemeStore } from '@/store'
import { defaultBtn, fileTypeMap } from '../config'

interface UploadListCardProps
  extends Pick<CustomUploadProps, 'width' | 'height'> {
  list: FileListItem
}

const props = defineProps<UploadListCardProps>()

const emits = defineEmits<{
  (e: FileActionEvent, value: FileListItem): void
}>()

const themeStore = useThemeStore()

const isImage = computed(() => {
  return getFileExt(props.list.name) === 'image'
})

// 获取后缀名称对应的文件类型
function getFileType(ext: string) {
  return fileTypeMap.get(ext)
}
// 获取文件后缀名
function getFileExt(fileName: string) {
  const index = fileName.lastIndexOf('.')
  return getFileType(fileName.substring(index + 1))
}

function getBtnArr(
  status: FileListItem['status'],
  fileName: FileListItem['name'],
) {
  const fileType = getFileExt(fileName)
  const allBtn: ListControlBtn[] = [defaultBtn.value[4]] // delete 永远显示
  const map: Record<string, number[]> = {
    uploading: [3, 4],
    error: fileType === 'image' ? [1, 4] : [4],
    done: fileType === 'image' ? [1, 2] : [2],
  }
  const sorts = map[status] || []
  sorts.forEach((i) => {
    const btn = defaultBtn.value.find(b => b.sort === i)
    if (btn) {
      allBtn.push(btn)
    }
  })
  return allBtn.sort((a, b) => a.sort - b.sort)
}
</script>

<template>
  <div
    class="p-5px border-1px border-primary rounded-md border-solid flex cursor-pointer transition-all items-center justify-center relative hover:border-primary hover:bg-primary-1"
    :style="{ width: props.width, height: props.height }"
    :class="{
      'bg-error-1': props.list.status === 'error',
      'hover:bg-error-1': props.list.status === 'error',
      'border-error-1!': props.list.status === 'error',
      'hover:border-error-1': props.list.status === 'error',
    }"
  >
    <ASpace
      v-if="!isImage || (isImage && props.list.status !== 'done')"
      direction="vertical"
      class="info flex h-100% w-100% items-center justify-center"
    >
      <AProgress
        class="progress-right mr-0"
        type="circle"
        :size="18"
        :show-info="false"
        :status="
          props.list.status === 'uploading'
            ? 'active'
            : props.list.status === 'error'
              ? 'exception'
              : 'success'
        "
        :percent="props.list.percent"
        :stroke-color="
          props.list.status === 'error' ? undefined : themeStore.getPrimaryColor
        "
      />
      <CustomIcon
        :icon="`vscode-icons:file-type-${getFileExt(props.list.name)}`"
        width="20"
        height="20"
        :has-default-class="false"
      />
      <ATypographyText
        class="text-center w-80px"
        :ellipsis="{ tooltip: props.list.name }"
        :content="props.list.name"
      />
    </ASpace>
    <AImage
      v-else-if="isImage && props.list.status === 'done'"
      class="rounded-md left--1px top--1px absolute"
      :width="props.width"
      :height="props.height"
      :preview="true"
      :src="props.list.url"
    />
    <!-- hover层级 -->
    <div
      class="card-hover pb-10px border-1px border-primary rounded-md border-solid flex items-center left--1px top--1px justify-center absolute"
      :style="{ width: props.width, height: props.height }"
    >
      <ASpace wrap>
        <template
          v-for="btn in getBtnArr(props.list.status, props.list.name)"
          :key="btn.id"
        >
          <AButton
            size="small"
            type="primary"
            shape="circle"
            class="flex items-center justify-center"
            :title="btn?.name"
            @click="() => emits(btn.emit, props.list)"
          >
            <component :is="btn.icon" />
          </AButton>
        </template>
      </ASpace>
    </div>
  </div>
</template>

<style lang="less" scoped>
.info {
  :deep(.ant-space-item:has(.progress-right)) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 0 !important;
  }
}

.card-hover {
  z-index: 99;
  opacity: 0;
  &:hover {
    opacity: 1;
    transition: all 0.3s;
    cursor: pointer;
    backdrop-filter: blur(5px);
  }
}

.card-progress {
  opacity: 1;
  z-index: 98;
  backdrop-filter: blur(5px);
}
</style>
