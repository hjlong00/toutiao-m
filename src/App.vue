<template>
  <div id="app">
    <keep-alive :include="cachePages">
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapState(['cachePages'])
  },
  mounted() {
  }
}
</script>

<style lang="less">
</style>
