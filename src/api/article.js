/**
 *  文章请求相关模块
 */

import request from '@/utils/request'

// 获取文章详情
export const getArticle = id => request.get(`/v1_0/articles/${id}`)

// 关注用户
export const followAuthor = target => request.post('/v1_0/user/followings', { target })

// 取消关注
export const unFollowAuthor = target => request.delete(`/v1_0/user/followings/${target}`)

// 收藏文章
export const collectionArticle = target => request.post('/v1_0/article/collections', { target })

// 取消收藏文章
export const unCollectionArticle = target => request.delete(`/v1_0/article/collections/${target}`)

// 点赞文章
export const likeArticle = target => request.post('/v1_0/article/likings', { target })

// 取消点赞文章
export const unLikeArticle = target => request.delete(`/v1_0/article/likings/${target}`)
