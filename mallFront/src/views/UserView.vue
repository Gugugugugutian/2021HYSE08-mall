<script>
import {testConnection, userRegister} from "@/api/user.js";
export default {
  name: "UserView",
  methods: {
    // 测试连接
    testConnection() {
      testConnection().then(res => {
        console.log(res);
      }).catch(err => {
        throw err;
      });
    },
    // 用户注册
    register(username, password) {
      if(!username || !password) {
        this.registerUser.response = '用户名或密码不能为空';
        return;
      }
      userRegister(this.registerUser.username, this.registerUser.password).then(res => {
        this.registerUser.response = res.msg ? res.msg : '出现未知错误';
      }).catch(err => {
        this.registerUser.response = err;
        throw err;
      });
    }
  },
  data() {
    return {
      registerUser: {
        username: '',
        password: '',
        response: '',
      }
    };
  }
};
</script>

<template>
  <main>
    This is the user page.
    <button @click="testConnection">testConnection</button>

    <div>
      <input type="text" v-model="registerUser.username">
      <input type="text" v-model="registerUser.password">
      <button @click="register(registerUser.username, registerUser.password)">register</button>
      {{ registerUser.response }}
    </div>

  </main>
</template>
