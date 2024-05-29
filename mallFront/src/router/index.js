import { createRouter, createWebHistory } from 'vue-router'
import store from '../store/index.js'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      // 主页
      path: '/',
      name: 'home',
      component: HomeView
    }, {
      // 购物车页，包括确认订单，模拟支付2个子页面
      path: '/cart',
      name: 'cart',
      component: () => import('../views/CartNaviView.vue'),
      redirect: '/cart/cart',
      children: [
        {
          path: 'confirm',
          name: 'confirm',
          component: () => import('../views/ConfirmView.vue')
        }, {
          path: 'pay',
          name: 'pay',
          component: () => import('../views/PayView.vue')
        }, {
          path: 'cart',
          name: 'cart',
          component: () => import('../views/CartView.vue'),
        }
      ]
    }, {
      // 商品搜索页
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchView.vue')
    }, {
      // 个人中心，包括用户的登录，注册，订单管理，地址管理4个子页面
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
      redirect: '/user/login',
      children: [
          {
            path: 'login',
            name: 'login',

            component: () => import('../views/LoginView.vue')
          }, {
            path: 'register',
            name: 'register',
            component: () => import('../views/RegisterView.vue'),
          }, {
            path: 'order',
            name: 'order',
            component: () => import('../views/OrderView.vue'),
            meta: {
              requireAuth: true
            },
          }, {
            path: 'address',
            name: 'address',
            component: () => import('../views/AddressView.vue'),
            meta: {
              requireAuth: true
            },
          },
      ],
    }
  ]
})

// 需要登录的路由，如果未登录，跳转到登录页面
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && to.meta.requireAuth === true) {
    if (!!store.getters.username) {
      // 二次检查登录状态
      store.dispatch('userCheckLoginStatus', store.getters.username).then(res => {
        if(res===0) {
          next();
        } else {
          next(/*跳转登录*/ {
            path: '/user/login',
            query: {
              redirect: to.fullPath
            }
          })
        }
      })
    }
    else next(/*跳转登录*/ {
      path: '/user/login',
      query: {
        redirect: to.fullPath
      }
    })
  } else {
    next()
  }
})

export default router
