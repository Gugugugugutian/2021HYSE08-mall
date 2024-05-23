import { createStore } from 'vuex'
const store = createStore({
    state () {
        return {
            isLogin: false,
            username: '',
        }
    },
    mutations: {
        // username 用户登录
        onLogin (username) {
            this.isLogin = true
            this.username = username
        },
        // username 用户退出
        onLogout () {
            this.isLogin = false
            this.username = ''
        }
    }
})