<script lang="ts" setup></script>

<template>
  <ASpace
    v-gsap="{
      options: { delay: 0.5, duration: 0.3, y: 35, x: 0 },
    }"
    class="w-100%"
    direction="vertical"
  >
    <CustomUpload name="file" list-type="picture" />
    <CustomUpload name="avatar" list-type="picture-card" :show-text="false" />
    <CustomUpload name="text" list-type="text" />
    <CustomUpload name="text" list-type="text">
      <template #select>
        自定义
      </template>
    </CustomUpload>
  </ASpace>
</template>

<style lang="less" scoped></style>
