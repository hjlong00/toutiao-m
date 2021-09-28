<template>
  <div id='comment-item'>
    <van-cell>
      <div slot="icon" class="avatar">
        <van-image round fit="cover" :src="comment.aut_photo" />
      </div>
      <div slot="title">
        <div class="title">
          <div class="name">{{comment.aut_name}}</div>
          <div class="like" @click="onLike">
            <van-icon class="icon" :name="comment.is_liking? 'good-job':'good-job-o'"
              :class="{liked:comment.is_liking}" />
            <span class="like_count">{{comment.like_count?comment.like_count:'&nbsp;' }}</span>
          </div>
        </div>
        <div class="content">
          {{comment.content}}
        </div>
        <div class="time">
          <span class="pubdate">{{comment.pubdate | dateFormat}}</span>
          <van-button v-if="replybtn" class="btn" size="mini" round
            @click="$EventBus.$emit('replyComment',comment)">
            {{comment.reply_count?comment.reply_count:''}}回复</van-button>
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import { likeComment, unLikeComment } from '@/api/comment'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    },
    // 是否显示回复按钮
    replybtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 给评论点赞
    async onLike() {
      const commentId = this.comment.com_id.toString()
      if (this.comment.is_liking) {
        // 已点赞,进行取消点赞操作
        await unLikeComment(commentId)
        this.comment.like_count--
      } else {
        // 没点赞,进行点赞操作
        await likeComment(commentId)
        this.comment.like_count++
      }
      // 更新试图
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>

<style lang="less" scoped>
#comment-item {
  .van-cell {
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 13px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        font-size: 13px;
        color: #406599;
      }
      .like {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
          font-size: 15px;
        }
        .liked {
          color: #ff4500;
        }
        .like_count {
          font-size: 10px;
        }
      }
    }
    .content {
      font-size: 16px;
      color: #222;
      padding-top: 16px;
      padding-bottom: 16px;
    }
    .time {
      display: flex;
      align-items: center;
      .pubdate {
        font-size: 10px;
        color: #222;
        margin-right: 10px;
      }
      .btn {
        width: 65px;
        height: 23px;
        background-color: #f4f5f6;
      }
    }
  }
}
</style>
