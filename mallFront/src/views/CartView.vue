<template>
  <div class="cart-view">

    <div class="cart">

      <div class="select-all">
        <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"> 全选
        <button @click="deleteSelected">删除</button>
      </div>
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <input type="checkbox" v-model="item.selected">
        <img :src="item.image" alt="商品图片" class="product-image">
        <div class="item-details">
          <h3>{{ item.name }}</h3>
          <p>数量: {{ item.quantity }}</p>
          <p>单价: ¥{{ item.price.toFixed(2) }}</p>
        </div>
        <div class="item-price">
          <p class="price">¥{{ item.price.toFixed(2) }}</p>
          <div class="quantity-controls">
            <button @click="decrementQuantity(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="incrementQuantity(item)">+</button>
          </div>
          <p class="stock-limit">限购{{ item.stock }}件</p>
        </div>
        <div class="item-actions">
          <p @click="deleteItem(item.id)">删除</p>
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
import axios from 'axios';
import { createOrder } from '@/api/orders'; // 确保路径正确

export default {
  data() {
    return {
      selectAll: false,
      cartItems: [],
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
    // 获取购物车内容
    getCartItems() {
      return this.$store.getters.cart;
    }
  },
  methods: {
    // 更新购物车内容
    updateCartItems(str) {
      this.$store.commit('updateCart', str);
    },

    async fetchCartItems() {
      try {
        const response = await axios.get('/api/cart/items');
        this.cartItems = response.data.map(item => ({
          ...item,
          selected: false,
          price: parseFloat(item.price),  // 确保价格是数字
          quantity: parseInt(item.quantity, 10)  // 确保数量是数字
        }));
        console.log('Fetched cart items:', this.cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    toggleSelectAll() {
      this.cartItems.forEach(item => {
        item.selected = this.selectAll;
      });
    },
    async deleteItem(id) {
      try {
        console.log(`Attempting to delete item with id: ${id}`);
        const response = await axios.delete(`/api/cart/remove/${id}`);
        if (response.status === 204) {
          console.log(`Item with id: ${id} deleted successfully`);
          this.cartItems = this.cartItems.filter(item => item.id !== parseInt(id));
          console.log('Updated cart items after deletion:', this.cartItems);
        } else {
          console.error(`Failed to delete item with id: ${id}`);
        }
      } catch (error) {
        console.error(`Error deleting item with id: ${id}`, error);
      }
    },
    async deleteSelected() {
      const idsToDelete = this.selectedItems.map(item => item.id);
      for (const id of idsToDelete) {
        await this.deleteItem(id);
      }
      // 确保组件状态正确更新并重新渲染
      this.cartItems = this.cartItems.filter(item => !idsToDelete.includes(item.id));
      console.log('Cart items after deleting selected:', this.cartItems);
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
    incrementQuantity(item) {
      try {
        // 获取当前购物车字符串
        let cartString = localStorage.getItem('cart') || '';
        // 解析购物车字符串为对象数组
        let cart = this.parseCart(cartString);
        // 当前要添加的商品信息
        let newItemQuantity = 1; // +1
        if (item.quantity > 1) {
          item.quantity += newItemQuantity;
        }
        // 将对象数组转换为字符串格式
        let newCartString = this.stringifyCart(cart);
        // 保存更新后的购物车字符串到本地存储
        localStorage.setItem('cart', newCartString);
        console.log(this.product,'count sub 1:');
      }catch (error) {
        console.error('Error incrementing item quantity:', error);
      }
    },
    decrementQuantity(item) {
      try {
        // 获取当前购物车字符串
        let cartString = localStorage.getItem('cart') || '';
        // 解析购物车字符串为对象数组
        let cart = this.parseCart(cartString);
        // 当前要添加的商品信息
        let newItemQuantity = -1; // -1
        if (item.quantity > 1) {
          item.quantity += newItemQuantity;
        }
        // 将对象数组转换为字符串格式
        let newCartString = this.stringifyCart(cart);
        // 保存更新后的购物车字符串到本地存储
        localStorage.setItem('cart', newCartString);
        console.log(this.product,'count sub 1:');
      }catch (error) {
        console.error('Error decrementing item quantity:', error);
      }
    },
    async updateCartItem(item) {
      try {
        await axios.post('/api/cart/update', item);
      } catch (error) {
        console.error('Error updating cart item:', error);
      }
    },
    async submitOrder() {
      try {
        const username = 'testuser'; // Replace with actual username
        const date = new Date().toISOString().split('T')[0];
        const total = this.selectedItemsTotal;
        const address = 'Test Address'; // Replace with actual address
        const orderTime = new Date().toISOString();
        const completionTime = new Date().toISOString(); // Replace with actual completion time
        const goods = this.selectedItems;

        console.log('Creating order with the following data:', {
          username, date, total, address, orderTime, completionTime, goods
        });

        const response = await createOrder(username, date, total, address, orderTime, completionTime, goods);
        if (response && response.data) {
          console.log('Order created successfully:', response.data);
          // 订单创建成功后的操作，例如清空购物车或导航到订单确认页面
          this.cartItems = this.cartItems.filter(item => !goods.includes(item));
          alert('订单已提交！');
          // 这里你可以添加任何其他的逻辑来处理订单成功后，例如跳转到订单确认页面
        } else {
          console.error('Failed to create order:', response);
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    },
  },
  mounted() {
    this.fetchCartItems();
  },
};
</script>

<style scoped>
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
