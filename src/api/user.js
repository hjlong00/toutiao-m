/**
 *  用户请求相关模块
 */

import request from '@/utils/request'
// import store from '@/store/'

// 用户登录
export const userLogin = data => {
  return request({
    method: 'post',
    url: '/v1_0/authorizations',
    data
  })
}
// 获取验证码请求
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 获取用户频道列表
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}
// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    method: 'get',
    url: '/v1_0/user/profile'
  })
}
// 编辑用户个人资料
export const updateUserProfile = data => {
  return request({
    method: 'patch',
    url: '/v1_0/user/profile',
    data
  })
}
// 编辑用户个人头像
export const updateUserPhoto = data => {
  return request({
    method: 'patch',
    url: '/v1_0/user/photo',
    data
  })
}
