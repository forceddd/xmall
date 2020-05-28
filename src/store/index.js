import Vue from 'vue'
import Vuex from 'vuex'
import Storage from '@/Utils/storage.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    login: Storage.get('token') ? true : false,//是否登录
    userInfo: JSON.parse(Storage.get('userInfo')),//用户信息
    cartList: JSON.parse(Storage.get('cartList')) || [],//购物车中的商品
    showCart: false,//是否显示购物车
  },
  mutations: {
    SHOWCART(state, isShow) {
      state.showCart = isShow;
    },
    ISLOGIN(state, { info, isLogin }) {
      state.login = isLogin;
      state.userInfo = info;
      Storage.set('userInfo', info)
    },
    ADDCART(state, cartList) {
      state.cartList = cartList
      Storage.set('cartList', cartList)
    }
  },
  actions: {
    /* cartShowState({ commit }, isShow) {
      commit('cartShowState', isShow)
    } */
  },
  modules: {
  }
})
