import { userLogin, checkLoginStatus, userLogout } from "@/api/user.js";
import { createStore } from 'vuex'
const store = createStore({
    state: {
        // 用户状态
        isLogin: false,
        username: '',
        sessionId: '',
        // 购物车
        cart: [],
    },
    mutations: {
        // username 用户登录时更新state
        onLogin (state, arg) {
            state.isLogin = true;
            state.username = arg.username;
            state.sessionId = arg.sessionId;
            console.log('登录成功: ' + state.username);
        },
        // username 用户退出时更新state
        onLogout (state) {
            state.isLogin = false;
            state.username = '';
            state.sessionId = '';
            console.log('登出成功');
        }
    },
    getters: {
        isLogin(state) {
            return state.isLogin;
        },
        username(state) {
            return state.username;
        },
    },
    actions: {
        // 用户登录
        userLogin({commit}, arg) {
            return new Promise((resolve, reject) => {
                if(!arg.username || !arg.password) {
                    reject('用户名或密码不能为空');
                } else {
                    userLogin(arg.username, arg.password).then(res => {
                        // 登录成功，保存登录状态
                        commit('onLogin', {
                            username: arg.username,
                            sessionId: res.token,
                        });
                        resolve('成功登录');
                    }).catch(err => {
                        reject('请检查用户名或密码');
                    })
                }
            })
        },
        // 用户登出
        userLogout({commit}) {
            return new Promise((resolve, reject) => {
                userLogout().then(res => {
                    // 登出成功
                    commit('onLogout');
                    resolve('成功退出');
                }).catch(err => {
                    reject('无法退出！');
                })
            })
        },
        // 用户登录状态二次检查
        userCheckLoginStatus({dispatch}) {
            return new Promise((resolve, reject) => {
                checkLoginStatus(store.state.username).then(res => {
                    // 登录状态检查成功
                    if(res.username === store.state.username) resolve(0);
                    else {
                        dispatch('userLogout');
                        reject(1);
                    }
                }).catch(err => {
                    // 登录状态检查失败，自动退出
                    dispatch('userLogout');
                    reject(1);
                })
            });
        }
    },
})

export default store;