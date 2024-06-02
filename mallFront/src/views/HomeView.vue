<template>
  <main class="home-view">
    <div class="top-section">
      <div class="left-block">
        <el-carousel height="450px">
          <el-carousel-item v-for="item in images" :key="item.id">
            <img :src="item.image" alt="" style="width: 100%; position: relative; bottom: 50%;">
          </el-carousel-item>
        </el-carousel>
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
      images: [
        {
          id: 1,
          image: 'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000366/100006849854/FocusFullshop/CkJqZnMvdDEvMjM5NTA4LzQvOTU1Ni8xMzY5MzgvNjY0YTUwMjJGMjU4ODNmM2EvN2Q5OTg2ODE5ODMzZDg3Yy5wbmcSCTEtdHlfMF81MjACOO6LekITCg_lqIHmiIjnlLXohJHljIUQAUITCg_kvJjmg6DkuqvkuI3lgZwQAkIQCgznq4vljbPmiqLotK0QBkIKCgbnsr7pgIkQB1i-2v3G9AI/cr/s/q.jpg'
        },
        {
          id: 2,
          image: 'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000366/100010511786/FocusFullshop/CkRqZnMvdDEvMjAwMTE5LzE1LzQzNDE3Lzc2NzYzNi82NjRhNTA0MkZhOWNhODExNi9kMmYyOWY5YzQ1YTEwMjQ0LnBuZxIJMy10eV8wXzU0MAI47ot6Qh8KG-e-jue0oOS9s-WEv-WptOW5vOWEv-WltueyiRABQhMKD-S9oOWAvOW-l-aLpeaciRACQhAKDOeri-WNs-aKoui0rRAGQgoKBuS8mOmAiRAHWKqb3cj0Ag/cr/s/q.jpg'
        },
        {
          id: 3,
          image: 'https://imgcps.jd.com/img-cubic/creative_server_cia_jdcloud/v2/2000318/100027956045/FocusFullshop/CkJqZnMvdDEvMjE2NDYzLzgvNDE1OTcvNDYyNjgvNjY0YTUxNzZGYjc5ZGJkN2IvYzAzMjI3ODMxMTA5ZDg0MS5wbmcSCTMtdHlfMF81NDACOL6LekIcChjpq5jlsJTlpKvlpbPlo6vlj4zogqnljIUQAUIQCgzpnIfmkrzmnaXkuLQQAkIQCgznq4vljbPmiqLotK0QBkIKCgbkvJjpgIkQB1jN9oXR9AI/cr/s/q.jpg'
        },
      ],

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

  methods: {
    showDetail(product) {
      this.selectedProduct = product;
    },
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
/*  border: 1px solid #ccc; !* 添加边框 *!*/
  padding: 10px;
  /*box-sizing: border-box;*/
/*  border-radius: 10px ; !* 圆角 *!*/
/*  background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); !* 渐变背景色 *!*/
/*  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); !* 添加阴影 *!*/
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
