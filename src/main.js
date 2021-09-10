import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/index.less' // 导入全局样式表

import Vant from 'vant' // 导入Vant组件
import 'vant/lib/index.css' // 导入Vant组件样式文件

import 'amfe-flexible' // 动态设置 REM 基准值

Vue.config.productionTip = false // 关闭生产模式下给出的提示

Vue.use(Vant) // 使用Vant - !目前为完全导入方式

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
