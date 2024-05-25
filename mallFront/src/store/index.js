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
        // goods
        allProducts: [
            { id: 1, name: '书包', price: 100, image: 'https://img13.360buyimg.com/jdcms/s460x460_jfs/t1/227922/7/13824/61489/65db59c0Fbb4c1572/075adffbfa8abe99.jpg.avif' },
            { id: 2, name: '椅子2', price: 150, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
            { id: 3, name: '商品3', price: 200, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/230758/32/17683/82372/664b1593Ff41795a9/d24ee792bb8ce8f9.jpg.avif' },
            { id: 4, name: '枣', price: 250, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
            { id: 5, name: '倒挂金钩', price: 300, image: 'https://img20.360buyimg.com/jdcms/s460x460_jfs/t1/172759/5/42418/140906/6645bf32Fb6af1595/688667f8dbae6d38.jpg.avif' },
            { id: 6, name: '芜湖', price: 350, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
            { id: 7, name: '王八', price: 400, image: 'https://img20.360buyimg.com/jdcms/s460x460_jfs/t1/172759/5/42418/140906/6645bf32Fb6af1595/688667f8dbae6d38.jpg.avif' },
            { id: 8, name: '商品8', price: 450, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
            { id: 9, name: '麻沸散', price: 500, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/230758/32/17683/82372/664b1593Ff41795a9/d24ee792bb8ce8f9.jpg.avif' },
            { id: 10, name: '马楼', price: 550, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
            { id: 11, name: '金刚', price: 550, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' }
        ],
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