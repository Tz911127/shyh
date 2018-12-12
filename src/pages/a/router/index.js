import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'

Vue.use(Router)
const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
    //开始跳转前
    next() // 跳转
    
  })
  
  router.afterEach(to => {
    //跳转成功后
    window.scrollTo(0, 0)
  })

export default router