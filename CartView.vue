<template>
  <div class="cart-view">
    <h1>线上商城</h1>

    <div class="cart">
      <h2>购物车 &gt; 确认订单 &gt; 支付</h2>
      <div class="select-all">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"> 全选
        <button @click="deleteSelected">删除</button>
      </div>
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <input type="checkbox" v-model="item.selected">
        <img :src="item.image" alt="商品图片" class="product-image">
        <div class="item-details">
          <h3>【狂欢价】【旗舰款】</h3>
          <p>casio/卡西欧计算器FX-{{ item.id }}</p>
          <p>颜色分类：fx-999CN CW-白色【旗舰款】</p>
        </div>
        <div class="item-price">
          <p class="price">¥{{ item.price.toFixed(2) }}</p>
          <div class="quantity-controls">
            <button @click="decrementQuantity(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="incrementQuantity(item)">+</button>
          </div>
          <p class="stock-limit">限购{{ item.limit }}件</p>
        </div>
        <div class="item-actions">
          <p @click="moveToWishlist(item)">移入收藏夹</p>
          <p @click="deleteItem(item)">删除</p>
        </div>
      </div>
      <div class="cart-summary">
        <p>共 {{ selectedItemsCount }} 件， ¥{{ selectedItemsTotal.toFixed(2) }}</p>
        <button @click="submitOrder">提交订单</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      selectAll: false,
      cartItems: [
        { id: 1, selected: true, image: 'image_url', stock: 58, price: 198.00, quantity: 1, limit: 20 },
        { id: 2, selected: true, image: 'image_url', stock: 58, price: 198.00, quantity: 1, limit: 20 },
        { id: 3, selected: true, image: 'image_url', stock: 58, price: 198.00, quantity: 1, limit: 20 },
      ],
    };
  },
  computed: {
    selectedItems() {
      return this.cartItems.filter(item => item.selected);
    },
    selectedItemsCount() {
      return this.selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    selectedItemsTotal() {
      return this.selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
  },
  methods: {
    toggleSelectAll() {
      this.cartItems.forEach(item => {
        item.selected = this.selectAll;
      });
    },
    deleteSelected() {
      this.cartItems = this.cartItems.filter(item => !item.selected);
    },
    incrementQuantity(item) {
      if (item.quantity < item.limit) {
        item.quantity += 1;
      }
    },
    decrementQuantity(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    moveToWishlist(item) {
      // 移动到收藏夹逻辑
      alert(`商品 ${item.id} 已移入收藏夹！`);
    },
    deleteItem(item) {
      this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
    },
    submitOrder() {
      // 提交订单逻辑
      alert('订单已提交！');
      this.$router.push({
        path: '/cart/confirm',
        query: {
          items: JSON.stringify(this.selectedItems),
          total: this.selectedItemsTotal,
        },
      });
    },
  },
};
</script>

<style>
.cart-view {
  font-family: Arial, sans-serif;
}
nav a {
  margin-right: 20px;
  text-decoration: none;
  color: green;
}
.cart {
  margin-top: 20px;
}
.select-all {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.select-all input {
  margin-right: 10px;
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
.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity-controls button {
  width: 30px;
  height: 30px;
}
.stock-limit {
  font-size: 12px;
  color: orange;
}
.item-actions {
  flex: 1;
  text-align: right;
}
.item-actions p {
  cursor: pointer;
  color: blue;
  margin: 2px 0;
}
.cart-summary {
  text-align: right;
  margin-top: 20px;
}
.cart-summary button {
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
