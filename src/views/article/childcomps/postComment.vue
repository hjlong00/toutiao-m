<template>
  <div id='post-comment'>
    <van-field v-model.trim="message" autosize type="textarea" maxlength="50" placeholder="请输入评论"
      show-word-limit />
    <van-button text="发布" size="small" round @click="postComment" :disabled="!message" />
  </div>
</template>

<script>
import { postComment } from '@/api/comment'

export default {
  name: 'PostComment',
  props: {
    target: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    async postComment() {
      const { data: res } = await postComment({
        target: this.target.toString(), // 评论的目标id(评论文章即为文章id,对评论进行回复则为评论id)
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null // 文章id,对评论内容发表回复时,需要传递此参数,表明所属文章id.对文章进行评论,不要传此参数.
      })
      // console.log(res.data)
      // 发布评论成功, 发送自定义事件通知父组件,同时把返回的数据一起带出去
      this.$emit('postCommentSuccess', res.data.new_obj)

      this.$toast.success('发布评论成功')

      // 发布成功 清空输入框
      this.message = ''
    }
  }
}
</script>

<style lang='less' scoped>
#post-comment {
  display: flex;
  align-items: center;
  padding: 10px;
  .van-field {
    background-color: #f4f5f6;
    border-radius: 5px;
  }
  .van-button {
    margin: 5px;
    width: 50px;
  }
}
</style>
