import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from './utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress Configuration

//permission judge
const whiteList = ['/login','/auth-redirect']

router.beforeEach((to, from ,next) => {
  NProgress.start()
  if (getToken()){  //判断是否登录
    if (to.path === '/login' ||to.path === '/401'){
      next({path:'/'})
      NProgress.done()
    }else {
      if (store.getters.role < 1) {
        store.dispatch('GetUserInfo').then(res => {
          // console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }
      next()
    }
  }else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})



router.afterEach(() => {
  NProgress.done() // finish progress bar
})

