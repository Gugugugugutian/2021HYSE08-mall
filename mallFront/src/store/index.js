import { userLogin, checkLoginStatus, userLogout } from "@/api/user.js";
import { createStore } from 'vuex'
const store = createStore({
    state: {
        // 用户信息
        // 请从本地缓存中获取 localStorage.getItem('username')
        // 或者使用 Getter: this.$store.getters.username
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
        //活动海报
        images: [
            'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000366/100006849854/FocusFullshop/CkJqZnMvdDEvMjM5NTA4LzQvOTU1Ni8xMzY5MzgvNjY0YTUwMjJGMjU4ODNmM2EvN2Q5OTg2ODE5ODMzZDg3Yy5wbmcSCTEtdHlfMF81MjACOO6LekITCg_lqIHmiIjnlLXohJHljIUQAUITCg_kvJjmg6DkuqvkuI3lgZwQAkIQCgznq4vljbPmiqLotK0QBkIKCgbnsr7pgIkQB1i-2v3G9AI/cr/s/q.jpg',
            'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000366/100010511786/FocusFullshop/CkRqZnMvdDEvMjAwMTE5LzE1LzQzNDE3Lzc2NzYzNi82NjRhNTA0MkZhOWNhODExNi9kMmYyOWY5YzQ1YTEwMjQ0LnBuZxIJMy10eV8wXzU0MAI47ot6Qh8KG-e-jue0oOS9s-WEv-WptOW5vOWEv-WltueyiRABQhMKD-S9oOWAvOW-l-aLpeaciRACQhAKDOeri-WNs-aKoui0rRAGQgoKBuS8mOmAiRAHWKqb3cj0Ag/cr/s/q.jpg',
            'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000318/100027956045/FocusFullshop/CkJqZnMvdDEvMjE2NDYzLzgvNDE1OTcvNDYyNjgvNjY0YTUxNzZGYjc5ZGJkN2IvYzAzMjI3ODMxMTA5ZDg0MS5wbmcSCTMtdHlfMF81NDACOL6LekIcChjpq5jlsJTlpKvlpbPlo6vlj4zogqnljIUQAUIQCgzpnIfmkrzmnaXkuLQQAkIQCgznq4vljbPmiqLotK0QBkIKCgbkvJjpgIkQB1jN9oXR9AI/cr/s/q.jpg'
        ],
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
        }
    },
    getters: {
        isLogin() {
            return localStorage.isLogin;
        },
        username() {
            return localStorage.username;
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