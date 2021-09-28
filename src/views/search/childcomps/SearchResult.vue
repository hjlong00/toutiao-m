<template>
  <div id='search-result'>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.art_id" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 请求页码
      perPage: 20
    }
  },
  methods: {
    async onLoad() {
      // 1,请求获取数据
      const { data: res } = await getSearchResult({
        page: this.page, // 搜索的页码
        per_page: this.perPage, // 每页数量,不传每页数量由后端决定
        q: this.searchText // 搜索的字符
      })

      // 2,将数据放进数组
      const { results } = res.data
      this.list.push(...results)

      // 3,关闭loading
      this.loading = false

      // 4,判断是否还有数据
      if (results.length) {
        // 有,页码加1继续获取
        this.page++
      } else {
        // 没有,加载结束
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
#search-result {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}
</style>
