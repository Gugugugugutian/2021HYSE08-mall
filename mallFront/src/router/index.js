import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      component: () => import('../views/CartView.vue'),
      children: [
        {
          path: 'confirm',
          name: 'confirm',
          component: () => import('../views/ConfirmView.vue')
        }, {
          path: 'pay',
          name: 'pay',
          component: () => import('../views/PayView.vue')
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
            component: () => import('../views/RegisterView.vue')
          }, {
            path: 'order',
            name: 'order',
            component: () => import('../views/OrderView.vue'),

          }, {
            path: 'address',
            name: 'address',
            component: () => import('../views/AddressView.vue')
          },
      ],
    }
  ]
})

export default router
