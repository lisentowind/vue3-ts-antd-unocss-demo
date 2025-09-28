<script lang="ts" setup></script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.1, duration: 0.3, y: 35, x: 0 },
    }"
  >
    <CustomIcon size="30px" icon="material-symbols:lock-open-right-outline-rounded" />
    <CustomIcon size="30px" icon="line-md:github" />
    <CustomIcon size="30px" icon="material-symbols:my-location-outline-rounded" />
  </ASpace>
</template>

<style lang="less" scoped></style>
