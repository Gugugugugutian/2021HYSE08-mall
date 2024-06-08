<template>
  <main class="search-view">
    <div class="search-bar">
      <input type="text" v-model="searchQuery" placeholder="输入搜索内容">
      <button @click="getSearchResults">确认</button>
    </div>

    <div class="results">
<!--      <div v-if="searchQuery.trim() !== '' && searchResults.length === 0">
        <p>没有找到相关商品</p>
      </div>-->
      <div v-else class="product-grid">
        <div v-for="result in searchResults" :key="result.id" class="product">
          <img :src="result.img" alt="Product Image">
          <p>{{ result.name }}</p>
          <p style="font-size: 20px; color: forestgreen">￥{{ result.price }}</p>
        </div>
        <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
        <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
        <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
        <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
        <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
      </div>
    </div>
  </main>
</template>

<script>
import { getGoods, searchGoods } from "@/api/goods.js";

export default {
  data() {
    return {
      searchQuery: '',
      searchResults: [],
    };
  },
  /*computed: {
    displayedProducts() {
      return this.searchQuery.trim() === '' ? this.$store.state.allProducts : this.searchResults;
    }
  },*/
  methods: {
    /*search() {
      if (this.searchQuery.trim() === '') {
        this.searchResults = this.$store.state.allProducts;
      } else {
        this.searchResults = this.$store.state.allProducts.filter(product =>
            product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }*/
    getSearchResults(){
      if(this.searchQuery.trim() === ''){
        this.$message.error('请输入搜索内容');
      }

      searchGoods(this.searchQuery).then(response => {
        this.searchQuery = response.data;
        console.log('搜索结果: '+ this.searchQuery);

        if(this.searchQuery.trim() !== '' && this.searchResults.length === 0 ){
          this.$message({
            message: '搜索无结果',
            type: 'warning'
          })
        }
      })
    },
    getGoodList(){
      getGoods().then(response => {
        this.searchQuery = response.data;
        }
      )
    },

  },
  created() {
    this.getGoodList();
  }
};
</script>

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
  border-color: darkgreen;
}
.search-bar button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  background-color: forestgreen;
  color: white;
  border-radius: 0 20px 20px 0; /* 右边的圆角 */
  cursor: pointer;
  transition: background-color 0.3s;
}
.search-bar button:hover {
  background-color: darkgreen;
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
  width: calc(20% - 20px);
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  transition: transform 0.3s;
  min-width: 200px;
  margin: 5px auto;
}
/*
.product-grid::after {
  content: "";
  flex: auto;
}
*/
.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 鼠标悬停时的阴影效果 */
}

.product img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

/*.product p {
  margin: 5px 0;
}*/

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
