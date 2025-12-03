<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

onBeforeMount(() => {
  const { params, query } = route
  const { path } = params
  router.replace({ path: `/${path as string}`, query })
})
</script>

<template>
  <div></div>
</template>
