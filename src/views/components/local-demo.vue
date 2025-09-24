<script lang='ts' setup>
import { ref, watch } from 'vue'
import useLocale from '@/hooks/modules/useLocale'
import { LOCALE_OPTIONS } from '@/locale'

const { currentLocale, changeLocale } = useLocale()
const localeLanguage = ref(currentLocale.value)

watch(
  () => localeLanguage.value,
  (v) => {
    changeLocale(v)
  },
)
</script>

<template>
  <ASelect
    v-model:value="localeLanguage"
    :options="LOCALE_OPTIONS"
    class="w-150px"
  />
</template>

<style lang='less' scoped>

</style>
