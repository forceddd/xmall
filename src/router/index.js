import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/views/Index'
import Home from '@/views/Home/index'
import Goods from '@/views/Goods/index'
import Thanks from '@/views/Thanks/index'
Vue.use(VueRouter)

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
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index')
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
