<template>
  <main class="home-view">
    <div class="top-section">
      <div class="left-block">
        <div class="carousel">
          <!-- 左箭头按钮 -->
          <button class="carousel-arrow left-arrow" v-if="currentImageIndex > 0" @click="prevSlide">&#9664;</button>
          <img v-for="(image, index) in this.$store.state.images" :src="image" :key="index" :class="{ active: currentImageIndex === index }">
          <!-- 右箭头按钮 -->
          <button class="carousel-arrow right-arrow" v-if="currentImageIndex < this.$store.state.images.length - 1" @click="nextSlide">&#9654;</button>
          <div class="indicators">
            <span v-for="(image, index) in this.$store.state.images" :key="index" :class="{ active: currentImageIndex === index }" @click="goToSlide(index)"></span>
          </div>
        </div>

      </div>
      <div class="right-block">
        <h2>最近热销商品</h2>
        <ul>
          <li v-for="product in this.$store.state.hotProducts" :key="product.id">
            <a @click="showDetail(product)">{{ product.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="bottom-section">
      <div v-for="product in displayedProducts" :key="product.id" class="product" @click="showDetail(product)">
        <img :src="product.image" alt="Product Image">
        <p>{{ product.name }}</p>
        <p>￥{{ product.price }} </p>
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
    this.startCarousel();
  },
  methods: {
    startCarousel() {
      setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.$store.state.images.length;
      }, 3000); // 每3秒切换一次图片
    },
    showDetail(product) {
      this.selectedProduct = product;
    },
    goToSlide(index) {
      this.currentImageIndex = index;
    },
    prevSlide() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
    nextSlide() {
      if (this.currentImageIndex < this.$store.state.images.length - 1) {
        this.currentImageIndex++;
      }
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

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 10px;
  border-radius: 50%;
  z-index: 1;
}

.carousel-arrow.left-arrow {
  left: 10px;
}

.carousel-arrow.right-arrow {
  right: 10px;
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

/*.product p {
  margin: 5px 0;
}*/

.indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

.indicators span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #ccc;
  display: inline-block;
  margin: 0 5px;
  cursor: pointer;
}

.indicators span.active {
  background-color: #007bff;
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
