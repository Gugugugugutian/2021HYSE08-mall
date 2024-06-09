<template>
  <div class="confirm-view">
    <div class="order-steps">
      <h2>购物车 &gt; 确认订单 &gt; 支付</h2>
    </div>
    <div class="shipping-info">
      <div class="address">
        <p>{{ defaultAddress.name }} {{ defaultAddress.phone }}</p>
        <p>{{ defaultAddress.city }} {{ defaultAddress.street }}</p>
      </div>
      <button @click="showAddressModal">其他地址</button>
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

    <AddressModal v-if="showModal" @close="showModal = false" @select="selectAddress" :addresses="addresses" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import AddressModal from './AddressModal.vue'; // 引入 AddressModal 组件
import { getAddressByUsername } from "@/api/address.js";

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

const confirmOrder = () => {
  alert('订单已确认');
};

onMounted(() => {
  fetchAddresses(); // 组件挂载时获取地址数据
});
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
