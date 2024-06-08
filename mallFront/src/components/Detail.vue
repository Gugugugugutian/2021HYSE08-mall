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
    async addToCart() {
      try {

        console.log('Adding to cart:', this.product);
        const response = await axios.post('/api/cart/add', {
          id: this.product.id,
          name: this.product.name,
          price: this.product.price,
          image: this.product.image,
          quantity: 1, // 初始添加的商品数量
          stock: this.product.stock // 假设商品有 stock 属性
        });
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

