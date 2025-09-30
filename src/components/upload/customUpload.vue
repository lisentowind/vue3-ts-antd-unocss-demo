<script lang="ts" setup>
import type { FileActionEvent } from './config'
import { useDropZone, useFileDialog, useVModel } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { nanoid } from 'nanoid'
import { onMounted, ref, useTemplateRef, watch } from 'vue'
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
  showTryAgainAllBtn?: boolean // 显示一键重试按钮
  canDropFile?: boolean // 允许拖拽上传
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
  text: '点击上传',
  showText: true,
  listType: 'text',
  accept:
    '.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.gz,.7z,.tar,.png,.jpg,.mp4,',
  acceptString:
    '.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.gz,.7z,.tar,.png,.jpg,.mp4',
  fileMaxSize: 10,
  width: '100px',
  height: '100px',
  maxFile: 5,
  maxConcurrency: 1,
  verifyRegExp: () => AllRegExp,
  showTryAgainAllBtn: false,
  canDropFile: false,
})

const emit = defineEmits<{
  (e: 'update:files'): void
}>()

const filesModel = useVModel(props, 'files', emit)
const { msgError, msgInfo } = useMessage()
const fileList = ref<FileListItem[]>([])
// 点击上传
const { open, reset, onChange } = useFileDialog({
  accept: props.accept,
  multiple: true,
})
// 拖拽上传
const uploadDropZoneRef = useTemplateRef('uploadDropZoneRef')
const { isOverDropZone } = useDropZone(uploadDropZoneRef, {
  onDrop,
  multiple: true,
  preventDefaultForUnhandled: false,
})

function onDrop(files: File[] | null) {
  if (!props.canDropFile) {
    msgInfo({
      content: '未开启拖拽上传功能',
    })
    return
  }
  if (files) {
    // 可上传的剩余数量
    const remain = props.maxFile - fileList.value.length

    if (remain <= 0) {
      msgInfo({ content: `最多只能上传 ${props.maxFile} 个文件` })
      return
    }
    files.slice(0, remain).forEach((file) => {
      beforeUpload(file)
    })
  }
}

// 上传任务队列
const fileUpLoadQueue = new BrowserTaskQueue({
  concurrency: props.maxConcurrency,
})

const upLoadErrorFile = ref<FileListItem[]>([])

// 监听任务失败
fileUpLoadQueue.on('taskError', ({ task }) => {
  const errorItem = fileList.value.find(item => item.uid === task.id)
  if (
    errorItem
    && !upLoadErrorFile.value.some(item => item.uid === task.id)
  ) {
    upLoadErrorFile.value.push(cloneDeep(errorItem))
  }
})

// 监听任务完成
fileUpLoadQueue.on('taskComplete', ({ task }) => {
  upLoadErrorFile.value = upLoadErrorFile.value.filter(
    item => item.uid !== task.id,
  )
})

function handelRetryUpLoad() {
  if (!upLoadErrorFile.value.length)
    return

  upLoadErrorFile.value.forEach((item) => {
    const baseFile = getBaseFile(item)
    if (baseFile) {
      // 重置状态
      baseFile.status = 'uploading'
      baseFile.percent = 0
      // 重新上传
      startUpLoadFile(baseFile)
    }
  })

  // 重试之后清空错误列表（避免重复展示“一键重试”按钮）
  upLoadErrorFile.value = []
}

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
  upLoadErrorFile.value = upLoadErrorFile.value.filter(
    item => item.uid !== file.uid,
  )
}

const imagePreviewUrl = ref<string>('')
const visible = ref<boolean>(false)

function setVisible(value: boolean) {
  visible.value = value
}

const eventActionMap: Record<FileActionEvent, (v: FileListItem) => void> = {
  view: (v) => {
    if (v.url) {
      imagePreviewUrl.value = v.url
      setVisible(true)
    }
    else {
      msgInfo({
        content: '上传未完成的图片不能查看',
      })
    }
  },
  download: (v) => {
    if (v.url) {
      fetchDownload(v.url, v.name, v.url.split('.').pop() ?? 'txt')
    }
    else {
      msgInfo({
        content: '上传未完成的图片不能下载',
      })
    }
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

onChange((file: any) => {
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
        beforeUpload(value as any)
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
  <div ref="uploadDropZoneRef" class="custom-upload relative m-[5px_0]">
    <UploadSelect
      v-if="
        props.listType !== 'picture-card'
          ? fileList.length < props.maxFile
          : true
      "
      :file-list="fileList"
      :height="props.height"
      :is-over-drop-zone="isOverDropZone && props.canDropFile"
      :list-type="props.listType"
      :max-file="props.maxFile"
      :show-text="props.showText"
      :show-try-again-all-btn="props.showTryAgainAllBtn"
      :text="props.text"
      :up-load-error-file-length="upLoadErrorFile.length"
      :width="props.width"
      @cancel="(v) => handleAction('cancel', v)"
      @delete="(v) => handleAction('delete', v)"
      @download="(v) => handleAction('download', v)"
      @view="(v) => handleAction('view', v)"
      @select-click="selectClick"
      @re-try="(v) => handleAction('reTry', v)"
      @retry-up-load="handelRetryUpLoad"
    >
      <template v-if="$slots.select" #CustomSelect>
        <slot
          :file-list="fileList"
          :height="props.height"
          :is-over-drop-zone="isOverDropZone"
          :list-type="props.listType"
          :max-file="props.maxFile"
          :on-cancel="(v: FileListItem) => handleAction('cancel', v)"
          :on-delete="(v: FileListItem) => handleAction('delete', v)"
          :on-download="(v: FileListItem) => handleAction('download', v)"
          :on-re-try="(v: FileListItem) => handleAction('reTry', v)"
          :on-retry-up-load="handelRetryUpLoad"
          :on-select-click="selectClick"
          :on-view="(v: FileListItem) => handleAction('view', v)"
          :show-text="props.showText"
          :show-try-again-all-btn="props.showTryAgainAllBtn"
          :text="props.text"
          :up-load-error-file-length="upLoadErrorFile.length"
          :width="props.width"
          name="select"
        >
        </slot>
      </template>
    </UploadSelect>
    <div
      v-if="upLoadErrorFile.length && props.showTryAgainAllBtn"
      class="m-[5px_0]"
    >
      <AButton
        v-if="props.listType !== 'picture-card'"
        @click="handelRetryUpLoad"
      >
        <template #icon>
          <CustomIcon
            class="mr-5px"
            color="currentColor"
            icon="material-symbols:redo-rounded"
          />
        </template>
        一键重试
      </AButton>
    </div>
    <TransitionGroup name="bounce-list">
      <UploadList
        v-if="fileList.length && props.listType !== 'picture-card'"
        :file-list="fileList"
        :list-type="props.listType"
        @cancel="(v) => handleAction('cancel', v)"
        @delete="(v) => handleAction('delete', v)"
        @download="(v) => handleAction('download', v)"
        @view="(v) => handleAction('view', v)"
        @re-try="(v) => handleAction('reTry', v)"
      />
    </TransitionGroup>
    <AImage
      :preview="{
        visible,
        onVisibleChange: setVisible,
      }"
      :src="imagePreviewUrl"
      :style="{ display: 'none' }"
      :width="0"
    />
  </div>
</template>

<style lang="less" scoped>
.custom-upload {
  :deep(.ant-image) {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
