import axios from 'axios'
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/',
  timeout: 5000
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

export default request
