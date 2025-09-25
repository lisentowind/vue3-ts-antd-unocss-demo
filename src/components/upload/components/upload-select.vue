<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue'
import type { FileActionEvent } from '../config'
import type { CustomUploadProps, FileListItem } from '../customUpload.vue'
import UploadListCard from './upload-list-card.vue'

interface UploadSelectProps
  extends Pick<CustomUploadProps, 'width' | 'height'> {
  listType: UploadProps['listType']
  text: string
  showText: boolean
  fileList: FileListItem[]
}

const props = withDefaults(defineProps<UploadSelectProps>(), {})

const emits = defineEmits<{
  (e: 'selectClick'): void
  (e: FileActionEvent, value: FileListItem): void
}>()

function handelSelectClick() {
  emits('selectClick')
}

function handleAction(type: FileActionEvent, item: FileListItem) {
  emits(type, item)
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

      <div v-else class="card flex flex-wrap items-center justify-start gap-10px">
        <TransitionGroup name="list-y">
          <!-- card -->
          <UploadListCard
            v-for="file in props.fileList"
            :key="file.uid"
            :list="file"
            :width="props.width"
            :height="props.height"
            @view="(v) => handleAction('view', v)"
            @download="(v) => handleAction('download', v)"
            @continue="(v) => handleAction('continue', v)"
            @pause="(v) => handleAction('pause', v)"
            @cancel="(v) => handleAction('cancel', v)"
            @re-try="(v) => handleAction('reTry', v)"
            @delete="(v) => handleAction('delete', v)"
          />

          <div
            :key="new Date().getTime()"
            class="group h-100px w-100px flex cursor-pointer items-center justify-center border-1px border-gray rounded-md border-dashed transition-all hover:border-primary"
            @click="handelSelectClick"
          >
            <ASpace direction="vertical">
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

<style lang="less" scoped></style>
