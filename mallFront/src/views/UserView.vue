<script>
import {testConnection, userRegister, userLogin, checkLoginStatus } from "@/api/user.js";
export default {
  name: "UserView",
  methods: {
    // 测试连接
    testConnection() {
      testConnection().then(res => {
        console.log('testConnection success. ');
        console.log(res);
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
        this.response = res.msg ? res.msg : '出现未知错误';
      }).catch(err => {
        this.response = err;
        throw err;
      });
    },

    // 用户登录
    login(username, password) {
      if(!username || !password) {
        this.response = '用户名或密码不能为空';
      } else {
        userLogin(username, password).then(res => {
          this.response = res.token ? res.token : res.msg;
        }).catch(err => {
          this.response = err;
        })
      }
    },
    checkLoginStatus() {
      checkLoginStatus().then(res => {
        this.response = res.msg ? res.msg : '出现未知错误';
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
      {{ response }}
      {{ csrf }}
    </div>

    <div>
      <input type="text" v-model="username">
      <input type="text" v-model="password">
      <button @click="login(username, password, csrf)">login</button>
      {{ response }}
      {{ csrf }}
    </div>

    <button @click="checkLoginStatus">Check</button>


  </main>
</template>
