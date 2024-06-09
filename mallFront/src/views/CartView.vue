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
import { getGoodsById } from '@/api/goods.js';
import router from "@/router/index.js"; // 确保路径正确

export default {
  data() {
    return {
      selectAll: false,
      cartItems: [],
    };
  },
  computed: {
    //selectedItems() {
     // return this.cartItems.filter(item => item.selected);
    //},
    selectedItemsCount() {
      return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },
    selectedItemsTotal() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
    // 根据购物车存储的id，获取商品详情
    async fetchCartItems() {
      try {
        const cartString = localStorage.getItem('cart') || '';
        const cart = this.parseCart(cartString);

        // 使用 Promise.all 并行获取每个商品的信息
        const fetchItemsPromises = cart.map(item => this.fetchCartItem(item.id).then(product => {
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
        this.cartItems = await Promise.all(fetchItemsPromises);
        console.log('Fetched cart items:', this.cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async fetchCartItem(id) {
      try {
        const response = await getGoodsById(id);
        const item = response.data[0];
        console.log(item);
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
    },

    toggleSelectAll() {
      this.cartItems.forEach(item => {
        item.selected = this.selectAll;
      });
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
    async deleteItem(id) {
      try {
        console.log(`Attempting to delete item with id: ${id}`);
        // 从 cartItems 数组中删除对应的商品
        this.cartItems = this.cartItems.filter(item => item.id !== id.toString());
        console.log('Updated cart items after deletion:', this.cartItems);

        // 更新购物车字符串
        let cartString = localStorage.getItem('cart') || '';
        let cart = this.parseCart(cartString);
        cart = cart.filter(cartItem => cartItem.id !== id.toString());
        cartString = this.stringifyCart(cart);
        localStorage.setItem('cart', cartString);
        console.log('Updated cart string after deletion:', cartString);
      } catch (error) {
        console.error(`Error deleting item with id: ${id}`, error);
      }
    },
    async deleteSelected() {
      try {
        // 过滤出未被选中的商品
        const unselectedItems = this.cartItems.filter(item => !item.selected);
        const idsToDelete = this.cartItems.filter(item => !item.selected).map(item => item.id);

        // 更新购物车字符串
        //let cartString = localStorage.getItem('cart') || '';
        const cart = unselectedItems.map(item => ({ id: item.id, quantity: item.quantity }));
        let cartString = this.stringifyCart(cart);
        localStorage.setItem('cart', cartString);
        console.log('Updated cart string after deleting unselected items:', cartString);

        // 更新 cartItems 数组
        this.cartItems = unselectedItems;
        console.log('Cart items after deleting unselected:', this.cartItems);
      } catch (error) {
        console.error('Error deleting unselected items:', error);
      }
    },

    incrementQuantity(item) {
      try {
        let cartString = localStorage.getItem('cart') || '';
        let cart = this.parseCart(cartString);
        let cartItem = cart.find(cartItem => cartItem.id === item.id);
        if (cartItem && cartItem.quantity < item.stock) {
          cartItem.quantity += 1;
          
        }
        let newCartString = this.stringifyCart(cart);
        localStorage.setItem('cart', newCartString);
        item.quantity += 1;
        console.log('Updated cart item quantity:', this.cartItems);
      } catch (error) {
        console.error('Error incrementing item quantity:', error);
      }
    },
    decrementQuantity(item) {
      try {
        let cartString = localStorage.getItem('cart') || '';
        let cart = this.parseCart(cartString);
        let cartItem = cart.find(cartItem => cartItem.id === item.id);
        if (cartItem) {
          if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
          } else {
            cart = cart.filter(cartItem => cartItem.id !== item.id);
            this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
          }
        }
        let newCartString = this.stringifyCart(cart);
        localStorage.setItem('cart', newCartString);
        if (item.quantity > 1) {
          item.quantity -= 1;
        }
        console.log('Updated cart item quantity:', this.cartItems);
      } catch (error) {
        console.error('Error decrementing item quantity:', error);
      }
    },

    // 提交订单
    submitOrder() {
      router.push('/cart/confirm');
      router.go(1);
    },
  },
  async mounted() {
    await this.fetchCartItems();
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
