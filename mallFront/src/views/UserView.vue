<script>
import { testConnection, userRegister } from "@/api/user.js";
export default {
  name: "UserView",
  methods: {
    // 测试连接
    testConnection() {
      testConnection().then(res => {
        this.response = res.msg;
      }).catch(err => {
        throw err;
      });
    },

    // 检查登录状态
    checkLoginStatus() {
      return this.$store.dispatch('userCheckLoginStatus').then(res => {
        if(res) {
          this.response = res;
        }
      }).catch(err => {
        this.response = err;
      });
    },
    // 用户登出
    userLogout() {
      return this.$store.dispatch('userLogout').then(res => {
        this.response = res ? res : 'Unknown Error';
      }).catch(err => {
        this.response = err;
        throw err;
      });
    }
  },
  computed: {
    currentUsername() {
      return this.$store.state.username;
    },
    isLogin() {
      return this.$store.state.isLogin;
    }
  }
};
</script>

<template>
  <div class="main">
    <span v-show="isLogin">用户名： {{ currentUsername }} </span>
    <button v-if="isLogin" @click="userLogout">退出登录</button>
    <nav>
      <router-link to="/user">用户中心</router-link>
      <router-link to="/user/address">地址管理</router-link>
      <router-link to="/user/order">订单管理</router-link>
    </nav>
  </div>
  <router-view></router-view>
</template>

<style>
.main {
  padding: 20px;
  text-align: center;
}
</style>