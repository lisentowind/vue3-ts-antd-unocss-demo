<script lang="ts" setup>
import type { IconProps } from '@iconify/vue'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface CustomIconProps extends IconProps {
  hasDefaultClass?: boolean
}

const props = withDefaults(defineProps<CustomIconProps>(), {
  hasDefaultClass: true,
})

const defaultClass = computed(() => {
  return props.hasDefaultClass ? 'icon-default' : ''
})
</script>

<template>
  <Icon v-bind="{ ...props }" :class="defaultClass" />
</template>

<style lang="less" scoped></style>
