<script>
export default {
  name: "UserView",
  computed: {
    isLogin() {
      return this.$store.state.isLogin;
    }
  }
};
</script>

<template>
  <div class="main">
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