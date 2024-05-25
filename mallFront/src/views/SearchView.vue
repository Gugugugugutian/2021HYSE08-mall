<script>
export default {
  data() {
    return {
      searchQuery: '',
      // allProducts: [
      //   { id: 1, name: '商品1', price: 100, image: 'https://img13.360buyimg.com/jdcms/s460x460_jfs/t1/227922/7/13824/61489/65db59c0Fbb4c1572/075adffbfa8abe99.jpg.avif' },
      //   { id: 2, name: '商品2', price: 150, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
      //   { id: 3, name: '商品3', price: 200, image: 'product3.jpg' },
      //   { id: 4, name: '商品4', price: 250, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
      //   { id: 5, name: '商品5', price: 300, image: 'product5.jpg' },
      //   { id: 6, name: '商品6', price: 350, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
      //   { id: 7, name: '商品7', price: 400, image: 'product7.jpg' },
      //   { id: 8, name: '商品8', price: 450, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' },
      //   { id: 9, name: '商品9', price: 500, image: 'product9.jpg' },
      //   { id: 10, name: '商品10', price: 550, image: 'https://img14.360buyimg.com/jdcms/s460x460_jfs/t1/229379/13/4014/85507/655d62e7F106e7769/cfa900da74ba1414.jpg.avif' }
      // ],
      searchResults: []
    };
  },
  computed: {
    displayedProducts() {
      return this.searchQuery.trim() === '' ? this.$store.state.allProducts : this.searchResults;
    }
  },
  methods: {
    search() {
      if (this.searchQuery.trim() === '') {
        this.searchResults = this.$store.state.allProducts;
      } else {
        this.searchResults = this.$store.state.allProducts.filter(product =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }
  },
  mounted() {
    this.searchResults = this.$store.state.allProducts;
  }
};
</script>

<template>
  <main class="search-view">
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="输入搜索内容">
      <button @click="search">确认</button>
    </div>

    <div class="results">
      <div v-if="searchQuery.trim() !== '' && searchResults.length === 0">
        <p>没有找到相关商品</p>
      </div>
      <div v-else class="product-grid">
        <div v-for="result in displayedProducts" :key="result.id" class="product">
          <img :src="result.image" alt="Product Image">
          <p>{{ result.name }}</p>
          <p>{{ result.price }} 元</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.search-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  border-radius: 20px;
  background-color: #f8f8f8; /* 添加一个背景颜色以突出搜索栏 */
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* 添加阴影以提升视觉效果 */
}

.search-bar input {
  flex: 1;
  max-width: 500px;
  padding: 10px 15px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 20px 0 0 20px; /* 左边的圆角 */
  outline: none;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #007BFF;
}

.search-bar button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: #007BFF;
  color: white;
  border-radius: 0 20px 20px 0; /* 右边的圆角 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background-color: #0056b3;
}

.results {
  margin-top: 20px;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  //gap: 0; /* 添加间隙，使商品之间有一些间距 */
}

.product {
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
  width: calc(20% - 20px);
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: transform 0.3s;
}

.product:hover {
  transform: translateY(-5px);
}

.product img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.product p {
  margin: 5px 0;
}

/*@media (max-width: 1024px) {
  .product {
    width: calc(25% - 20px);
  }
}

@media (max-width: 768px) {
  .product {
    width: calc(33.33% - 20px);
  }
}

@media (max-width: 480px) {
  .product {
    width: calc(50% - 20px);
  }
}*/
</style>
