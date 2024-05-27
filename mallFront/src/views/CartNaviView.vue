<script setup>
</script>

<template>
  <main>
    <nav>
      <router-link to="/cart/cart">购物车 > </router-link>
      <router-link to="/cart/confirm">确认订单 > </router-link>
      <router-link to="/cart/pay">支付 > </router-link>
    </nav>
    <router-view></router-view>
  </main>
</template>
