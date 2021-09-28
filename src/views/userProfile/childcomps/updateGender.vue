<template>
  <div id='update-gender'>
    <van-picker title="选择性别" show-toolbar :columns="columns" :default-index="defaultIndex"
      @confirm="onConfirm" @cancel="$emit('close')" @change="onChange" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value
    }
  },
  methods: {
    // picker 选择器选择时触发的事件,会回调3个参数,第三个才是索引值
    onChange(p, v, index) {
      this.defaultIndex = index
    },
    // 确认提交
    async onConfirm() {
      this.$toast.loading({
        newName: '保存中',
        forbidClick: true, // 禁止点击背景
        duration: 0 // 持久展示,0 无限时间
      })

      // 请求更新
      const res = await updateUserProfile({
        gender: this.defaultIndex
      })

      console.log(res)
      // 更新成功,让父组件修改数据
      // input v-model 默认监听的事件
      this.$emit('input', this.defaultIndex)

      // 关闭弹出层
      this.$emit('close')

      // 成功提示
      this.$toast.success('修改完成')
    }
  }
}
</script>

<style scoped>
</style>
