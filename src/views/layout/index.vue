<template>
  <div id=''>
    <!-- 子路由出口 -->
    <router-view />
    <!-- 底部导航栏 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="home-o" replace to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="search" replace to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="friends-o" replace to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="setting-o" replace to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'layout',
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style scoped>
</style>
