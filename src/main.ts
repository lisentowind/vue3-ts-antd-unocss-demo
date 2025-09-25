import { createApp } from 'vue'
import { setGlobalOptions } from 'vue-request'
import App from './App.vue'
import GlobalComponents from './components'
import directives from './directives'
import i18n from './locale'
import router from './router'
import pinia from './store'
import 'virtual:uno.css'
import 'ant-design-vue/dist/reset.css'
import '@/assets/style/global.less'
import '@/assets/style/transition.less'
import '@/utils/modules/echarts'

const app = createApp(App)

// 设置全局请求配置
setGlobalOptions({
  // arco-vue的loading组件暂时不支持delay配置
  // 所以这里需要设置vue-request的loadingKeep来保持loading的显示时间,防止loading导致页面闪烁
  // 详见https://cn.attojs.org/guide/documentation/loadingDelay.html#loadingkeep
  loadingKeep: 500,
  debounceInterval: 150,
})

app.use(GlobalComponents)
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(directives)
app.mount('#app')
