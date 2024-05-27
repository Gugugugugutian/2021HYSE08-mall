<template>
  <div class="pay-view">

    <div class="order-steps">
      <h2>购物车 &gt; 确认订单 &gt; 支付</h2>
    </div>
    <div class="payment-info">
      <p>买给 顾田 的 9 件商品</p>
      <p class="total-price">¥ 50.00</p>
      <button @click="confirmPayment">确认支付</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    confirmPayment() {
      alert('支付已完成');
      // 可以在此处添加跳转到订单完成页面或其他逻辑
    },
  },
};
</script>

<style>
.pay-view {
  font-family: Arial, sans-serif;
  text-align: center;
}
nav a {
  margin-right: 20px;
  text-decoration: none;
  color: green;
}
.order-steps {
  margin: 20px 0;
}
.payment-info {
  margin-top: 50px;
}
.payment-info p {
  font-size: 18px;
  margin: 10px 0;
}
.total-price {
  font-size: 36px;
  color: red;
}
button {
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
