<template>
  <div>
    <van-nav-bar title="小思同学" left-arrow @click-left="$router.back()" />

    <van-cell-group class="list-group">
      <div v-for="(item,i) in chatList" :key="i">
        <!-- 左边机器人 -->
        <div class="chat-item left" v-if="item.name === 'xs'">
          <van-image fit="cover" round src="https://img.yzcdn.cn/vant/cat.jpeg" />
          <div class="chat-pao">{{item.msg}}</div>
        </div>

        <!-- 右边当前用户 -->
        <div class="chat-item right" v-if="item.name === 'me'">
          <div class="chat-pao">{{item.msg}}</div>
          <van-image fit="cover" round :src="userAvatar" />
        </div>
      </div>
    </van-cell-group>

    <van-cell-group class="bottom">
      <van-field :border="false" autosize v-model.trim="message" placeholder="请输入信息" />
      <van-button type="primary" size="small" text="发送" @click="send()" />
    </van-cell-group>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { mapGetters } from 'vuex'
// import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'chatIndex',
  data() {
    return {
      message: '',
      socket: null, // websocket 实例对象
      chatList: []
      // 1, 根据 name 属性,即可判断出这个消息应该渲染到左边还是右边
      //  [
      //   { name: 'xs', msg: 'hi,你好!我是小智' },
      //   { name: 'me', msg: '我是编程小王子' }
      // ]
    }
  },
  computed: {
    ...mapGetters(['userAvatar'])
  },
  created() {
    this.socket = io('')

    // 监听到 socket 连接成功的事件
    this.socket.on('connect', () => {
      console.log('连接建立成功') // x8WIv7-mJelg7on_ALbx
    })

    // 监听到 socket 连接关闭的事件
    this.socket.on('disconnect', () => {
      console.log('连接断开') // undefined
    })

    // 接收到消息的事件
    this.socket.on('message', msg => this.chatList.push({ name: 'xs', msg }))
  },
  // 组件被销毁之前,清空 sock 对象
  beforeDestroy() {
    // 关闭连接
    this.socket.close()

    // 销毁 websocket 实例对象
    this.socket = null
  },
  methods: {
    send() {
      // 如果发送的消息为空,则 return 出去
      if (!this.message) return

      // 向服务器发送消息
      this.socket.emit('send', this.message)

      // 1,将用户填写的消息存储到 chatList 中
      this.chatList.push({ name: 'me', msg: this.message })

      //  2,清空文本框内容
      this.message = ''
    },
    scrollToBottom() {
      // 1,获取所有的聊天 item 项
      const chatItem = document.querySelectorAll('.chat-item')
      // 2,获取到最后一项对应的dom元素
      const lastItem = chatItem[chatItem.length - 1]

      // 3,滚动元素的父容器,使被调用 scrollIntoView() 的元素被用户可见
      lastItem.scrollIntoView({
        behavior: 'smooth', // 动画效果
        // 定义垂直方向的对齐(end 表示元素的底端将和其所在滚动区的可视区域的底端对齐)
        block: 'end'
      })
    }
  },
  watch: {
    // 监视聊天数据的变化
    chatList() {
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.list-group {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
  .chat-item {
    padding: 10px;
    .van-image {
      vertical-align: top;
      width: 40px;
      height: 40px;
    }
    .chat-pao {
      vertical-align: top;
      display: inline-block;
      min-width: 40px;
      max-width: 70%;
      line-height: 38px;
      border: 0.5px solid #c2d9ea;
      border-radius: 4px;
      padding: 0 10px;
      background-color: #e0effb;
      word-break: break-all; // word-break 属性规定自动换行的处理方法, break-all 允许在单词内换行
      font-size: 14px;
      color: #333;
      position: relative;
      &::before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        top: 12px;
        border-top: 0.5px solid #c2d9ea;
        border-right: 0.5px solid #c2d9ea;
        background-color: #e0effb;
      }
    }
  }
  .chat-item.right {
    text-align: right;
    .chat-pao {
      margin-left: 0;
      margin-right: 15px;
      &::before {
        right: -6px;
        transform: rotate(45deg);
      }
    }
  }
  .chat-item.left {
    text-align: left;
    .chat-pao {
      margin-left: 15px;
      margin-right: 0;
      &::before {
        left: -5px;
        transform: rotate(-135deg);
      }
    }
  }
}
.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  align-items: center;

  padding: 0 10px;
  .van-button {
    width: 50px;
    border-radius: 5px;
  }
}
</style>
