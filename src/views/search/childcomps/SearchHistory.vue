<template>
  <div id='search-history'>
    <van-cell title="历史记录">
      <van-icon name="delete" v-if="!isDeleteShow" @click="isDeleteShow = true" />
      <div v-else>
        <span @click="delAll">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
    </van-cell>
    <van-cell :title="history" v-for="(history,i) in searchHistories" :key="i"
      @click="clickHandler(history,i)">
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    searchHistories: {
      type: Array
    }
  },
  data() {
    return {
      isDeleteShow: false
    }
  },
  methods: {
    delAll() {
      this.$emit('delAll', [])
    },
    clickHandler(history, i) {
      // 如果是删除状态,则执行删除
      if (this.isDeleteShow) {
        this.$emit('delOne', i)
        return
      }
      // 否则点击历史词进行搜索,展示搜索结果
      this.$emit('search', history)
    }

  }
}
</script>

<style lang="less" scoped>
</style>
