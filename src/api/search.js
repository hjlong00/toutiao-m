/**
 *  搜索请求相关模块
 */

import request from '@/utils/request'

export const getSearchSuggestions = q => request.get('/v1_0/suggestion', { params: { q } })

export const getSearchResult = params => request.get('/v1_0/search', { params })

// export const getSearchSuggestions = q => {
//   return request({
//     method: 'get',
//     url: '/v1_0/suggestion',
//     params: { q }
//   })
// }
