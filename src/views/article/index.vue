<template>
  <div id='article-index' ref="articleIndex">
    <van-nav-bar left-arrow @click-left="$router.back()" title="文章详情" />
    <div class="article-body" ref="articleBody">
      <h1 class="title">{{article.title}}</h1>

      <van-cell center :border="false" class="author-info">
        <van-image class="avatar" slot="icon" round fit="cover"
          :src="article.aut_photo" />
        <div slot="title" class="name">
          {{article.aut_name}}
        </div>
        <div slot="label" class="pubdate">
          {{article.pubdate | relativeTime}}
        </div>
        <van-button size="small" round :icon="(article.is_followed? '' : 'plus')"
          :type="(article.is_followed? 'default':'info')" class="follow-btn"
          @click="onFollow" :loading="isFollowLoading">
          {{ article.is_followed? '已关注':'关注'}}</van-button>
      </van-cell>

      <!-- 正文部分 -->
      <div class="markdown-body" v-html="article.content" ref="articleContent" />
      <!-- 评论区域 -->
      <comment-list :source="articleId" @totalCount="totalCount = $event"
        ref="commentLIst" />
    </div>
    <!-- 底部栏 -->
    <div class="article-bottom">
      <van-button type="default" size="small" round text='写评论'
        @click="commentPopupShow = true" />
      <van-icon name="comment-o" :badge="totalCount?totalCount:''" color="#777"
        @click="getCommentLIstScrollTop" />
      <van-icon :name="(article.is_collected?'star': 'star-o')"
        :style="{color:article.is_collected?'#FFD700': '#777'}" @click="onCollect" />
      <van-icon :name="article.attitude === 1 ? 'good-job':'good-job-o'"
        :color="article.attitude === 1 ?'#FF4500':'#777'" @click="onLike" />
      <van-icon name="share" color="#777" />
    </div>

    <!-- 发布评论,评论弹出层 -->

    <van-popup v-model="commentPopupShow" position="bottom" round>
      <post-comment :target="articleId" @postCommentSuccess="postCommentSuccess" />
    </van-popup>

    <!-- 回复评论,回复评论的评论弹出层 -->
    <van-popup v-model="replyCommentPopupShow" position="bottom" round
      :style="{ height: '90%' }">
      <!-- 这里用 v-if 是为了可以让组件关闭的时候可以销毁,达到清空数据的目的,防止组件不重新渲染导致数据不会重新加载的问题 -->
      <reply-comment v-if="replyCommentPopupShow" :comment="replyCommentdata"
        :article-id="articleId" @close="replyCommentPopupShow = false" />
    </van-popup>

  </div>
</template>

<script>
import './github-markdown.css'
import { getArticle, followAuthor, unFollowAuthor, collectionArticle, unCollectionArticle, likeArticle, unLikeArticle } from '@/api/article'
import { ImagePreview } from 'vant'
import commentList from './childcomps/commentList.vue'
import PostComment from './childcomps/postComment.vue'
import ReplyComment from './childcomps/replyComment.vue'

