// 评论的评论
<template>
  <div id='reply-comment'>
    <!-- 头部信息 -->
    <van-nav-bar :title="`${comment.reply_count}条评论`" :border="false">
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <div class="content-wrap">
      <!-- 主评论 -->
      <comment-item :comment="comment" :replybtn="false" />
      <!-- 评论的评论 -->
      <comment-list :source="comment.com_id" type="c" :replybtn="false" ref="commentList" />
      <!-- 底部 -->
    </div>
    <van-button block text="回复评论" @click="commentPopupShow = true" />

    <!-- 评论弹出层 -->
    <van-popup v-model="commentPopupShow" position="bottom" round>
      <post-comment :target="comment.com_id" :article-id="articleId"
        @postCommentSuccess="postCommentSuccess" />
    </van-popup>
  </div>
</template>

<script>
import commentItem from './commentItem.vue'
import CommentList from './commentList.vue'
import PostComment from './postComment.vue'

export default {
  components: { commentItem, CommentList, PostComment },
  name: 'ReplyComment',
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, Object, String],
      required: true
    }
  },
  data() {
    return {
      commentPopupShow: false
    }
  },
  methods: {
    // 监听评论发布成功事件
    postCommentSuccess(comment) {
      // 评论数据更新
      this.$refs.commentList.list.unshift(comment)
      // 评论数量加一
      this.comment.reply_count++
      // 关闭评论弹出层
      this.commentPopupShow = false
    }
  }

}
</script>

<style lang="less" scoped>
#reply-comment {
  height: 100%;
  .van-nav-bar {
    background-color: #fff;
    /deep/.van-nav-bar__title {
      color: #333;
    }
  }
  .content-wrap {
    position: fixed;
    top: 116px;
    bottom: 44px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }
  .van-button {
    position: fixed;
    bottom: 0;
  }
}
</style>
