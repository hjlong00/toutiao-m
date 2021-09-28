<template>
  <div id='comment-list'>
    <van-cell title="全部评论" />
    <van-list v-model="loading" :finished="finished"
      :finished-text="list.length === 0?'还没有评论,来抢沙发吧':'已展示所有评论'" @load="onLoad">
      <comment-item v-for="(comment,i) in list" :key="i" :comment="comment" :replybtn="replybtn"/>
    </van-list>
  </div>
</template>

<script>
import commentItem from './commentItem.vue'
import { getArticleComments } from '@/api/comment'

export default {
  components: { commentItem },
  name: 'CommentList',
  props: {
    source: {
      type: [String, Number, Object],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    // 是否显示回复按钮
    replybtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页的页码
      limitL: 10 // 每页大小
    }
  },
  methods: {
    async onLoad() {
      // 1,拿到评论数据
      const { data: res } = await getArticleComments({
        type: this.type, // 评论类型,a-对文章(article)的评论,c-对评论(comment)的回复
        source: this.source.toString(), // 源id,文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量,值为评论id,表示从此id的数据向后取,不传表示从第一页开始读取数据
        limitL: this.limitL // 获取的评论数据个数,不传表示采用后端服务设定的默认每页数据量
      })
      // console.log(res)
      // 2,把数据push 进 list 数组
      const { results } = res.data
      this.list.push(...results)
      // 把评论总数发送给父组件
      this.$emit('totalCount', res.data.total_count)

      // 3,关闭 loading
      this.loading = false

      // 4,判断还有没有数据
      if (results.length) {
        // 有,把页码设置一下
        this.offset = res.data.last_id
      } else {
        // 没有,那就 finished
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.comment-title {
  width: 100%;
  font-size: 14px;
  margin-left: 20px;
  border-bottom: 1px solid #ccc;
}
</style>
