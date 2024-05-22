import './assets/main.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'


const store = createStore({
  state () {
    return {
      testComplete: false,
      isLogin: false,
      userInfo: {
        userId: '',
        userName: '',
      }
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
app.use(store)

app.mount('#app')
