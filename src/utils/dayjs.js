/**
 * 初始化 dayjs 相关配置
 *
*/
import Vue from 'vue'
import dayjs from 'dayjs'

// 配置使用中文语言包
import 'dayjs/locale/zh-cn'

// 配置使用相对时间
import relativeTime from 'dayjs/plugin/relativeTime'

// 配置使用相对时间
dayjs.extend(relativeTime)

// 配置使用中文语言包
dayjs.locale('zh-cn')

// console.log()

// 把处理相对时间的代码包装为全局过滤器
// 然后就可以在任何组件的模板里使用了
// 所谓的过滤器其实就是一个可以在模板中使用的函数而已

Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

Vue.filter('dateFormat', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})
