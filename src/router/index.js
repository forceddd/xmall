import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/Index'
import Home from '@/views/Home/Home'
import Goods from '@/views/Goods/Goods'
import Thanks from '@/views/Thanks/Thanks'
import GoodsDetail from '@/views/GoodsDetail/GoodsDetail'
Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: '/',
    redirect: '/home',
    name: 'index',
    component: Index,
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'goods',
        name: 'goods',
        component: Goods
      },
      {
        path: 'thanks',
        name: 'thanks',
        component: Thanks
      },
      {
        path: 'goodsDetail',
        name: 'goodsDetail',
        component: GoodsDetail
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/Login')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/User'),
    meta: {
      //需要守卫
      require: true
    }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
