<script>
import { userRegister } from "@/api/user.js";

export default {
  name: "RegisterView",
  data() {
    return {
      registerUser: {
        username: '',
        password: '',
      },
      termAccepted: false,
      response: '',
    };
  },
  methods: {
    register() {
      if(!this.registerUser.username || !this.registerUser.password) {
        this.response = '用户名或密码不能为空';
        return;
      }
      if(!this.termAccepted) {
        this.response = '请先同意用户注册协议';
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
  }
};


</script>

<template>
  <main>
<!--    This is the 用户注册 page.-->
<!--    这部分register(username, password)函数功能不知道是否正确-->

    <div class="register-view">

      <div class="register-form">
        <h2 style="text-align: center">
          <router-link to="/user/login">登录</router-link> | <router-link to="/user/register">注册</router-link>
        </h2>
        <h3>用户注册</h3>
        <input type="text" v-model="registerUser.username" placeholder="用户名" />
        <input type="text" v-model="registerUser.password" placeholder="密码" />
        <button @click="register()">注册</button>

        <div class="terms">
          <span>
            <input id="11111" type="checkbox" v-model="termAccepted" />
            <label for="11111">已阅读并同意：所有交易过程均为模拟，仅供学习交流，不代表实际交付约定。</label>
          </span>
          {{ response }}
        </div>
      </div>
    </div>

  </main>
</template>


<style>
.terms input, label {
  display: inline;
}
.register-view {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

header {
  margin-bottom: 40px;
}

header h1 {
  margin: 0;
}

header nav {
  margin-top: 10px;
}

header nav a {
  margin: 0 15px;
  color: #4CAF50;
  text-decoration: none;
}

.register-form {
  display: inline-block;
  text-align: left;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  width: 100%;
  max-width: 600px;
}

.register-form h2, .register-form h3 {
  margin: 0 0 20px 0;
}

.register-form input[type='text'] {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-form button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 20px 0;
  border: none;
  border-radius: 4px;
  background-color: green;
  color: white;
  font-size: 16px;
}

.terms {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.terms input {
  margin-right: 10px;
}

.terms a {
  color: #4CAF50;
  text-decoration: none;
}
</style>