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
    <div class="order-info">
      <h3>商品信息</h3>
      <div class="order-item" v-for="item in selectedItems" :key="item.id">
        <img :src="item.image" alt="商品图片" class="product-image">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>数量: {{ item.quantity }}</p>
          <p>单价: ¥{{ item.price.toFixed(2) }}</p>
        </div>
      </div>
    </div>
    <div class="order-summary">
      <p>总价: ¥{{ totalPrice.toFixed(2) }}</p>
      <button @click="confirmOrder">确认</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const selectedItems = ref([]);
const totalPrice = ref(0);

onMounted(() => {
  if (route.query.items) {
    selectedItems.value = JSON.parse(route.query.items);
    totalPrice.value = parseFloat(route.query.total);
  }
});

const chooseOtherAddress = () => {
  alert('弹出选择其他地址的窗口');
};

const confirmOrder = () => {
  alert('订单已确认');
  router.push({
    path: '/cart/pay',
    query: {
      items: JSON.stringify(selectedItems.value),
      total: totalPrice.value
    }
  });
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
.order-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
.product-image {
  width: 80px;
  height: 80px;
  background-color: #f0f0f0;
  margin-right: 20px;
}
.item-details {
  flex: 2;
  text-align: left;
}
.item-details h3 {
  font-size: 14px;
  margin: 0;
}
.item-details p {
  font-size: 12px;
  margin: 2px 0;
}
.order-summary {
  text-align: right;
  margin-top: 20px;
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
