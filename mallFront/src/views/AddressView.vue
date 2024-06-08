<script setup>
import {ref, onMounted, computed} from 'vue';
import {useStore} from 'vuex';
import {getAddressByUsername, addAddress, deleteAddress} from "@/api/address.js";
import {useRouter} from 'vue-router';

const store = useStore();
const router = useRouter();

const username = computed(() => store.getters.username);
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
const response = ref('');

const fetchAddresses = async () => {
  try {
    const response = await getAddressByUsername(username.value);
    addresses.value = response.data;
  } catch (error) {
    console.error("获取地址数据失败", error);
  }
};

onMounted(() => {
  if (username.value) {
    fetchAddresses();
  } else {
    router.push('/user/login');
  }
});

const addNewAddress = () => {
  dialogTitle.value = '添加地址';
  editAddressData.value = {username: username.value, name: '', phone: '', city: '', street: ''};
  showDialog.value = true;
};

const saveAddress = async () => {
  try {
    // await addAddress(editAddressData.value);
    await addAddress(editAddressData.value.username,editAddressData.value.name,editAddressData.value.phone,editAddressData.value.city,editAddressData.value.street);
    addresses.value.push({...editAddressData.value});
    response.value = '地址添加成功';
    // console.log('editAddressData.value:', editAddressData.value);
  } catch (error) {
    response.value = '操作失败';
    console.error("保存地址失败", error);
  }
  closeDialog();
};

const deleteAddressById = async (index) => {
  try {
    const id = addresses.value[index].id;
    await deleteAddress(id);
    addresses.value.splice(index, 1);
    console.log('id:', id);
    response.value = '地址删除成功';
  } catch (error) {
    response.value = '地址删除失败';
    // console.log('editAddressData.value:', id);
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
      <div class="user-name">
        <label for="username">用户名</label>
        <input type="text" id="username" v-model="username" disabled/>
      </div>
    </div>
    <div class="address-section">
      <h2>地址</h2>
      <div v-for="(address, index) in addresses" :key="index" class="address-item">
        <div>
          <span>{{ index + 1 }}.  {{ address.name }} {{ address.phone }}</span>
          <p>{{ address.city }} {{ address.street }}</p>
        </div>
        <div class="address-actions">
          <button @click="deleteAddressById(index)">删除</button>
        </div>
      </div>
      <button class="add-btn" @click="addNewAddress">添加</button>
    </div>

    <div v-if="showDialog" class="dialog">
      <h3>{{ dialogTitle }}</h3>
      <input type="text" v-model="editAddressData.name" placeholder="姓名"/>
      <input type="text" v-model="editAddressData.phone" placeholder="手机号"/>
      <input type="text" v-model="editAddressData.city" placeholder="城市"/>
      <input type="text" v-model="editAddressData.street" placeholder="街道"/>

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
  padding: 20px;
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
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.address-item div {
  flex-grow: 1;
}

.address-actions button {
  margin-left: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.address-actions button:hover {
  background-color: #0056b3;
}

.add-btn {
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: white;
  cursor: pointer;
}

.add-btn:hover {
  background-color: #218838;
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
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.dialog button:hover {
  background-color: #0056b3;
}
</style>