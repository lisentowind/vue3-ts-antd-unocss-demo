import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LOCALE_KEY } from '@/locale'
import { useMessage } from './useMessage'

const { msgSuccess } = useMessage()

export default function useLocale() {
  const i18 = useI18n()
  const currentLocale = computed(() => {
    return i18.locale.value
  })
  const changeLocale = (value: string) => {
    if (i18.locale.value === value) {
      return
    }
    i18.locale.value = value
    localStorage.setItem(LOCALE_KEY, value)
    msgSuccess({
      content: i18.t('app.action.locale'),
    })
  }
  return {
    currentLocale,
    changeLocale,
  }
}
