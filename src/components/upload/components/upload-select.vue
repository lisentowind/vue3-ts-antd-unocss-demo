<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue'
import type { FileActionEvent } from '../config'
import type { CustomUploadProps, FileListItem } from '../customUpload.vue'
import { nanoid } from 'nanoid'
import UploadListCard from './upload-list-card.vue'

interface UploadSelectProps
  extends Pick<
    CustomUploadProps,
    'width' | 'height' | 'maxFile' | 'showTryAgainAllBtn'
  > {
  listType: UploadProps['listType']
  text: string
  showText: boolean
  fileList: FileListItem[]
  upLoadErrorFileLength?: number
}

const props = withDefaults(defineProps<UploadSelectProps>(), {
  maxFile: 5,
})

const emits = defineEmits<{
  (e: 'selectClick'): void
  (e: FileActionEvent, value: FileListItem): void
  (e: 'retryUpLoad'): void
}>()

const selectCardId = nanoid()
const showTryAgainAllCardId = nanoid()

function handelSelectClick() {
  emits('selectClick')
}

function handleAction(type: FileActionEvent, item: FileListItem) {
  emits(type, item)
}

function handelRetryUpLoad() {
  emits('retryUpLoad')
}
</script>

<template>
  <div class="upload-select">
    <div
      v-if="!$slots.CustomSelect"
      class="w-fit"
      :class="{ 'w-100%!': props.listType === 'picture-card' }"
    >
      <AButton
        v-if="props.listType !== 'picture-card'"
        @click="handelSelectClick"
      >
        <template #icon>
          <CustomIcon
            icon="fa6-solid:upload"
            color="currentColor"
            class="mr-5px"
          />
        </template>
        {{ props.text }}
      </AButton>

      <div
        v-else
        class="card flex flex-wrap items-center justify-start gap-10px"
      >
        <TransitionGroup name="bounce-list">
          <!-- card -->
          <UploadListCard
            v-for="file in props.fileList"
            :key="file.uid"
            :list="file"
            :width="props.width"
            :height="props.height"
            @view="(v) => handleAction('view', v)"
            @download="(v) => handleAction('download', v)"
            @cancel="(v) => handleAction('cancel', v)"
            @re-try="(v) => handleAction('reTry', v)"
            @delete="(v) => handleAction('delete', v)"
          />
          <div
            v-if="props.upLoadErrorFileLength && props.showTryAgainAllBtn"
            :key="showTryAgainAllCardId"
            class="group flex cursor-pointer items-center justify-center border-1px border-gray rounded-md border-solid transition-all hover:border-primary"
            :style="{ width: props.width, height: props.height }"
          >
            <ASpace
              v-if="props.listType === 'picture-card'"
              direction="vertical"
              class="select-space"
              @click="handelRetryUpLoad"
            >
              <CustomIcon
                icon="mynaui:redo-solid"
                width="25"
                height="25"
                class="group-hover:text-primary"
              />
              <span class="group-hover:text-primary"> 一键重试 </span>
            </ASpace>
          </div>
          <div
            v-if="props.fileList.length < props.maxFile"
            :key="selectCardId"
            class="group flex cursor-pointer items-center justify-center border-1px border-gray rounded-md border-dashed transition-all hover:border-primary"
            :style="{ width: props.width, height: props.height }"
            @click="handelSelectClick"
          >
            <ASpace direction="vertical" class="select-space">
              <CustomIcon
                icon="mi:add"
                width="25"
                height="25"
                class="group-hover:text-primary"
              />
              <span v-if="props.showText" class="group-hover:text-primary">
                {{ props.text }}
              </span>
            </ASpace>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <slot v-else name="CustomSelect">
    </slot>
  </div>
</template>

<style lang="less" scoped>
.select-space {
  :deep(.ant-space-item) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
