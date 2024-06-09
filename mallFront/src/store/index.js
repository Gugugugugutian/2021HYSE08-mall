import { userLogin, checkLoginStatus, userLogout } from "@/api/user.js";
import { createStore } from 'vuex'
import {createOrder, payOrder} from "@/api/orders.js";
const store = createStore({
    state: {
        // 用户信息
        // 请从本地缓存中获取 localStorage.getItem('username')
        // 或者使用 Getter: this.$store.getters.username

        // 购物车
        // 请从本地缓存中获取 localStorage.getItem('cart')

        // 提交订单后返回的用于支付的数据
        // 请从本地缓存中获取 localStorage.getItem('payOrderId')
        // 请从本地缓存中获取 localStorage.getItem('payOrderPrice')
    },
    mutations: {
        // username 用户登录时更新state
        onLogin (state, arg) {
            localStorage.setItem('username', arg.username);
            console.log('登录成功: ' + state.username);
        },
        // username 用户退出时更新state
        onLogout (state) {
            localStorage.removeItem('username');
            console.log('登出成功');
        },
        // 用字符串更新购物车
        updateCart({commit}, arg) {
            localStorage.setItem('cart', arg);
        },
        // 用字符串更新支付数据
        updatePayData({commit}, arg) {
            localStorage.setItem('payOrderId', arg.id);
            localStorage.setItem('payOrderPrice', arg.price);
        }
    },
    getters: {
        isLogin() {
            return localStorage.isLogin;
        },
        username() {
            return localStorage.username;
        },
        cart() {
            return localStorage.cart;
        },
        payOrderId() {
            return localStorage.payOrderId;
        },
        payOrderPrice() {
            return localStorage.payOrderPrice;
        },
    },
    actions: {
        // 提交订单
        createOrder({commit}, arg) {
            return new Promise((resolve, reject) => {
                createOrder(arg.username, arg.address, arg.cart).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            }).then(res => {
                console.log(res);
                commit('updateCart', '');
                commit('updatePayData', {
                    id: res.orderId,
                    price: res.total
                });
            })
        },
        // 支付订单
        payOrder1({commit}) {
            return new Promise((resolve, reject) => {
                payOrder(this.getters.payOrderId).then(res => {
                    resolve(res);
                }).catch(err => {
                    reject(err);
                })
            })
        },
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
                checkLoginStatus(store.getters.username).then(res => {
                    // 登录状态检查成功
                    if(res.username === store.getters.username) resolve(0);
                    else {
                        dispatch('userLogout');
                        reject('登录失效，请重新登录');
                    }
                }).catch(err => {
                    // 登录状态检查失败，自动退出
                    dispatch('userLogout');
                    reject('未登录');
                })
            });
        }
    },
})

export default store;