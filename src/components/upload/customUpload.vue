<script lang="ts" setup>
import type { FileActionEvent } from './config'
import { useFileDialog } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { onMounted, ref } from 'vue'
import { useMessage } from '@/hooks'
import { AllRegExp } from '@/utils'
import UploadList from './components/upload-list.vue'
import UploadSelect from './components/upload-select.vue'

export type UploadListType = 'text' | 'picture' | 'picture-card'

export interface CustomUploadProps {
  text?: string
  showText?: boolean
  listType?: UploadListType
  accept?: string // 接受的文件类型
  acceptString?: string // 接受的文件类型的描述
  verifyRegExp?: RegExp // 验证文件类型
  fileMaxSize?: number // 最大上传大小MB
  width?: string
  height?: string
}

export type FileListItem = {
  uid: string
  status: 'uploading' | 'done' | 'error'
  name: string
  percent: number
  file: File
  type: string
  url?: string
}
const props = withDefaults(defineProps<CustomUploadProps>(), {
  text: '上传',
  showText: true,
  listType: 'text',
  accept: '.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip,.png,.jpg,.mp4,',
  acceptString: 'xlsx',
  fileMaxSize: 10,
  width: '100px',
  height: '100px',
  verifyRegExp: () => AllRegExp,
})
const { msgError } = useMessage()
const fileList = ref<FileListItem[]>([])
const { open, reset, onChange } = useFileDialog({
  accept: props.accept,
  multiple: true,
})

function selectClick() {
  open()
}

function beforeUpload(file: File) {
  try {
    const checkType = props.verifyRegExp.test(file.type)

    const sizeOk = file.size / 1024 / 1024 <= props.fileMaxSize
    if (!checkType) {
      msgError({
        content: `上传的文件只能是${props.acceptString}格式!`,
      })

      return
    }
    if (!sizeOk) {
      msgError({
        content: `上传的文件大小不能超过 ${props.fileMaxSize}MB!`,
      })
      return
    }
    const fileName = file.name
    const uid = `${new Date().getTime() + nanoid()} `
    fileList.value.push({
      uid,
      status: 'uploading',
      name: fileName,
      file,
      percent: 0,
      type: file.type,
    })
  }
  catch (error) {
    throw new Error(error as string)
  }
}

const eventActionMap: Record<FileActionEvent, (v: FileListItem) => void> = {
  view: (v) => {
    console.log('view', v)
  },
  download: (v) => {
    if (v.url) {
      console.log('download', v)
    }
  },
  continue: (v) => {
    console.log('continue', v)
  },
  pause: (v) => {
    console.log('pause', v)
  },
  cancel: (v) => {
    console.log('cancel', v)
  },
  reTry: (v) => {
    console.log('reTry', v)
  },
  delete: (v) => {
    if (v.uid) {
      fileList.value = fileList.value.filter(item => item.uid !== v.uid)
    }
  },
}

function handleAction(type: FileActionEvent, item: FileListItem) {
  const fn = eventActionMap[type]
  fn?.(item)
}

onChange((file) => {
  if (file) {
    Object.entries(file).forEach(([_key, value]) => {
      beforeUpload(value)
    })
  }
})

onMounted(() => {
  reset()
})
</script>

<template>
  <div class="custom-upload m-[5px_0]">
    <UploadSelect
      :text="props.text"
      :list-type="props.listType"
      :show-text="props.showText"
      :file-list="fileList"
      :width="props.width"
      :height="props.height"
      @select-click="selectClick"
      @view="(v) => handleAction('view', v)"
      @download="(v) => handleAction('download', v)"
      @continue="(v) => handleAction('continue', v)"
      @pause="(v) => handleAction('pause', v)"
      @cancel="(v) => handleAction('cancel', v)"
      @re-try="(v) => handleAction('reTry', v)"
      @delete="(v) => handleAction('delete', v)"
    >
      <template v-if="$slots.select" #CustomSelect>
        <slot name="select">
        </slot>
      </template>
    </UploadSelect>
    <TransitionGroup name="fade">
      <UploadList
        v-if="fileList.length && props.listType !== 'picture-card'"
        :file-list="fileList"
        :list-type="props.listType"
        @view="(v) => handleAction('view', v)"
        @download="(v) => handleAction('download', v)"
        @continue="(v) => handleAction('continue', v)"
        @pause="(v) => handleAction('pause', v)"
        @cancel="(v) => handleAction('cancel', v)"
        @re-try="(v) => handleAction('reTry', v)"
        @delete="(v) => handleAction('delete', v)"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="less" scoped></style>
