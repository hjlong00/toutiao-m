<template>
  <div id='update-birthday'>
    <van-datetime-picker v-model="currentDate" type="date" title="选择年月日"
      :min-date="minDate" :max-date="maxDate" @cancel="$emit('close')"
      @confirm="onConfirm" />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value)
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0 // 持久展示,0 无限时间
      })

      const date = dayjs(this.currentDate).format('YYYY-MM-DD')

      await updateUserProfile({
        birthday: date
      })

      this.$emit('input', date)

      this.$emit('close')

      this.$toast.success('修改完成')
    }
  }
}
</script>

<style scoped>
</style>
