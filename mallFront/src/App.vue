<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <h1 style="text-align: center">线上商城</h1>
  <nav>
    <router-link to="/">首页</router-link>
    <router-link to="/search">搜索</router-link>
    <router-link to="/cart">购物车</router-link>
    <router-link to="/user">用户中心</router-link>
  </nav>
  <RouterView />
</template>

<style scoped>
.logo {
  display: block;
  margin: 0 auto 2rem;
}
nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
  margin-top: 2rem;
}
nav a.router-link-exact-active {
  color: var(--color-text);
}
nav a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>
<style>
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}
nav a:first-of-type {
  border: 0;
}
</style>
