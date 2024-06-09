<template>
  <div class="pay-view">
    <div v-if="orderId" class="payment-info">
      <p>请您支付{{ orderId }}号订单</p>
      <p class="total-price">¥ {{ price }}</p>
      <button @click="confirmPayment">确认支付</button>
      <p>{{ msg }}</p>
    </div>
    <div v-else>
      <p>您还没有下单</p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    price() {
      return this.$store.getters.payOrderPrice;
    },
    orderId() {
      return this.$store.getters.payOrderId;
    }
  },
  methods: {
    async confirmPayment() {
      const c = await this.$store.dispatch('payOrder1', {
        orderId: this.orderId,
      });
      // 显示信息
      this.msg = c.msg;
      // 清除缓存中的订单信息
      localStorage.removeItem('payOrderId');
      localStorage.removeItem('payOrderPrice');
      // 刷新页面
      this.$router.go(0);
    }
  },
  watch: {
    // 监听订单号，如果订单号发生变化，则刷新页面
    orderId() {
      this.$router.go(0);
    },
  },
  data() {
    return {
      msg: '',
    };
  },
};
</script>

<style>
.pay-view {
  font-family: Arial, sans-serif;
  text-align: center;
}
nav a {
  margin-right: 20px;
  text-decoration: none;
  color: green;
}
.order-steps {
  margin: 20px 0;
}
.payment-info {
  margin-top: 50px;
}
.payment-info p {
  font-size: 18px;
  margin: 10px 0;
}
.total-price {
  font-size: 36px;
  color: red;
}
button {
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
