<template>
  <div id='update-name'>
    <van-nav-bar title="修改昵称" left-text="取消" right-text="完成" @click-left="$emit('close')"
      @click-right="onComfirm" />
    <div class="name-field-wrap">
      <van-field v-model.trim="newName" rows="3" type="textarea" maxlength="7"
        show-word-limit placeholder="请输入新昵称" />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateName',
  props: {
    // v-model 的默认数据传递名字
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      newName: this.value
    }
  },
  methods: {
    async onComfirm() {
      this.$toast.loading({
        newName: '保存中',
        forbidClick: true, // 禁止点击背景
        duration: 0 // 持久展示,0 无限时间
      })
      // 可能存在昵称重复的情况,所以用 try 来捕获错误
      try {
        // 请求更新
        await updateUserProfile({
          name: this.newName
        })
        // console.log(res)
        // 更新成功,让父组件修改数据
        // input v-model 默认监听的事件
        this.$emit('input', this.newName)

        // 关闭弹出层
        this.$emit('close')

        // 成功提示
        this.$toast.success('修改完成')
      } catch (err) { // 存在昵称重复的情况
        if (err && err.response.status === 409) {
          this.$toast.fail('昵称已存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
  background-color: #fff;
  /deep/ .van-nav-bar__title {
    color: #333;
  }
}
.van-field {
  border-radius: 9px;
}
.name-field-wrap {
  padding: 10px;
}
</style>
