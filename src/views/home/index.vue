<template>
  <div id='home'>
    <van-nav-bar>
      <van-button slot="title" round icon-prefix="toutiao" icon="sousuo">搜索</van-button>
    </van-nav-bar>
    <van-tabs v-model="active">
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <article-list :channel="item"></article-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getChannels } from '@/api/user'
import ArticleList from './childcomps/ArticleList'

export default {
  components: { ArticleList },
  name: 'home',
  data() {
    return {
      active: 0,
      channels: []

    }
  },
  created() {
    this._getChannels()
  },
  methods: {
    async _getChannels() {
      const { data: res } = await getChannels()
      this.channels = res.data.channels
    }

  }
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  .van-nav-bar__title {
    max-width: unset;
    .van-button {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-button__icon {
        color: #fff;
        font-size: 18px;
      }
      .van-button__text {
        color: #fff;
        font-size: 14px;
      }
    }
  }
}
/deep/.van-tabs {
  .van-tab {
    border-right: 1px solid #edeff3;
    border-bottom: 1px solid #edeff3;
  }
  .van-tabs__line {
    background-color: #3296fa;
    width: 15px;
    height: 5;
    bottom: 20px;
  }
}
</style>
