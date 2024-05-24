<script>
import { testConnection, userRegister } from "@/api/user.js";
export default {
  name: "UserView",
  methods: {
    // 测试连接
    testConnection() {
      testConnection().then(res => {
        this.response = res.msg;
      }).catch(err => {
        throw err;
      });
    },
    // 用户注册
    register(username, password) {
      if(!username || !password) {
        this.response = '用户名或密码不能为空';
        return;
      }
      userRegister(this.registerUser.username, this.registerUser.password).then(res => {
        this.response = res;
      }).catch(err => {
        if(err.code === 'ERR_BAD_REQUEST') {
          this.response = '用户名已存在';
        } else {
          this.response = '出现未知错误';
        }
        throw err;
      });
    },
    // 用户登录
    login(username, password) {
      this.$store.dispatch('userLogin', {
        username: this.username,
        password: this.password,
      }).then(res => {
        this.response = res ? res : 'Unknown Error';
      }).catch(err => {
        this.response = err;
        throw err;
      });
    },
    // 检查登录状态
    checkLoginStatus() {
      return this.$store.dispatch('userCheckLoginStatus').then(res => {
        if(res) {
          this.response = res;
        }
      }).catch(err => {
        this.response = err;
      });
    },
    // 用户登出
    userLogout() {
      return this.$store.dispatch('userLogout').then(res => {
        this.response = res ? res : 'Unknown Error';
      }).catch(err => {
        this.response = err;
        throw err;
      });
    }
  },
  data() {
    return {
      registerUser: {
        username: '',
        password: '',
      },
      username: '',
      password: '',
      response: '',
      csrf: '',
    };
  },
  mounted() {
    const c = document.cookie.split(';').map(item => item.split('='));
    this.csrf = c.find(item => item[0] === 'csrftoken')[1];
    console.log(this.csrf);
  },
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
    </div>

    <div>
      <input type="text" v-model="username">
      <input type="text" v-model="password">
      <button @click="login(username, password)">login</button>
      {{ response }}
      {{ csrf }}
    </div>

    <button @click="checkLoginStatus">Check</button>
    <button @click="userLogout">Logout</button>

  </main>
</template>
