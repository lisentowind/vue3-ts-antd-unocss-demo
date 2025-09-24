<script lang="ts" setup>
import { useRequest } from 'vue-request'
import { getPostInfo } from '@/apis/modules/mock'
import { useMessage } from '@/hooks'

const { msgSuccess } = useMessage()
const { run, loading } = useRequest(getPostInfo, {
  manual: true,
  onSuccess(res) {
    if (res.data) {
      msgSuccess({
        content: '接口响应成功!',
      })
    }
  },
})
function handelFetch() {
  run('1')
}
</script>

<template>
  <AButton type="primary" :loading="loading" @click="handelFetch">
    {{ $t('app.event.fetch') }}
  </AButton>
</template>

<style lang="less" scoped></style>
