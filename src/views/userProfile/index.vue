<template>
  <div id=''>
    <van-nav-bar left-arrow title="个人信息" @click-left="toMyIndex" />

    <input type="file" accept="image/*" hidden ref="file" @change="onFileChange">
    <van-cell title="头像" is-link center>
      <van-image fit="cover" round width="30" height="30" :src="userProfile.photo"
        @click="$refs.file.click()" />
    </van-cell>
    <van-cell title="昵称" is-link :value="userProfile.name" @click="editNameShow = true" />
    <van-cell title="性别" is-link :value="userProfile.gender === 0 ? '男':'女'"
      @click="editGenderShow = true" />
    <van-cell title="生日" is-link :value="userProfile.birthday"
      @click="editBirthdayShow = true" />

    <!-- 编辑昵称 -->
    <van-popup v-model="editNameShow" position="bottom" :style="{ height: '100%' }">
      <!-- 知识补充:
      当传给子组件的数组既要使用,又要修改,那可以使用 v-model 简写, 只能用一次!

        v-model="userProfile.name"
         默认传递一个名字叫 value 的数据  :value="userProfile.name"
         默认监听一个事件加 input  @input="userProfile.name = $event"
         本质还是父子组件通信,它仅仅是简化了父组件的使用

      如果有多个数据需要保持同步,则需要 使用 .sync 修饰符
        :name.sync="userProfile.name"
          传递名字为  name 的数据:    :name="userProfile.name"
          监听事件叫 update:属性名字:  @update:name="userProfile.name = $event"

          一般把最常用的数据设计为 v-model 绑定
          不太常用的数据设计为 .sync

          具体参考vue文档 https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
       -->
      <!-- v-if 让组件能够销毁,每次都是新的组件,避免缓存数据的保留 -->
      <update-name v-if="editNameShow" v-model="userProfile.name"
        @close="editNameShow = false" />
    </van-popup>

    <!-- 修改性别 -->
    <van-popup v-model="editGenderShow" position="bottom">
      <update-gender v-if="editGenderShow" v-model="userProfile.gender"
        @close="editGenderShow = false" />
    </van-popup>

    <!-- 编辑生日弹出层 -->
    <van-popup v-model="editBirthdayShow" position="bottom">
      <update-birthday v-if="editBirthdayShow" v-model="userProfile.birthday"
        @close="editBirthdayShow = false" />
    </van-popup>

    <!-- 编辑头像图片弹出层 -->
    <van-popup class="update-photo-popup" v-model="editPhotoShow" position="bottom"
      :style="{ height: '100%' }">
      <update-photo v-if="editPhotoShow" :file="previewImage"
        @close="editPhotoShow = false" @updatePhoto="
        userProfile.photo = $event" />
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import updateName from './childcomps/updateName.vue'
import UpdateGender from './childcomps/updateGender.vue'
import UpdateBirthday from './childcomps/updateBirthday.vue'
import UpdatePhoto from './childcomps/updatePhoto.vue'

export default {
  components: { updateName, UpdateGender, UpdateBirthday, UpdatePhoto },
  name: 'UserProfile',
  data() {
    return {
      userProfile: {}, // 个人信息数据
      editNameShow: false, // 编辑昵称弹出层
      editGenderShow: false, // 编辑性别弹出层
      editBirthdayShow: false, // 编辑生日弹出层
      editPhotoShow: false, // 编辑头像图片弹出层
      previewImage: null // 上传预览图片
    }
  },
  created() {
    this._getUserProfile()
  },
  methods: {
    // 获取个人信息
    async _getUserProfile() {
      const { data: res } = await getUserProfile()
      // console.log(res)
      this.userProfile = res.data
    },
    // 图片上传之后的操作
    onFileChange() {
      // 展示弹出层,预览图片
      this.editPhotoShow = true

      const file = this.$refs.file.files[0]
      // console.log(blob)
      this.previewImage = file

      // 为了相同文件不触发 change 事件,所以手动清除file 的 value
      this.$refs.file.value = ''
    },
    toMyIndex() {
      this.$router.replace('/my')
    }
  },
  destroyed() {
    // console.log('销毁后')
    // 发出数据更新的消息
    this.$EventBus.$emit('update')
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}
.update-photo-popup {
  background-color: #000;
}
</style>
