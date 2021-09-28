<template>
  <div id='update-photo'>
    <img class="image" :src="image" ref="image">
    <van-nav-bar left-text="取消" right-text="确认" @click-left="$emit('close')"
      @click-right="onComfirm" />
  </div>
</template>

<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'UpdatePhoto',
  props: {
    file: {
      required: true
    }
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  mounted() {
    // 获取需要裁切的图片 DOM
    const image = this.$refs.image

    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true

    })
  },
  methods: {
    // 获取裁切结果,使用promise包装,为了更好的调用,不然都要写进这个回调里
    getCroppedCanvas() {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob(file => {
          resolve(file)
        })
      })
    },
    async onComfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0 // 持久展示,0 无限时间
      })

      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)

      // 如果要求 Content-Type 是 multipart/form-data, 则一定要提交 FormData 数据对象, 专门用于文件上传,不能提交 {}
      // const fd = new FormData()
      // fd.append('photo', this.file)

      await updateUserPhoto(fd)
      // 更新头像数据,传递的是裁切后的图片,因为裁切后是file文件,要转成url发出去
      this.$emit('updatePhoto', window.URL.createObjectURL(file))

      this.$emit('close')

      this.$toast.success('修改完成')
    }
  }
}
</script>

<style lang="less"  scoped>
#update-photo {
  height: 100%;
}
.van-nav-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
}
/* Ensure the size of the image fit the container perfectly */
.img {
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
