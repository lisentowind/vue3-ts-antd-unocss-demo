<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue'
import type { VNode } from 'vue'
import type { FileActionEvent } from '../config'
import type { FileListItem } from '../customUpload.vue'
import { useThemeStore } from '@/store'
import { defaultBtn, fileTypeMap } from '../config'

interface UploadListProps {
  listType: UploadProps['listType']
  fileList: FileListItem[]
}

const props = defineProps<UploadListProps>()

const emits = defineEmits<{
  (e: FileActionEvent, value: FileListItem): void
}>()

const themeStore = useThemeStore()

export type ListControlBtn = {
  id: string
  sort: number
  icon: () => VNode
  name: string
  emit: any
}

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
  <div class="w-100%">
    <TransitionGroup name="bounce-list">
      <template v-for="file in props.fileList" :key="file.uid">
        <ARow
          class="group m-[5px_0] p-[10px_15px] border-1px border-transparent rounded-[8px] border-solid w-100% cursor-pointer transition-all hover:border-primary hover:bg-primary-1"
          :class="{
            'bg-error-1': file.status === 'error',
            'hover:bg-error-1': file.status === 'error',
          }"
        >
          <ACol span="1" class="flex items-center justify-center">
            <CustomIcon
              :icon="`vscode-icons:file-type-${getFileExt(file.name)}`"
              width="20"
              height="20"
              :has-default-class="false"
            />
          </ACol>
          <ACol span="9" offset="1" class="flex items-center justify-start">
            <ATypographyText
              class="w-100%"
              :ellipsis="{ tooltip: file.name }"
              :content="file.name"
            />
          </ACol>
          <ACol span="7" class="flex items-center justify-right">
            <ASpace
              class="opacity-0 transition-opacity group-hover:opacity-100"
            >
              <template
                v-for="btn in getBtnArr(file.status, file.name)"
                :key="btn.name"
              >
                <AButton
                  size="small"
                  type="primary"
                  shape="circle"
                  class="flex items-center justify-center"
                  :title="btn.name"
                  @click="() => emits(btn.emit, file)"
                >
                  <component :is="btn.icon" />
                </AButton>
              </template>
            </ASpace>
          </ACol>
          <ACol span="5" offset="1" class="flex justify-end">
            <AProgress
              :status="
                file.status === 'uploading'
                  ? 'active'
                  : file.status === 'error'
                    ? 'exception'
                    : 'success'
              "
              :percent="file.percent"
              :stroke-color="
                file.status === 'error' ? undefined : themeStore.getPrimaryColor
              "
            />
          </ACol>
        </ARow>
      </template>
    </TransitionGroup>
  </div>
</template>
