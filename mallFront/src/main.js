import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import store from '@/store/index.js'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';

// 必须写在挂载Vue 实例之前
axios.defaults.timeout = 10000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 允许跨域
axios.defaults.withCredentials = true;

const app = createApp(App)

app.use(store)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
