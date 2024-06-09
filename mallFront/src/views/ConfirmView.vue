<template>
  <div class="confirm-view">
    <div class="order-steps">

    </div>
    <div class="shipping-info">
      <div class="address">
        <p>{{ defaultAddress.name }} {{ defaultAddress.phone }}</p>
        <p>{{ defaultAddress.city }} {{ defaultAddress.street }}</p>
      </div>
      <button @click="showAddressModal">其他地址</button>
    </div>
    
    <div class="order-info">
      <h3>商品信息</h3>
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <img :src="item.image" alt="商品图片" class="product-image">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>数量: {{ item.quantity }}</p>
          <p>单价: ¥{{ item.price.toFixed(2) }}</p>
        </div>
        <div class="item-price">
          <p class="price">¥{{ (item.price*item.quantity).toFixed(2) }}</p>
          <div class="quantity-controls">
            <span>{{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="order-summary">
      <p>总价: ¥{{ totalPrice.toFixed(2) }}</p>
      <button @click="confirmOrder">确认</button>
    </div>

    <AddressModal v-if="showModal" @close="showModal = false" @select="selectAddress" :addresses="addresses" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import AddressModal from './AddressModal.vue'; // 引入 AddressModal 组件
import { getAddressByUsername } from "@/api/address.js";
import router from "@/router/index.js";

const store = useStore();
const username = computed(() => store.getters.username); // 从 Vuex 获取用户名

const totalPrice = ref(24.00);
const defaultAddress = ref({}); // 存储默认地址

const addresses = ref([]); // 存储所有地址
const showModal = ref(false); // 控制弹窗显示

const fetchAddresses = async () => { // 获取地址数据
  try {
    const response = await getAddressByUsername(username.value);
    if (response.data && response.data.length > 0) {
      addresses.value = response.data;
      defaultAddress.value = addresses.value[0]; // 设置默认地址为第一个地址
    }
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

const showAddressModal = () => { // 显示选择地址的弹窗
  showModal.value = true;
};

const selectAddress = (address) => { // 选择地址后更新默认地址
  defaultAddress.value = address;
  showModal.value = false;
};

// 地址转为字符串
const addressToString = (address) => {
  return `${address.name} ${address.phone} ${address.city} ${address.street}`;
};

const confirmOrder = () => {
  // 提交确认订单到后台
  console.log('Confirming order...' + store.getters.cart);
  store.dispatch('createOrder', {
    address: addressToString(defaultAddress.value),
    cart: store.getters.cart,
    username: store.getters.username,
  })
  // 路由跳转到支付页面
  router.push('/cart/pay');
  router.go(1);
}

// 根据购物车存储的id，获取商品详情
const cartItems = ref([]);
import {getGoodsById} from "@/api/goods.js";
const parseCart = (str) => {
  let result = [];
  if (str) {
    str.split(',').forEach((item) => {
      const [id, quantity] = item.split(':');
      result.push({
        id,
        quantity: parseInt(quantity, 10), // 确保数量是整数
      });
    });
  }
  return result;
}
const fetchCartItem = async (id) => {
  try {
    const response = await getGoodsById(id);
    const item = response.data[0];
    return {
      id: item.id,
      name: item.name,
      price: item.price,
      stock: item.stock,
      img: item.img
    };
  } catch (error) {
    console.error(`获取购物车商品信息时出错：`, error);
  }
}
const fetchCartItems = async () => {
  try {
    const cartString = localStorage.getItem('cart') || '';
    const cart = parseCart(cartString);

    // 使用 Promise.all 并行获取每个商品的信息
    const fetchItemsPromises = cart.map(item => fetchCartItem(item.id).then(product => {
      console.log('product: ', product)
      return {
        name: product.name,
        price: product.price,
        stock: product.stock,
        image: product.img,
        id: item.id,
        quantity: item.quantity,
        selected: false,
      }
    }));
    cartItems.value = await Promise.all(fetchItemsPromises);
    console.log('Fetched cart items:', cartItems.value);
    // 计算总价
    totalPrice.value = cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
}

onMounted(() => {
  fetchAddresses(); // 组件挂载时获取地址数据
  fetchCartItems(); // 组件挂载时获取购物车数据
});
</script>

<style scoped>
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

.cart-item {
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
.item-price {
  flex: 1;
  text-align: center;
}
.item-price .price {
  color: red;
  font-size: 18px;
}
</style>
