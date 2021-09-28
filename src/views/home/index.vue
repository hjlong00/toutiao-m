<template>
  <div id='home'>

    <van-nav-bar>
      <van-button slot="title" round icon-prefix="toutiao" icon="sousuo" to="search">搜索
      </van-button>
    </van-nav-bar>

    <van-tabs v-model="active">
      <van-tab :title="item.name" v-for="item in userChannels" :key="item.id">
        <article-list :channel="item"></article-list>
      </van-tab>
      <!-- 汉堡 按钮定位把列表最后的位置给挡住了,解决办法是在这里再添加一个占位元素. 可以添加多个同名插槽 -->
      <div class="emptyTab" slot="nav-right"></div>
      <!-- 用插槽添加 汉堡 图标 -->
      <div class="wap-nav-wrap" slot="nav-right"
        @click="isChanlEditShow = !isChanlEditShow">
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>

    <!-- 弹出层 -->
    <van-popup class="chanledit-popup" position="bottom" v-model="isChanlEditShow"
      closeable close-icon-position="top-left" get-container="body">
      <!-- 模板中的 $event 表示事件的参数 -->
      <channel-edit :userChannels="userChannels" @close="isChanlEditShow = false"
        @switchChannel="active = $event" :active="active" />
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './childcomps/ArticleList.vue'
import ChannelEdit from './childcomps/ChannelEdit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  components: { ArticleList, ChannelEdit },
  name: 'home',
  data() {
    return {
      active: 0, // 控制被激活的标签
      userChannels: [], // 频道列表
      isChanlEditShow: false // 弹出层开关

    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    this._getUserChannels()
  },
  methods: {
    // 获取用户频道
    async _getUserChannels() {
      let channels = []
      // 1,是否处于登录状态?
      if (this.user) {
        // 登录了,请求获取线上的用户频道列表数据
        const { data: res } = await getUserChannels()
        channels = res.data.channels
      } else {
        // 2,没有登录?
        const localChannels = getItem('local-channels')
        // 3,那本地有没有存档?
        if (localChannels) {
          // 有,那就把本地数据赋值给 channels 使用
          channels = localChannels
        } else {
          // 4,本地没有存档,那就发起请求获取推荐频道, 注意,这里的请求是不带token的,所以返回的是系统推荐的频道
          const { data: res } = await getUserChannels()
          channels = res.data.channels
        }
      }

      // 把处理好的数据放到 data 中以供模板使用
      this.userChannels = channels
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
  // 占位元素
  .emptyTab {
    flex-shrink: 0;
    width: 32px;
  }
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    opacity: 0.9;
    display: flex;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 24px;
    }
    &:before {
      content: '';
      width: 1px;
      height: 43px;
      background: url('~@/assets/img/line.png') no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      right: 0;
    }
  }
}

.chanledit-popup {
  height: 95%;
  width: 100%;
  border-radius: 20px 20px 0 0;
}
</style>
