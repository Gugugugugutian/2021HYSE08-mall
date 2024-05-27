<template>
  <main class="home-view">
    <div class="top-section">
      <div class="left-block">
        <div class="carousel">
          <img v-for="(image, index) in this.$store.state.images" :src="image" :key="index" :class="{ active: currentImageIndex === index }">
        </div>
      </div>
      <div class="right-block">
        <h2>最近热销商品</h2>
        <ul>
          <li v-for="product in hotProducts" :key="product.id">
            <a @click="showDetail(product)">{{ product.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom-section">
      <div v-for="product in displayedProducts" :key="product.id" class="product" @click="showDetail(product)">
        <img :src="product.image" alt="Product Image">
        <p>{{ product.name }}</p>
        <p>{{ product.price }} 元</p>
      </div>
      <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
      <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
      <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
      <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
      <i class="product" style="height: 0; visibility: hidden; padding: 0"></i>
    </div>
    <Detail v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null"/>
  </main>
</template>

<script>
import Detail from '@/components/Detail.vue';

export default {
  components: { Detail },
  data() {
    return {
      currentImageIndex: 0,
      hotProducts: [],
      selectedProduct: null
    };
  },
  computed: {
    displayedProducts() {
      return this.$store.state.allProducts;
    }
  },
  created() {
    this.fetchHotProducts();
    this.startCarousel();
  },
  methods: {
    fetchHotProducts() {
      // Fetch hot products from backend and update hotProducts
      this.hotProducts = [
        { id: 1, name: '热销商品1', price: 100, image: 'https://img13.360buyimg.com/jdcms/s460x460_jfs/t1/227922/7/13824/61489/65db59c0Fbb4c1572/075adffbfa8abe99.jpg.avif', description: '热销商品1描述' },
        { id: 2, name: '热销商品2', price: 150, image: 'https://img13.360buyimg.com/jdcms/s460x460_jfs/t1/227922/7/13824/61489/65db59c0Fbb4c1572/075adffbfa8abe99.jpg.avif', description: '热销商品2描述为VEBU夫GIEINVURVN i文革后期二婚OVWVBUWE i v你QEUVI巫女哦亲' },
        // ... more products
      ];
    },
    startCarousel() {
      setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.$store.state.images.length;
      }, 3000); // 每3秒切换一次图片
    },
    showDetail(product) {
      this.selectedProduct = product;
    }
  }
};
</script>

<style scoped>
.home-view {
  padding: 20px;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-section {
  display: flex;
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

.left-block {
  flex: 4; /* 左侧块占据 3/4 宽度 */
  margin-right: 20px;
  border: 1px solid #ccc; /* 添加边框 */
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px 0 0 10px ; /* 圆角 */
  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); /* 渐变背景色 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.right-block {
  flex: 1;
}

.carousel {
  position: relative;
  width: 100%;
  overflow: hidden;
  max-width: 1000px; /* 控制轮播海报的最大宽度 */
  height: 600px; /* 控制轮播海报的高度 */
}

.carousel img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个容器 */
  display: none;
  transition: opacity 1s ease-in-out;
}

.carousel img.active {
  display: block;
}

.bottom-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
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

.product:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2); /* 鼠标悬停时的阴影效果 */
}

.product img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.product p {
  margin: 5px 0;
}

@media (max-width: 1024px) {
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
}
</style>
