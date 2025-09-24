<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { useMessage } from '@/hooks'
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
}

export type FileListItem = {
  uid: string
  status: 'uploading' | 'done' | 'error'
  name: string
  file: File
  url?: string
}
const props = withDefaults(defineProps<CustomUploadProps>(), {
  text: '上传',
  showText: true,
  listType: 'text',
  accept: '.doc,.docx,.pdf,.xls,.xlsx',
  acceptString: 'xlsx',
  fileMaxSize: 10,
  verifyRegExp: () =>
    /(pdf|msword|ms-excel|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/i,
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
    const uid = `${new Date().getTime()}`
    fileList.value.push({ uid, status: 'uploading', name: fileName, file })
  }
  catch (error) {
    throw new Error(error as string)
  }
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
  <div class="custom-upload">
    <UploadSelect
      class="w-fit"
      :text="props.text"
      :list-type="props.listType"
      :show-text="props.showText"
      @select-click="selectClick"
    >
      <template v-if="$slots.select" #CustomSelect>
        <slot name="select">
        </slot>
      </template>
    </UploadSelect>
    <TransitionGroup name="fade">
      <UploadList
        v-if="fileList.length"
        :list="fileList"
        :list-type="props.listType"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="less" scoped></style>
