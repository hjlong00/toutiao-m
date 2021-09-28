import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/'
import { Dialog } from 'vant'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      { path: '/', name: 'home', component: () => import('@/views/home/'), meta: { requiresAuth: false } },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa/'), meta: { requiresAuth: false } },
      { path: '/video', name: 'video', component: () => import('@/views/video/'), meta: { requiresAuth: false } },
      { path: '/my', name: 'my', component: () => import('@/views/my/'), meta: { requiresAuth: false } }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将动态路由参数映射到组件的 props 中,无论是访问还是维护性都很方便
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: 'userProfile',
    component: () => import('@/views/userProfile/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/chat',
    name: 'chatIndex',
    component: () => import('@/views/chat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.

    // 判断是否已经登录
    if (store.state.user) {
      return next()
    }

    // ↓ 没有登录
    Dialog.confirm({
      title: '提示',
      message: '该功能需要登录,是否登录?'
    })
      .then(() => {
        // on confirm
        next({
          path: '/login',
          query: { redirect: to.fullPath } // 这样登录后就可以自动前往要去的页面
        })
      })
      .catch(() => {
        // on cancel
        next(false)
      })
  } else {
    next()
  }
})

export default router
