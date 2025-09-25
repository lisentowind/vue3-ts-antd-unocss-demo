<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue'
import type { FileActionEvent } from '../config'
import type { FileListItem } from '../customUpload.vue'
import { computed } from 'vue'
import { useThemeStore } from '@/store'
import { fileTypeMap } from '../config'

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
  icon: string
  name: string
  emit: any
}

const defaultBtn = computed<ListControlBtn[]>(() => [
  { id: 'view', icon: 'lets-icons:view', sort: 1, name: '预览', emit: 'view' },
  {
    id: 'download',
    icon: 'material-symbols:download',
    sort: 2,
    name: '下载',
    emit: 'download',
  },
  {
    id: 'continue',
    icon: 'uil:play',
    sort: 3,
    name: '继续/开始',
    emit: 'continue',
  },
  {
    id: 'pause',
    icon: 'material-symbols:pause',
    sort: 3,
    name: '暂停',
    emit: 'pause',
  },
  {
    id: 'cancel',
    icon: 'hugeicons:cancel-01',
    sort: 4,
    name: '取消',
    emit: 'cancel',
  },
  { id: 'reTry', icon: 'mynaui:redo', sort: 5, name: '重试', emit: 'reTry' },
  { id: 'delete', icon: 'mi:delete', sort: 6, name: '删除', emit: 'delete' },
])

// 获取后缀名称对应的文件类型
function getFileType(ext: string) {
  return fileTypeMap.get(ext)
}
// 获取文件后缀名
function getFileExt(fileName: string) {
  const index = fileName.lastIndexOf('.')
  return getFileType(fileName.substring(index + 1))
}

function getBtnArr(status: FileListItem['status']) {
  const allBtn: ListControlBtn[] = [defaultBtn.value[6]] // delete 永远显示
  const map: Record<string, number[]> = {
    uploading: [3, 4],
    error: [4, 5, 6],
    done: [1, 2],
  }
  const sorts = map[status] || []
  sorts.forEach((i) => {
    const btn = defaultBtn.value.find(b => b.sort === i)
    btn && allBtn.push(btn)
  })
  return allBtn.sort((a, b) => a.sort - b.sort)
}
</script>

<template>
  <div class="w-100%">
    <TransitionGroup name="list-y">
      <template v-for="file in props.fileList" :key="file.uid">
        <ARow
          class="group m-[5px_0] w-100% cursor-pointer border-1px border-transparent rounded-[8px] border-solid p-[10px_15px] transition-all hover:border-primary hover:bg-primary-1"
        >
          <ACol span="2" class="flex items-center justify-center">
            <CustomIcon
              :icon="`vscode-icons:file-type-${getFileExt(file.name)}`"
              width="20"
              height="20"
              :has-default-class="false"
            />
          </ACol>
          <ACol span="8" class="flex items-center justify-start">
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
              <template v-for="btn in getBtnArr(file.status)" :key="btn.name">
                <AButton
                  size="small"
                  type="primary"
                  shape="circle"
                  class="flex items-center justify-center"
                  :title="btn.name"
                  @click="() => emits(btn.emit, file)"
                >
                  <CustomIcon :icon="btn.icon" color="currentColor" />
                </AButton>
              </template>
            </ASpace>
          </ACol>
          <ACol span="6" offset="1" class="flex justify-end">
            <AProgress
              :status="file.status !== 'done' ? 'active' : 'success'"
              :percent="file.percent"
              :stroke-color="themeStore.getPrimaryColor"
            />
          </ACol>
        </ARow>
      </template>
    </TransitionGroup>
  </div>
</template>
