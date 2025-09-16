import { createI18n } from 'vue-i18n'

interface LanguageModule {
  [key: string]: string
}
export type LanguageAll = Record<string, { default: LanguageModule }>

export const LOCALE_OPTIONS = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]

export const LOCALE_KEY = 'locale'

const defaultLocale = localStorage.getItem(LOCALE_KEY) || 'zh-CN'

const enAll = import.meta.glob('./en-US/**/*.json', {
  eager: true,
}) as LanguageAll
const cnAll = import.meta.glob('./zh-CN/**/*.json', {
  eager: true,
}) as LanguageAll

const en = Object.values(enAll).reduce((m, v) => {
  return { ...m, ...v.default }
}, {})

const cn = Object.values(cnAll).reduce((m, v) => {
  return { ...m, ...v.default }
}, {})

const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'zh-CNS',
  legacy: false,
  allowComposition: true,
  messages: {
    'en-US': {
      ...en,
    },
    'zh-CN': {
      ...cn,
    },
  },
})

export default i18n
