import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

const USER_KEY = 'toutiao-user'
const USER_INFO = 'userInfo'

export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY), // 当前登录用户的登录状态(token等数据)
    cachePages: ['layout'],
    userInfo: getItem(USER_INFO)
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止页面刷新数据丢失,还需要把数据放到本地存储中,目的为了持久化数据
      setItem(USER_KEY, data)
      // window.localStorage.setItem('user', JSON.stringify(state.user))
    },
    // 保存用户信息
    setUserInfo(state, data) {
      state.userInfo = data

      setItem(USER_INFO, data)
    },
    // 添加缓存界面,login之后,页面重新渲染,在layout页面 mount的时候再添加缓存
    addCachePages(state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },

    // 移除缓存界面, 在login的时候使用,移除缓存页面
    removeCachePages(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  getters: {
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

      // 如果用户信息对象中包含 photo 属性,则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }

      return imgSrc
    }
  },
  modules: {
  }
})
