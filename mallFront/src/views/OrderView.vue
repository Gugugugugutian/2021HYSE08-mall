<script setup>
import { ref, onMounted } from 'vue';
import { queryOrdersByUsername } from '@/api/orders.js';

const orders = ref([]);
const username = '张三'; // 根据实际情况动态获取用户名

const fetchOrders = async () => {
  try {
    const response = await queryOrdersByUsername(username);
    orders.value = response.data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

onMounted(() => {
  fetchOrders();
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
              <span>原价: {{ item.originalPrice }} 元</span>
              <span>优惠: -{{ item.discount }} 元</span>
              <span>实付款: {{ item.finalPrice }} 元</span>
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





<!--
<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);
const loading = ref(true);

const fetchOrders = () => {
  setTimeout(() => {
    orders.value = [
      {
        date: '2023年05月10日 12:34',
        username: '张三',
        total: '160.00',
        address: '武汉市 武昌区 八一路299号',
        orderTime: '2023年05月10日 12:34',
        paymentTime: '2023年05月10日 12:50',
        shippingTime: '2023年05月11日 09:00',
        completionTime: '2023年05月12日 18:00',
        items: [
          { name: '商品A', quantity: 2, originalPrice: 50, discount: 10, finalPrice: 40 },
          { name: '商品B', quantity: 1, originalPrice: 80, discount: 20, finalPrice: 60 },
          { name: '商品C', quantity: 2, originalPrice: 30, discount: 5, finalPrice: 25 },
        ],
      },
      {
        date: '2023年04月22日 14:20',
        username: '张三',
        total: '320.00',
        address: '北京市 朝阳区 建国路100号',
        orderTime: '2023年04月22日 14:20',
        paymentTime: '2023年04月22日 14:45',
        shippingTime: '2023年04月23日 10:00',
        completionTime: '2023年04月24日 16:30',
        items: [
          { name: '商品D', quantity: 5, originalPrice: 70, discount: 10, finalPrice: 60 },
        ],
      },
      // 其他示例订单数据...
    ];
    loading.value = false;
  }, 1000); // 模拟1秒的网络延迟
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <main>
    This is the 订单管理 page.

    <div class="order-history">
      <h2>用户查看历史订单的界面</h2>
      <div v-if="loading" class="loading">
        正在加载订单数据...
      </div>
      <div v-else>
        <div v-for="(order, index) in orders" :key="index" class="order-item">
          <div class="order-header">
            <div class="order-date">{{ order.date }}</div>
            <div class="order-summary">
              <p>{{ order.username }}</p>
              <p>{{ order.total }} 元</p>
            </div>
          </div>
          <div class="order-details">
            <p>{{ order.items.length }}件商品，已完成。</p>
            <div v-for="item in order.items" :key="item.name" class="order-item-detail">
              {{ item.name }} x {{ item.quantity }}
              <div class="item-prices">
                <span>原价: {{ item.originalPrice }} 元</span>
                <span>优惠: -{{ item.discount }} 元</span>
                <span>实付款: {{ item.finalPrice }} 元</span>
              </div>
            </div>
          </div>
          <div class="order-times">
            <p>下单时间: {{ order.orderTime }}</p>
            <p>付款时间: {{ order.paymentTime }}</p>
            <p>发货时间: {{ order.shippingTime }}</p>
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
</style>-->
