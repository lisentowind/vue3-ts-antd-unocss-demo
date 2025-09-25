<script lang="ts" setup>
import type { FileActionEvent } from './config'
import { useFileDialog, useVModel } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { onMounted, ref, watch } from 'vue'
import { uploadFile } from '@/apis/modules/upload'
import { useCancelRequest, useMessage } from '@/hooks'
import { AllRegExp, BrowserTaskQueue } from '@/utils'
import { fetchDownload } from '@/utils/modules/fetch-download'

import UploadList from './components/upload-list.vue'
import UploadSelect from './components/upload-select.vue'

export type UploadListType = 'text' | 'picture' | 'picture-card'

export interface CustomUploadProps {
  files: FileListItem[]
  text?: string
  showText?: boolean
  listType?: UploadListType
  accept?: string // 接受的文件类型
  acceptString?: string // 接受的文件类型的描述
  verifyRegExp?: RegExp // 验证文件类型
  fileMaxSize?: number // 最大上传大小MB
  width?: string
  height?: string
  maxFile?: number // 最多上传文件数量
  maxConcurrency?: number // 并发上传数量
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
  maxFile: 5,
  maxConcurrency: 1,
  verifyRegExp: () => AllRegExp,
})

const emit = defineEmits<{
  (e: 'update:files'): void
}>()

const filesModel = useVModel(props, 'files', emit)
const { msgError, msgInfo } = useMessage()
const fileList = ref<FileListItem[]>([])
const { open, reset, onChange } = useFileDialog({
  accept: props.accept,
  multiple: true,
})

// 上传任务队列
const fileUpLoadQueue = new BrowserTaskQueue({
  concurrency: props.maxConcurrency,
})

// 监听任务失败
// fileUpLoadQueue.on('taskError', (task) => {
//   console.log('🚀 ~ taskError:', task)
// })

// 监听任务完成
// fileUpLoadQueue.on('taskComplete', (task) => {
//   console.log('🚀 ~ taskComplete:', task)
// })

const { cancelRequest, deleteRequest } = useCancelRequest()
function getFilePath(file: FileListItem) {
  return `/fileUpload/upload${file.uid}${file.file.type}`
}

function getBaseFile(file: FileListItem) {
  const baseFile = fileList.value.find(item => item.uid === file.uid)
  return baseFile
}

function cancelUpLoad(file: FileListItem, msg: string) {
  fileUpLoadQueue.cancelTask(file.uid)
  fileUpLoadQueue.removeTask(file.uid)
  cancelRequest(getFilePath(file), msg)
}

function deleteUploadFile(file: FileListItem, msg: string) {
  cancelUpLoad(file, msg)
  fileList.value = fileList.value.filter(item => item.uid !== file.uid)
}

const eventActionMap: Record<FileActionEvent, (v: FileListItem) => void> = {
  view: (v) => {
    if (v.url) {
      msgInfo({
        content: '查看文件',
      })
    }
  },
  download: (v) => {
    if (v.url) {
      fetchDownload(v.url, v.name, v.url.split('.').pop() ?? 'txt')
    }
  },
  continue: (v) => {
    console.log('continue', v)
  },
  pause: (v) => {
    console.log('pause', v)
  },
  cancel: (v) => {
    const baseFile = getBaseFile(v)
    if (baseFile) {
      cancelUpLoad(v, '取消上传')
      baseFile.status = 'error'
      baseFile.percent = 0
    }
  },
  reTry: (v) => {
    const baseFile = getBaseFile(v)
    if (baseFile) {
      cancelUpLoad(v, '重新上传')
      baseFile.status = 'uploading'
      baseFile.percent = 0
    }
    startUpLoadFile(v)
  },
  delete: (v) => {
    if (v.uid) {
      deleteUploadFile(v, '删除文件')
    }
  },
}

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
    const fileItem: FileListItem = {
      uid,
      status: 'uploading',
      name: fileName,
      file,
      percent: 0,
      type: file.type,
    }
    fileList.value.push({ ...fileItem })
    filesModel.value = [...fileList.value]
    startUpLoadFile(fileList.value[fileList.value.length - 1])
  }
  catch (error) {
    throw new Error(error as string)
  }
}

function handleAction(type: FileActionEvent, item: FileListItem) {
  const fn = eventActionMap[type]
  fn?.(item)
}

function startUpLoadFile(value: FileListItem) {
  const baseFile = getBaseFile(value)
  if (baseFile) {
    // 基础文件准备
    const file = baseFile.file as Blob
    const path = getFilePath(value)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'univ')
    // 添加文件上传任务到队列
    fileUpLoadQueue.add(
      async () => {
        const res = await uploadFile(
          formData,
          (percent) => {
            baseFile.percent = Number(Number(percent * 100).toFixed(2))
          },
          path,
        )

        if (res.data.msg === '操作成功') {
          baseFile.status = 'done'
          baseFile.url = res.data.data
          deleteRequest(path)
          return res
        }
        else {
          baseFile.status = 'error'
          throw new Error(`${baseFile.name} 上传失败`)
        }
      },
      { priority: 'normal', id: value.uid },
    )
  }
}

onChange((file) => {
  if (file) {
    // 可上传的剩余数量
    const remain = props.maxFile - fileList.value.length

    if (remain <= 0) {
      msgInfo({ content: `最多只能上传 ${props.maxFile} 个文件` })
      return
    }
    Object.entries(file)
      .slice(0, remain)
      .forEach(([_key, value]) => {
        beforeUpload(value)
      })
  }
})

watch(
  () => fileList.value,
  (v) => {
    filesModel.value = v
  },
  {
    deep: true,
    immediate: true,
  },
)

onMounted(() => {
  reset()
})
</script>

<template>
  <div class="custom-upload m-[5px_0]">
    <UploadSelect
      v-if="
        props.listType !== 'picture-card'
          ? fileList.length < props.maxFile
          : true
      "
      :text="props.text"
      :list-type="props.listType"
      :show-text="props.showText"
      :file-list="fileList"
      :max-file="props.maxFile"
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
    <TransitionGroup name="bounce-list">
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
