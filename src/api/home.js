/**
 *  首页请求相关模块
 */

import request from '@/utils/request'

export const getArticles = params => {
  return request({
    method: 'get',
    url: '/v1_1/articles',
    params
  })
}

// 刘老师的接口用这个api
// export const getArticles = params => {
//   return request({
//     method: 'get',
//     url: '/v1_1/articles',
//     params
//   })
// }
