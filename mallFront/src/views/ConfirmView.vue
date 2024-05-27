<template>
  <div class="confirm-view">

    <div class="order-steps">
      <h2>购物车 &gt; 确认订单 &gt; 支付</h2>
    </div>
    <div class="shipping-info">
      <div class="address">
        <p>顾田 130********</p>
        <p>武汉市武昌区...</p>
      </div>
      <button @click="chooseOtherAddress">其他地址</button>
    </div>
    <p class="address-tip">可以用一个弹窗让用户选择其他地址</p>
    <div class="order-info">
      <h3>商品信息</h3>
      <p>参考CartView</p>
    </div>
    <div class="order-summary">
      <p>总价: ¥{{ totalPrice.toFixed(2) }}</p>
      <button @click="confirmOrder">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const totalPrice = ref(24.00);

const chooseOtherAddress = () => {
  alert('弹出选择其他地址的窗口');
};

const confirmOrder = () => {
  alert('订单已确认');
};
</script>

<style>
.confirm-view {
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
.shipping-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
.address {
  text-align: left;
}
.address p {
  margin: 0;
}
.address-tip {
  text-align: left;
  margin: 10px 0;
}
.order-info {
  text-align: left;
  margin: 20px 0;
}
.order-summary {
  text-align: right;
  margin: 20px 0;
}
.order-summary p {
  display: inline-block;
  margin-right: 20px;
  font-size: 18px;
  font-weight: bold;
}
.order-summary button {
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
