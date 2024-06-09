<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { queryOrdersByUsername, queryOrderById } from '@/api/orders.js';

const store = useStore();
const router = useRouter();

const username = computed(() => store.getters.username);
const orders = ref([]);
const isLoading = ref(true);
const orderIds = ref([]);
const goodsList = ref([]);

const fetchOrderDetails = async (orderId) => {
  try {
    const response = await queryOrderById(orderId);
    if (response && response.data && response.data.order) {
      return response.data.order;
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch order details for orderId ${orderId}:`, error);
    return [];
  }
};

const fetchOrders = async () => {
  try {
    const response = await queryOrdersByUsername(username.value);
    if (response && response.order) {
      const orderList = response.order;
      console.log('orderList:', orderList);

      orderIds.value = orderList.map(order => order.id);
      console.log('orderIds:', orderIds);

      orders.value = await Promise.all(orderList.map(async order => {
        const goods = await fetchOrderDetails(order.id);
        return { ...order, goods };
      }));

      // 遍历orderIds，获取每个订单的详细商品信息
      for (const id of orderIds.value) {
        console.log('id:', id);
        const response_goods = await queryOrderById(id);
        console.log('response_goods:', response_goods);

        const goods = response_goods.order;
        console.log('goods:', goods);
        goodsList.value.push(goods);
      }
      console.log('goodsList:', goodsList);
      // console.log('goodsList[0]:', goodsList[0]);
      console.log('goodsList.value[0]:', goodsList.value[0]);
      // console.log('goodsList.value[1]:', goodsList.value[1]);


    } else {
      console.error('Invalid response format:', response);
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    isLoading.value = false;
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
    <div class="order-history">
      <h2>历史订单</h2>
      <div v-if="isLoading" class="loading">加载中...</div>
      <div v-else>
        <div v-for="(order, index) in orders" :key="index" class="order-item">
          <div class="order-header">
            <div class="order-date">{{ order.date }}</div>
            <div class="order-summary">
              <p class="order-id">订单号: {{ order.id }}</p>
              <p class="username">用户名: {{ order.username }}</p>
              <p class="total-amount">总金额: {{ order.total }} 元</p>
            </div>
          </div>
          <div class="order-details">
            <p>{{ goodsList[index].length }}件商品，已完成。</p>
            <div v-for="item in goodsList[index]" :key="item.name" class="order-item-detail">
              {{ item.name }} x {{ item.quantity }}
              <div class="item-prices">
                <span>单价: {{ item.price }} 元</span>
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
  width: 100%;
  padding-left: 10px;
}

.order-summary p {
  margin: 0 10px;
}

.order-id {
  flex: 1;
}

.username {
  flex: 2;
}

.total-amount {
  flex: 1;
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