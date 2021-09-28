<template>
  <div id='search-index'>
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search v-model.trim="searchText" show-action placeholder="请输入搜索关键词" @search="onSearch"
        @cancel="$router.back()" @focus="isResultShow = false" />
    </form>

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch" />

    <!-- 历史记录 -->
    <search-history v-else @search="onSearch" :search-histories="searchHistories"
      @delAll="searchHistories = $event" @delOne="searchHistories.splice($event,1)" />

  </div>
</template>

<script>
import SearchHistory from './childcomps/SearchHistory.vue'
import SearchResult from './childcomps/SearchResult.vue'
import SearchSuggestion from './childcomps/SearchSuggestion.vue'
import { getItem, setItem } from '@/utils/storage'

export default {
  components: { SearchSuggestion, SearchHistory, SearchResult },
  name: 'SearchIndex',
  data() {
    return {
      searchText: '',
      isResultShow: false,
      searchHistories: getItem('search-histories') || []
    }
  },
  watch: {
    // 监听搜索历史数组的数据变化,随时保存到本地
    searchHistories() {
      setItem('search-histories', this.searchHistories)
    }
  },
  methods: {
    onSearch(val) {
      // 去除搜索词的前后空格符
      const v = val.trim()
      // 查找历史记录里是否有当前搜索词
      const index = this.searchHistories.indexOf(v)
      if (v) {
        // 设置搜索词
        this.searchText = v

        // 如果历史记录里有,则先删除
        if (index !== -1) {
          this.searchHistories.splice(index, 1)
        }

        // 添加历史记录,并放在数组顶部
        this.searchHistories.unshift(v)

        // 展示搜索结果
        this.isResultShow = true
      } else {
        // 如果用户输入无效搜索词,让 searchText 设置回默认值
        this.searchText = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-form {
  // position: fixed;
  // top: 54px;
  // left: 0;
  // right: 0;
  .van-search {
    background: #3296fa;
    .van-search__content {
      border-radius: 5px;
    }
    .van-search__action {
      color: #fff;
      font-size: 14px;
    }
  }
}
</style>
