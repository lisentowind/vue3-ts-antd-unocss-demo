<script lang="ts" setup>
import type { IconProps } from '@iconify/vue'
import { Icon } from '@iconify/vue'

interface CustomIconProps extends IconProps {}

const props = defineProps<CustomIconProps>()
</script>

<template>
  <Icon v-bind="{ ...props }" class="icon-default" />
</template>

<style lang="less" scoped></style>
