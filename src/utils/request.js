import axios from 'axios'
import store from '@/store/'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'
import router from '@/router'

// 重定向到login页面
const redirectLogin = () => router.replace({
  name: 'login',
  // 传递查询参数, 查询参数会以 ? 作为分隔符放到url后面
  query: {
    // redirect 是数据名,自己起
    // router.currentRoute 和在组件里用 this.$route 一样,但这里不是组件
    redirect: router.currentRoute.fullPath
  }
})

// token刷新专用请求实例
const refreshTokenReq = axios.create({
  baseURL: ''
})

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/',
  // baseURL: 'http://www.liulongbin.top:8000/'
  baseURL: '',
  // timeout: 5000

  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话,那么 JSONbig.parse 调用就会报错
    // 所以我们用 try-catch 来捕获异常, 处理异常的发生
    try {
      // 如果转换成功,则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转换失败', err)
      // 如果转换失败了, 则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// Add a request interceptor
request.interceptors.request.use(config => {
  // Do something before request is sent
  const { user } = store.state

  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 返回处理过的 config
  return config
}, err => {
  // Do something with request error
  // return Promise.reject(err)
  console.log(err)
})

// 响应拦截器
request.interceptors.response.use(
  // 响应成功的拦截,在2xx范围内的任何状态代码都会触发此函数,主要用于处理响应数据
  response => {
    return response
  },
  // 响应失败的拦截,任何超出2xx范围的任何状态代码都会触发此函数,这里主要用于处理响应错误
  async err => {
    console.dir(err)
    const { status } = err.response

    if (status === 400) { // 客户端请求参数异常
      Toast.fail('客户端请求参数异常')
    } else if (status === 401) { // token已过期
      // 1,如果没有 user || user.token , 跳转 login 页面
      const { user } = store.state
      if (!user || !user.token) {
        return redirectLogin() // 重定向到login页面
      }
      // 2,如果有 refresh_token , 则请求获取新的 token
      try {
        const { data: res } = await refreshTokenReq({
          method: 'put',
          url: '/v1_0/authorizations',
          headers: { Authorization: `Bearer ${user.refresh_token}` }
        })
        console.log(res)
        // 3,拿到新 token 之后更新到容器里
        user.token = res.data.token
        store.commit('setUser', user)
        // 4,把失败的请求重新发出去
        return request(err.config)
      } catch (e) {
        redirectLogin()
      }
    } else if (status === 403) { // 没有权限
      Toast.fail('没有权限')
    } else if (status === 404) { // 资源不存在
      Toast.fail('网页不存在')
    } else if (status >= 500) { // 服务器异常
      Toast.fail('服务器异常,请稍后重试')
    }

    // 将未处理的异常往外抛
    return Promise.reject(err)
  })

export default request
