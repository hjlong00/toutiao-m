<template>
  <div id=''>
    <van-nav-bar title="注册 / 登录" left-arrow @click-left="$router.back()" />

    <van-form :show-error-message="false" :show-error="false" validate-first @submit="onLogin"
      @failed="onFailed" ref="loginFormRef">
      <van-field center v-model="userInfo.mobile" name="mobile" placeholder="请输入手机号"
        :rules="formRules.mobile" icon-prefix="toutiao" left-icon="shouji" />
      <van-field center v-model="userInfo.code" name="code" placeholder="请输入验证码"
        :rules="formRules.code" icon-prefix="toutiao" left-icon="yanzhengma">
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="1000 * 60" format="ss s"
            @finish="isCountDownShow = false" />
          <van-button v-else class="smsBtn" size="mini" @click.prevent="onSendSms"
            :loading="isSendSmsLoading" loading-type="spinner">发送验证码
          </van-button>
        </template>
      </van-field>
      <div class="loginBtn">
        <van-button block>登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { userLogin, sendSms } from '@/api/user'

export default {
  name: 'login',
  data() {
    return {
      userInfo: {
        mobile: '13611111111',
        code: '246810'
        // mobile: '13611111111',
        // code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请填写手机号' },
          { pattern: /^1[3|5|6|7|8|9]\d{9}$/, message: '请输入正确的手机号码' }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false,
      isSendSmsLoading: false
    }
  },
  methods: {
    // 自定义验证错误消息弹窗
    onFailed(err) {
      if (err.errors[0].message) {
        this.$toast({
          message: err.errors[0].message, // 提示消息
          position: 'top' // 防止用户键盘太高,看不见toast信息
        })
      }
    },
    async onLogin() {
      this.$toast.loading({
        message: '登录中...',
        duration: 0, // 展示时长(ms),值为 0 时,toast 不会消失
        forbidClick: true // 是否禁止背景点击
      })
      try {
        const { data: res } = await userLogin(this.userInfo)
        console.log(res)
        this.$toast.success('登录成功!')

        // 将后端返回的用户登录状态(touken等数据)放到vuex容器中
        this.$store.commit('setUser', res.data)
      } catch (err) {
        console.log(err, '验证失败')
        this.$toast.fail({
          message: '手机号码或验证码错误'
        })
      }
    },
    // 发送验证码
    async onSendSms() {
      try {
        // 验证表单信息
        await this.$refs.loginFormRef.validate('mobile')
        // 展示loading状态,防止因为网络慢的时候用户重复点击发送按钮
        this.isSendSmsLoading = true
        // 表单通过,发送请求
        await sendSms(this.userInfo.mobile)
        // 短信发出去之后,开始倒计时
        this.isCountDownShow = true
        // 倒计时结束后,通过 finish 事件,隐藏计时器,显示发送按钮
      } catch (err) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要不同的提示,那就需要做判断
        // console.dir(err) 429状态需要用这个来打印
        let message = ''
        if (err && err.response && err.response.status === 429) {
          message = '发送太频繁,请稍后再试' // 发送短信失败的提示
        } else if (err.name === 'mobile') {
          message = err.message // 表单验证失败的提示
        } else {
          message = '未知错误'
        }

        // toast提示
        this.$toast({
          message,
          position: 'top'
        })
      }

      // 无论发送验证码成功还是是失败,最后都要关闭发送按钮loading状态
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.van-field {
  align-items: center;
  .smsBtn {
    width: 76px;
    border-radius: 23px;
    background-color: #ededed;
    border: none;
    color: #666666;
  }
}
.loginBtn {
  padding: 26px 16px;
  .van-button {
    background-color: #6db4fb;

    border: none;
    border-radius: 5px;

    color: #fff;
    font-size: 15px;
  }
}
.van-cell {
  height: 48px;
}
</style>
