import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 必须写在挂载Vue 实例之前
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 允许跨域
axios.defaults.withCredentials = true;

const store = createStore({
  state () {
    return {
      isLogin: false,
      userInfo: {},
    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  }
})

const app = createApp(App)

app.use(router)

app.mount('#app')
