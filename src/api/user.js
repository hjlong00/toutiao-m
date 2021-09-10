/**
 *  用户请求相关模块
 */

import request from '@/utils/request'

// 用户登录
export const userLogin = data => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 获取验证码请求
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}
