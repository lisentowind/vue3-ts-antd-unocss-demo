<script lang="ts" setup>
import { reactive, useTemplateRef, watch } from 'vue'
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

export interface ImageCropperProps {
  file: string
  fixedBox?: boolean
  fixed?: boolean
  fixedNumber?: number[] // 截图框的宽高比例
}

const props = defineProps<ImageCropperProps>()
const emit = defineEmits<Emit>()

const cropperRef = useTemplateRef<InstanceType<typeof VueCropper>>('cropperRef')

const visible = defineModel<boolean>('modelValue')

const option = reactive({
  // 裁剪组件的基础配置option
  uid: '',
  img: '', // 裁剪图片的地址
  info: false, // 裁剪框的大小信息
  outputType: 'png', // 裁剪生成图片的格式
  autoCrop: true, // 是否默认生成截图框
  full: true, // 是否输出原图比例的截图
  canMoveBox: true, // 截图框能否拖动
})

interface Emit {
  (e: 'getImage', value: string): void
}

function confirmCropper() {
  if (cropperRef.value?.getCropData) {
    cropperRef.value.getCropData((base64: string) => {
      visible.value = false
      emit('getImage', base64)
    })
  }
}

watch(
  () => props.file,
  (file) => {
    option.img = file
  },
  {
    immediate: true,
    deep: 1,
  },
)
</script>

<template>
  <CustomModal
    v-model:model-value="visible"
    :width="650"
    async
    title="裁剪图片"
    @confirm="confirmCropper"
  >
    <div class="flex flex-wrap h-450px justify-center">
      <VueCropper
        ref="cropperRef"
        :auto-crop="option.autoCrop"
        :can-move-box="option.canMoveBox"
        :center-box="true"
        :fixed="props.fixed"
        :fixed-box="props.fixedBox"
        :fixed-number="props.fixedNumber"
        :full="option.full"
        :img="option.img"
        :info="option.info"
        :output-type="option.outputType"
      />
    </div>

    <template #modal-footer="{ onOk, onCancel }">
      <div class="flex w-100% justify-end">
        <AButton @click="onCancel">
          取消
        </AButton>
        <AButton type="primary" @click="onOk">
          确定
        </AButton>
      </div>
    </template>
  </CustomModal>
</template>

<style lang="less" scoped></style>
