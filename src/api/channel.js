/**
 *  频道推荐请求相关模块
 */

import request from '@/utils/request'

export const getAllChannels = () => request.get('/v1_0/channels')

export const updateUserChannels = channels => {
  return request({
    method: 'put',
    url: '/v1_0/user/channels',
    data: { channels }
  }
  )
}

// export const userLogin = data => {
//   return request({
//     method: 'post',
//     url: '/v1_0/authorizations',
//     data
//   })
// }
