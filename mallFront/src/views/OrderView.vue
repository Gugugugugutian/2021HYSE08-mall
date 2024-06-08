<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { queryOrdersByUsername } from '@/api/orders.js';

const store = useStore();

const username = computed(() => store.getters.username);
const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await queryOrdersByUsername(username.value);
    orders.value = response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

onMounted(() => {
  if (username.value) {
    fetchOrders();
  } else {
    router.push('/user/login');
  }
});
</script>

<template>
  <main>
    <h1>订单管理页面</h1>

    <div class="order-history">
      <h2>用户查看历史订单的界面</h2>
      <div v-for="(order, index) in orders" :key="index" class="order-item">
        <div class="order-header">
          <div class="order-date">{{ order.date }}</div>
          <div class="order-summary">
            <p>用户名: {{ order.username }}</p>
            <p>总金额: {{ order.total }} 元</p>
          </div>
        </div>
        <div class="order-details">
          <p>{{ order.goods.length }}件商品，已完成。</p>
          <div v-for="item in order.goods" :key="item.name" class="order-item-detail">
            {{ item.name }} x {{ item.quantity }}
            <div class="item-prices">
              <span>价格: {{ item.price }} 元</span>
<!--              <span>优惠: -{{ item.discount }} 元</span>
              <span>实付款: {{ item.finalPrice }} 元</span>-->
            </div>
          </div>
        </div>
        <div class="order-times">
          <p>下单时间: {{ order.orderTime }}</p>
          <p>完成时间: {{ order.completionTime }}</p>
        </div>
        <div class="order-address">
          <p>收货地址: {{ order.address }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.order-history {
  text-align: left;
  margin: 0 auto;
  width: 60%;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 50px;
}

.order-item {
  border-bottom: 1px solid #ccc;
  padding: 20px 0;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.order-date {
  font-size: 16px;
  color: #333;
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-details {
  margin-top: 10px;
}

.order-item-detail {
  padding: 5px 0;
  border-top: 1px solid #eee;
}

.order-item-detail:first-of-type {
  border-top: none;
}

.item-prices {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  font-size: 14px;
  color: #666;
}

.order-times, .order-address {
  margin-top: 10px;
}

.order-times p, .order-address p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}
</style>
