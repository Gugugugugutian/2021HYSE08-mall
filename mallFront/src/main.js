import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 必须写在挂载Vue 实例之前
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 允许跨域
axios.defaults.withCredentials = true;

const app = createApp(App)

app.use(router)

app.mount('#app')
