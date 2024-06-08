<script setup>
import { ref, onMounted } from 'vue';
import { getAddressByUsername, addAddress, deleteAddress } from "@/api/address.js";

// 假设用户名从某个用户状态中获取，例如Vuex或其他管理工具，根据实际情况动态获取用户名
const username = ref('李四');
const addresses = ref([]);
const showDialog = ref(false);
const dialogTitle = ref('');
const editAddressData = ref({
  username: '',
  name: '',
  phone: '',
  city: '',
  street: '',
});
const editingIndex = ref(-1);
const response = ref('');

const fetchAddresses = async () => {
  try {
    const response = await getAddressByUsername(username.value);
    addresses.value = response.data;
  } catch (error) {
    console.error("获取地址数据失败", error);
  }
};

onMounted(fetchAddresses);

const updateUsername = () => {
  console.log(`更新用户名: ${username.value}`);
  // 在这里可以添加更新用户名的API调用逻辑
};

const editAddress = (index) => {
  dialogTitle.value = '修改地址';
  editAddressData.value = { ...addresses.value[index] };
  editingIndex.value = index;
  showDialog.value = true;
};

const addNewAddress = () => {
  dialogTitle.value = '添加地址';
  editAddressData.value = { username: username.value, name: '', phone: '', city: '', street: '' };
  editingIndex.value = -1;
  showDialog.value = true;
};

const saveAddress = async () => {
  if (editingIndex.value >= 0) {
    try {
      addresses.value[editingIndex.value] = { ...editAddressData.value };
      await addAddress(editAddressData.value);
      response.value = '地址修改成功';
    } catch (error) {
      response.value = '地址修改失败';
      console.error("修改地址失败", error);
    }
  } else {
    try {
      await addAddress(editAddressData.value);
      addresses.value.push({ ...editAddressData.value });
      response.value = '地址添加成功';
    } catch (error) {
      response.value = '地址添加失败';
      console.error("添加地址失败", error);
    }
  }
  closeDialog();
};

const deleteAddressById = async (index) => {
  try {
    const id = addresses.value[index].id; // 确保地址对象中包含 `id` 属性
    await deleteAddress(id);
    addresses.value.splice(index, 1); // 从列表中移除已删除的地址
    response.value = '地址删除成功';
  } catch (error) {
    response.value = '地址删除失败';
    console.error("删除地址失败", error);
  }
};

const closeDialog = () => {
  showDialog.value = false;
};
</script>

<template>
  <main>
    <div class="user-info">
      <h2>订单管理 | 用户信息</h2>
      <div class="user-name">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" disabled />
      </div>
    </div>
    <div class="address-section">
      <h2>地址</h2>
      <div v-for="(address, index) in addresses" :key="index" class="address-item">
        <div>
          <span>{{ index + 1 }}. {{ address.name }} {{ address.phone }}</span>
          <p>{{ address.city }} {{ address.street }}</p>
        </div>
        <button @click="editAddress(index)">修改</button>
        <button @click="deleteAddressById(index)">删除</button>
      </div>
      <button @click="addNewAddress">添加</button>
    </div>

    <div v-if="showDialog" class="dialog">
      <h3>{{ dialogTitle }}</h3>
      <input type="text" v-model="editAddressData.name" placeholder="姓名" />
      <input type="text" v-model="editAddressData.phone" placeholder="手机号" />
      <input type="text" v-model="editAddressData.city" placeholder="城市" />
      <input type="text" v-model="editAddressData.street" placeholder="街道" />
      <button @click="saveAddress">保存</button>
      <button @click="closeDialog">取消</button>
    </div>
    <p>{{ response }}</p>
  </main>
</template>

<style>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.user-info {
  margin-bottom: 20px;
}

.user-name {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-name input {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.address-section {
  text-align: left;
  margin: 0 auto;
  width: 50%;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-item div {
  flex-grow: 1;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dialog input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog button {
  padding: 10px 20px;
  margin: 10px 5px;
  border: none;
  border-radius: 4px;
  background-color: #FF8000;
  color: white;
  cursor: pointer;
}
</style>



<!--
<script setup>
import { ref } from 'vue';

const username = ref('李四');
const addresses = ref([
  { name: '李四', phone: '13012341234', city: '武汉市', street: '武昌区八一路299号' },
  { name: '张三', phone: '13123452345', city: '北京市', street: '朝阳区建国路100号' },
]);

const showDialog = ref(false);
const dialogTitle = ref('');
const editAddressData = ref({
  name: '',
  phone: '',
  city: '',
  street: '',
});
const editingIndex = ref(-1);

const updateUsername = () => {
  console.log(`更新用户名: ${username.value}`);
  // 在这里可以添加更新用户名的API调用逻辑
};

const editAddress = (index) => {
  dialogTitle.value = '修改地址';
  editAddressData.value = { ...addresses.value[index] };
  editingIndex.value = index;
  showDialog.value = true;
};

const addAddress = () => {
  dialogTitle.value = '添加地址';
  editAddressData.value = { name: '', phone: '', city: '', street: '' };
  editingIndex.value = -1;
  showDialog.value = true;
};

const saveAddress = () => {
  if (editingIndex.value >= 0) {
    addresses.value[editingIndex.value] = { ...editAddressData.value };
  } else {
    addresses.value.push({ ...editAddressData.value });
  }
  closeDialog();
};

const closeDialog = () => {
  showDialog.value = false;
};
</script>

<template>
  <main>
    This is the 地址信息管理 page.

    <div class="user-info">
      <h2>订单管理 | 用户信息</h2>
      <div class="user-name">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" />
&lt;!&ndash;        感觉不用修改用户名，实现起来很复杂&ndash;&gt;
&lt;!&ndash;        <button @click="updateUsername">修改</button>&ndash;&gt;


      </div>
    </div>
    <div class="address-section">
      <h2>地址</h2>
      <div v-for="(address, index) in addresses" :key="index" class="address-item">
        <div>
          <span>{{ index + 1 }}. {{ address.name }} {{ address.phone }}</span>
          <p>{{ address.city }} {{ address.street }}</p>
        </div>
        <button @click="editAddress(index)">修改</button>
      </div>
      <button @click="addAddress">添加</button>
    </div>

    <div v-if="showDialog" class="dialog">
      <h3>{{ dialogTitle }}</h3>
      <input type="text" v-model="editAddressData.name" placeholder="姓名" />
      <input type="text" v-model="editAddressData.phone" placeholder="手机号" />
      <input type="text" v-model="editAddressData.city" placeholder="城市" />
      <input type="text" v-model="editAddressData.street" placeholder="街道" />
      <button @click="saveAddress">保存</button>
      <button @click="closeDialog">取消</button>
    </div>


  </main>
</template>

<style>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.user-info {
  margin-bottom: 20px;
}

.user-name {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-name input {
  margin-left: 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.address-section {
  text-align: left;
  margin: 0 auto;
  width: 50%;
}

.address-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.address-item div {
  flex-grow: 1;
}

.dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.dialog input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.dialog button {
  padding: 10px 20px;
  margin: 10px 5px;
  border: none;
  border-radius: 4px;
  background-color: #FF8000;
  color: white;
  cursor: pointer;
}
</style>
-->

