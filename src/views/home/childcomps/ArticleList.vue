<template>
  <div id='article-list'>
    <van-pull-refresh v-model="isRefreshLoading" :success-text="refreshSuccessText"
      :success-duration="1000" @refresh="onRefresh">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <article-item v-for="(item,i) in articlesList" :key="i" :title="item.title" :article=item />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import ArticleItem from '@/components/article-item'

import { getArticles } from '@/api/home'

export default {
  components: {
    ArticleItem
  },
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      isRefreshLoading: false, // 下拉刷新的loading状态
      articlesList: [], // 数据列表
      loading: false, // 控制加载中的 loading 状态
      finished: false, // 控制加载结束的状态
      pre_timestamp: null, // 请求数据的时间戳
      refreshSuccessText: '' // 下拉刷新成功的提示信息
    }
  },
  methods: {
    async onLoad() {
      /* List有以下三种状态,理解这些状态有助于你正确地使用List组件:
        非加载中,loading为false,此时会根据列表滚动位置判断是否触发load事件(列表内容不足一屏幕时,会直接触发)
        加载中,loading为true,表示正在发送异步请求,此时不会触发load事件
        加载完成,finished为true,此时不会触发load事件
        在每次请求完毕后,需要手动将loading设置为false,表示加载结束
       */
      // 异步请求更新数据
      // 加载状态结束
      // 数据全部加载完成
      const { data: res } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.pre_timestamp || Date.now(), // 这里是以时间戳来当页码用,请求数据.为什么? 后端定的
        with_top: 1
      })
      // console.log(res)
      const { results } = res.data
      // 把数据放到数组中
      this.articlesList.push(...results)
      // 本次loading结束,
      this.loading = false

      if (results.length) {
        // 将本次的时间戳保存,用于获取下一页数据
        this.pre_timestamp = res.data.pre_timestamp
      } else {
        // 返回的数组已经为空,说明没有数据可以更新了
        this.finished = true
      }
    },
    // 下拉刷新
    async onRefresh() {
      const { data: res } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 下拉刷新更新永远是当前时间戳
        with_top: 1
      })
      const { results } = res.data

      this.articlesList.unshift(...results)

      this.refreshSuccessText = `更新了${results.length}条数据`

      // 下拉更新结束
      this.isRefreshLoading = false
    }

  }
}
</script>

<style lang="less" scoped>
#article-list {
  position: fixed;
  top: 90px;
  bottom: 50px;

  left: 0;
  right: 0;

  overflow-y: auto; // 超过指定高度出现滚动条
}
</style>
