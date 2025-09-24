<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue'

interface UploadSelectProps {
  listType: UploadProps['listType']
  text: string
  showText: boolean
}

const props = withDefaults(defineProps<UploadSelectProps>(), {})

const emits = defineEmits<{
  (e: 'selectClick'): void
}>()

function handelSelectClick() {
  emits('selectClick')
}
</script>

<template>
  <div class="upload-select" @click="handelSelectClick">
    <div v-if="!$slots.CustomSelect" class="w-fit">
      <AButton v-if="props.listType !== 'picture-card'">
        <template #icon>
          <CustomIcon
            icon="fa6-solid:upload"
            color="currentColor"
            class="mr-5px"
          />
        </template>
        {{ props.text }}
      </AButton>
      <ASpace v-else>
        <div
          class="group h-100px w-100px flex cursor-pointer items-center justify-center border-1px border-gray rounded-md border-dashed transition-all hover:border-primary"
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
      </ASpace>
    </div>
    <slot v-else name="CustomSelect">
    </slot>
  </div>
</template>

<style lang="less" scoped></style>
