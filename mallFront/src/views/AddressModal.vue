<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>选择地址</h2>
      <ul>
        <li v-for="address in addresses" :key="address.id" @click="select(address)">
          <p>{{ address.name }} {{ address.phone }}</p> <!-- 显示地址的姓名和电话 -->
          <p>{{ address.city }} {{ address.street }}</p> <!-- 显示地址的城市和街道 -->
        </li>
      </ul>
      <button @click="$emit('close')">关闭</button> <!-- 关闭弹窗按钮 -->
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  addresses: Array // 接收地址列表作为属性
});
const emit = defineEmits(['close', 'select']); // 定义两个事件：close 和 select

const select = (address) => {
  emit('select', address); // 选择地址时触发 select 事件
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

li:hover {
  background: #f0f0f0;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: green;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
