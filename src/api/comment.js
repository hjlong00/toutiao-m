/**
 *  文章评论请求相关模块
 */

import request from '@/utils/request'

// 获取文章评论
export const getArticleComments = params => request.get('/v1_0/comments', { params })

// 点赞评论
export const likeComment = target => request.post('/v1_0/comment/likings', { target })

// 取消点赞评论
export const unLikeComment = target => request.delete(`/v1_0/comment/likings/${target}`)

// 添加评论
export const postComment = data => {
  return request({
    method: 'post',
    url: '/v1_0/comments',
    data
  })
}
