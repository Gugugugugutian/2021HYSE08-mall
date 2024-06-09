@ -0,0 +1,95 @@
<template>
  <div class="detail-overlay" @click.self="close">
    <div class="detail-container">
      <button class="close-button" @click="close">&#x2715;</button>
      <img :src="product.image" alt="Product Image">
      <h2>{{ product.name }}</h2>
      <p>￥{{ product.price }} </p>
      <p>{{ product.description }}</p>
      <button class="add-to-cart" @click="addToCart">添加到购物车</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('close');
    },
    parseCart(str) {
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
    },
    stringifyCart(cart) {
      return cart.map(item => `${item.id}:${item.quantity}`).join(',');
    },
    async addToCart() {
      try {
        // 获取当前购物车字符串
        let cartString = localStorage.getItem('cart') || '';

        // 解析购物车字符串为对象数组
        let cart = this.parseCart(cartString);

        // 当前要添加的商品信息
        let newItemId = this.product.id.toString();
        let newItemQuantity = 1; // 假设每次只添加一个商品

        // 检查新商品ID是否已经存在
        let itemExists = cart.find(item => item.id === newItemId);
        if (itemExists) {
          itemExists.quantity += newItemQuantity;
          console.log(`商品ID ${newItemId} 已经存在于购物车中。`);
        } else {
          // 添加新商品
          cart.push({ id: newItemId, quantity: newItemQuantity });
        }

        // 将对象数组转换为字符串格式
        let newCartString = this.stringifyCart(cart);

        // 保存更新后的购物车字符串到本地存储
        localStorage.setItem('cart', newCartString);

        console.log('Adding to cart:', this.product);
        alert('商品已添加到购物车');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('添加商品到购物车失败');
      }
    }
  }
};
</script>

<style scoped>
.detail-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
}

.detail-container {
  width: 530px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.add-to-cart {
  display: block;
  margin-top: 20px;
  padding: 10px;
  background-color: forestgreen;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}

.add-to-cart:hover {
  background-color: #0056b3;
}
</style>