export default {
  components: { commentList, PostComment, ReplyComment },
  name: 'ArticleIndex',
  /*
    在组件中获取动态路由参数:
    方式一: this.$route.params.articleId
    方式二: 在路由里设置 props 传参, 推荐改方法,因为能使组件耦合度更低
  */
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章数据
      isFollowLoading: false, // 关注用户时的loading效果,避免重复点击
      isCollectLoading: false, // 收藏时的loading效果,避免重复点击
      totalCount: '', // 评论数量
      commentPopupShow: false, // 评论弹出层开关
      replyCommentPopupShow: false, // 评论的评论弹出层开关
      replyCommentdata: {} // 评论的评论展示数据
    }
  },
  created() {
    this._getArticle()
    this.$EventBus.$on('replyComment', (comment) => {
      this.replyCommentdata = comment
      this.replyCommentPopupShow = true
    })
  },
  methods: {
    async _getArticle() {
      const { data: res } = await getArticle(this.articleId)
      // console.log(res)
      this.article = res.data

      // 数据改变试图不是立即执行的,所以要获取DOM节点就要用到nextTick方法
      // this.$nextTick(callback)
      this.$nextTick(() => {
        this.handlerPerviewImage()
      })
    },
    // 图片预览
    handlerPerviewImage() {
      // 获取文章正文 DOM 容器
      const articleContent = this.$refs.articleContent
      // 获取正文里所以 img 节点
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs)

      // 定义一个数组,里面放每个img的地址
      const imgPaths = []
      // 给每个img添加点击事件
      imgs.forEach((img, i) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          ImagePreview({
            images: imgPaths, // 预览图片路径表
            startPosition: i, // 起始位置,点第几张,就从第几张开始
            loop: false // 禁止循环预览
          })
        }
      })
    },
    // 关注操作
    async onFollow() {
      this.isFollowLoading = true

      if (this.article.is_followed) {
        // 已关注, 点击取消关注
        await unFollowAuthor(this.article.aut_id)
      } else {
        // 未关注, 点击关注
        await followAuthor(this.article.aut_id)
      }

      this.article.is_followed = !this.article.is_followed

      this.isFollowLoading = false
    },
    // 收藏操作
    async onCollect() {
      // loading toast 防止重复点击
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁用背景点击
      })
      if (this.article.is_collected) {
        // 已收藏, 点击取消收藏
        await unCollectionArticle(this.articleId)
      } else {
        // 未收藏, 点击收藏
        await collectionArticle(this.articleId)
      }
      // 更新数据
      this.article.is_collected = !this.article.is_collected
      // toast信息提醒
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    // 点赞操作
    async onLike() {
      // loading toast 防止重复点击
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁用背景点击
      })
      if (this.article.attitude === 1) {
        // 已点赞, 点击取消点赞
        await unLikeArticle(this.articleId)
        this.article.attitude = -1
      } else {
        // 未点赞, 点击点赞
        await likeArticle(this.articleId)
        this.article.attitude = 1
      }

      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    // 发布评论成功后的数据更新操作
    postCommentSuccess(comment) {
      // 实时更新数据,把数据加到子组件的list数组里
      this.$refs.commentLIst.list.unshift(comment)
      // 评论数也要加1,更新评论数
      this.totalCount++
      // 关闭评论输入框
      this.commentPopupShow = false
    },
    // 点击评论图标,跳到评论的位置
    getCommentLIstScrollTop() {
      const cmmentOffsetTop = this.$refs.commentLIst.$el.offsetTop
      this.$refs.articleBody.scrollTop = cmmentOffsetTop
    }
  },
  // 组件销毁的时候 也关闭 $EventBus 监听
  destroyed() {
    this.$EventBus.$off()
  }
}
</script>

<style lang="less" scoped>
#article-index {
  .article-body {
    background-color: #fff;
    position: fixed;
    top: 46px;
    bottom: 45px;
    left: 0;
    right: 0;
    overflow-y: auto;
    .title {
      font-size: 20px;
      color: #3a3a3a;
      padding: 15px;
    }

    .author-info {
      .avatar {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .name {
        font-size: 12px;
        color: #333;
      }
      .pubdate {
        font-size: 12px;
        color: #b4b4b4;
      }
      .follow-btn {
        width: 85px;
        height: 30px;
        font-size: 14px;
        // color: #fff;
        // background-color: #3296fa;
        // border: none;
      }
    }

    .markdown-body {
      padding: 14px;
    }
  }
  .article-bottom {
    border-top: 1px solid #d8d8d8;
    height: 44px;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    display: flex;
    justify-content: space-around;
    align-items: center;
    .van-button {
      width: 140px;
      height: 22px;
      .van-button__content {
        color: #a7a7a7;
        justify-content: flex-start;
      }
    }
    .van-icon {
      font-size: 22px;
    }
  }
}
</style>
