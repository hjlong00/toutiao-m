/**
 *  频道推荐请求相关模块
 */

import request from '@/utils/request'

export const getAllChannels = () => request.get('/v1_0/channels')

// 添加已登录的用户频道
export const addUserChannels = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/channels',
    data
  })
}

// 删除已登录的用户频道
export const delUserChannels = channelId => {
  return request({
    method: 'delete',
    url: `v1_0/user/channels/${channelId}`
  })
}

// 刘老师api
// export const updateUserChannels = channels => {
//   return request({
//     method: 'put',
//     url: '/v1_0/user/channels',
//     data: { channels }
//   }
//   )
// }

// export const userLogin = data => {
//   return request({
//     method: 'post',
//     url: '/v1_0/authorizations',
//     data
//   })
// }
