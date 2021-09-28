<template>
  <div id='my-container'>
    <van-cell-group v-if="user" class="my-info">
      <van-cell center class="base-info" :border="false">
        <van-image class="avatar" slot="icon" round fit="cover" :src="userInfo.photo"
          :key="userInfo.photo" />
        <div slot="title" class="name" :key="userInfo.name">{{userInfo.name}}</div>
        <van-button round size="mini" class="edit-btn" :to="{name:'userProfile'}"> 编辑资料
        </van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{userInfo.art_count}}</div>
            <div class="text">头条</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{userInfo.follow_count}}</div>
            <div class="text">关注</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{userInfo.fans_count}}</div>
            <div class="text">粉丝</div>
          </div>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text" class="text-warp">
            <div class="count">{{userInfo.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <div v-else class="not-login"
      @click="$router.push({name: 'login', query:{redirect:'/my'}})">
      <div><img src="~@/assets/img/my-shouji.png" alt=""></div>
      <div class="text">登录 / 注册</div>
    </div>

    <van-grid :column-num="2" class="nav-grid mb-5">
      <van-grid-item icon-prefix="toutiao" icon="shoucang" text="收 藏" />
      <van-grid-item icon-prefix="toutiao" icon="lishi" text="历 史" />
    </van-grid>

    <van-cell-group class="link mb-5">
      <van-cell title="消息通知" is-link to="/" />
      <van-cell title="小思同学" is-link to="/chat" />
    </van-cell-group>
    <van-button v-if="user" block class="logout" @click="onLogout">退出登录</van-button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user.js'

export default {
  name: 'myIndex',
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 因为页面创建就会去获取用户信息,
    // 但此时很可能用户还未登录,vuex里没有token,后台的请求就会报错
    // 加个前置做判断
    this.user && this._getUserInfo()

    // 用户编辑完资料之后返回这个页面,要及时更新数据
    this.$EventBus.$on('update', () => {
      // console.log('听到修改的信息')
      this._getUserInfo()
    })
  },
  deactivated() {
  },
  activated() {
  },
  methods: {
    // 获取用户信息
    async _getUserInfo() {
      const { data: res } = await getUserInfo()
      this.userInfo = res.data
      // console.log(res.data)
      this.$store.commit('setUserInfo', res.data)
    },
    // 登出
    onLogout() {
      // 提示用户确认退出 -> 确认,处理退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗?'
      })
        .then(() => {
          // 确认退出,清除用户登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  destroyed() {
    console.log('xb')
  }
}
</script>

<style lang="less" scoped>
.my-info {
  background: url('~@/assets/img/my-banner.png') no-repeat;
  background-size: cover;
  .base-info {
    box-sizing: border-box;
    height: 115px;
    padding-top: 38px;
    padding-bottom: 11px;
    background-color: unset;
    .avatar {
      box-sizing: border-box;
      height: 66px;
      width: 66px;
      border: 1px solid #fff;
      margin-right: 11px;
    }
    .name {
      color: #fff;
      font-size: 15px;
    }
    .edit-btn {
      height: 16px;
      font-size: 10px;
      color: #666666;
      padding-left: 9px;
      padding-right: 9px;
    }
  }

  .data-info {
    .data-info-item {
      height: 65px;
      color: #fff;
      .text-warp {
        display: flex;
        // 纵向排列
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 12px;
        }
      }
    }
    // 这里需要 /deep/ 来穿透样式,不然不生效
    /deep/ .van-grid-item__content {
      background-color: unset;
    }
  }
}
// 未登录页面
.not-login {
  height: 180px;
  background: url('~@/assets/img/my-banner.png') no-repeat;
  background-size: cover;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 66px;
    height: 66px;
  }
  .text {
    font-size: 14px;
    color: #fff;
  }
}

/deep/.nav-grid {
  .van-grid-item {
    height: 70px;
    .toutiao {
      font-size: 22px;
    }
    .toutiao-shoucang {
      color: #eb5253;
    }
    .toutiao-lishi {
      color: #ff9d1d;
    }
    .van-grid-item__text {
      color: #333333;
      font-size: 14px;
    }
  }
}
.link {
  .van-cell {
    font-size: 15px;
    color: #333333;
  }
}
.logout {
  font-size: 15px;
  color: #d86262;
}
.mb-5 {
  margin-bottom: 5px;
}
</style>
