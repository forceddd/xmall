import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import Storage from '@/Utils/storage.js'
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)
Vue.use(VueLazyLoad, {
  preLoad: 1.3,
  error: 'static/images/error.png',
  loading: 'static/images/loag.gif',
  attempt: 1
})
Vue.prototype.$axios = axios
Vue.config.productionTip = false
//设置全局路由守卫
router.beforeEach((to, from, next) => {

  if (to.meta.require) {
    //需要权限 跳转到登录页面
    //每次跳转到需要权限的路由之前 都要验证此时的用户是否已登录 或者登陆是否过期
    axios.post('/api/validate', {}).then(res => {
      let data = res.data;
      // console.log(data.state);

      if (!data.state) {
        //用户未登录 去登陆
        next({ name: 'login', query: { next: to.fullPath } })
      } else {
        //保存用户信息
        store.commit('ISLOGIN', { info: data, isLogin: true });
        next();
      }

    }).catch(err => {
      console.log(err);

    })

  } else {
    next();
  }


})
//请求拦截器 为所有的请求添加token
axios.interceptors.request.use(config => {
  const token = Storage.get('token')
  token ? config.headers.common['Authorization'] = token : null;
  return config
}, err => {
  return Promise.reject(err)
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
