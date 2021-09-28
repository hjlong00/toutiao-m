<template>
  <div id='search-suggestion'>
    <van-cell icon="search" v-for="(text,i) in suggetionList" :key="i"
      @click="$emit('search',text)">
      <div name="title" v-html="highline(text)">
      </div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 引用第三方库, 防抖函数
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    // 搜索词
    searchText: {
      tyep: String,
      required: true
    }
  },
  data() {
    return {
      suggetionList: [] // 搜索建议列表
    }
  },
  methods: {
    // 高亮搜索词
    highline(text) {
      return text.replace(new RegExp(this.searchText, 'gi'), `<span style="color:red">${this.searchText}</span>`)
    }
  },
  watch: {
    // 属性名: 要监视的数据的名称

    //  简写
    // searchText() {
    //   console.log('1111')
    // }

    // 完整写法
    searchText: {
      // 当数据发生变化则会执行 handler 函数
      // 使用 debounce 防抖,避免在输入时频繁发起请求
      handler: debounce(async function () {
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示

        const { data: res } = await getSearchSuggestions(this.searchText)
        this.suggetionList = res.data.options
      }, 300),

      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
</style>
