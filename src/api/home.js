/**
 *  首页请求相关模块
 */

import request from '@/utils/request'

export const getArticles = params => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}
