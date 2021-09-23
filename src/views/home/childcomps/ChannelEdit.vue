<template>
  <div id='channel-edit'>
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div class="channel-title" slot="title">我的频道</div>
      <van-button size="mini" round plain type="danger" @click="isEdit = !isEdit">
        {{isEdit? '完成':'编辑'}}</van-button>
    </van-cell>

    <van-grid :gutter="10" :border="false">
      <van-grid-item :icon="(isEdit && i !== 0 && userChannels.length > 2) ? 'close' : ''"
        v-for="(Channels,i) in userChannels" :key="Channels.id" :text="Channels.name"
        @click="userChannelClick(i)" :class="{active : (i === active && isEdit !== true) }" />
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div class="channel-title" slot="title">频道推荐</div>
    </van-cell>

    <van-grid :gutter="10" :border="false">
      <van-grid-item v-for="Channels in recommendChannels" :key="Channels.id"
        :text="`+ ${Channels.name}`" @click="addChannel(Channels)" />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, updateUserChannels } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      require: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  created() {
    this._getAllChannels()
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      // 思路:所有频道 - 我的频道 = 剩下的频道
      // filter 方法: 过滤数据,根据方法返回的布尔值 true 来收集数据,最后返还新数组
      return this.allChannels.filter(channel => {
        // 判断 channel 是否属于用户频道
        // find 方法查找满足添条件的单个元素, find 返回值,找不到就返回undefined
        // 在用户频道列表里找有没有 channel
        return !this.userChannels.find(userChannel => {
          // 找到满足该条件的元素
          return userChannel.id === channel.id
        })
      })
    }
  },
  methods: {
    // 获取所有频道
    async _getAllChannels() {
      const { data: res } = await getAllChannels()
      this.allChannels = res.data.channels
    },
    // 封装更新用户频道列表数据方法
    async _updateUserChannels() {
      // 1,准备要提交到服务器的数据
      const channels = this.userChannels.map((item, index) => {
        return {
          id: item.id,
          seq: index
        }
      })

      // 2,发起请求
      await updateUserChannels(channels)
    },
    // 添加频道
    addChannel(channel) {
      this.userChannels.push(channel)

      // 数据持久化
      if (this.user) {
        // 登录了,数据存储到服务器
        this._updateUserChannels()
      } else {
        // 没有登录,数据存储到本地
        setItem('local-channels', this.userChannels)
      }
    },
    // 频道弹出层点击事件
    userChannelClick(i) {
      // 删除添加频道
      if (this.isEdit && i !== 0 && this.userChannels.length > 2) {
        this.delChannel(i)
      } else if (!this.isEdit) { // 选择频道
        this.switchChannel(i)
      }
    },
    // 删除频道
    delChannel(i) {
      // 若果删除的项是在当前激活项的前面,则让active - 1
      // 如果删除的项是当前激活的项,则让 active 回到默认 0
      if (i < this.active) {
        this.$emit('switchChannel', this.active - 1)
      } else if (i === this.active) {
        this.$emit('switchChannel', this.active === 0)
      }
      // 删除点击项
      this.userChannels.splice(i, 1)

      // 判断是否是登录状态
      if (this.user) {
        // 发起请求更新列表
        this._updateUserChannels()
      } else {
        // 保存到本地
        setItem('local-channels', this.userChannels)
      }
    },
    // 选择频道
    switchChannel(i) {
      this.$emit('switchChannel', i)
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
#channel-edit {
  padding-top: 55px;

  .channel-title {
    font-size: 16px;
    color: #333;
  }
  .van-button {
    width: 50px;
    height: 25px;
  }

  .van-grid-item {
    height: 43px;
    width: 80px;
    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      border-radius: 5px;
      position: relative;
      .van-grid-item__text {
        color: #222;
        font-size: 12px;
        margin-top: 0;
      }
      .van-grid-item__icon {
        position: absolute;
        right: -5px;
        top: -8px;
        font-size: 20px;
        color: rgb(153, 153, 153);
      }
    }
  }
  /deep/ .active {
    .van-grid-item__text {
      color: red !important;
    }
  }
}
</style>
