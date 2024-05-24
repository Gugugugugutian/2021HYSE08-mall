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
    };
  },
  methods: {
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
  }
};


</script>

<template>
  <main>
    This is the 用户注册 page.
    这部分register(username, password)函数功能不知道是否正确

    <div class="register-view">

      <div class="register-form">
        <h2>注册 | 登录</h2>
        <h3>用户注册</h3>
        <input type="text" v-model="username" placeholder="用户名" />
        <input type="text" v-model="password" placeholder="密码" />
        <button @click="register()">注册</button>

<!--        <input type="text" v-model="registerUser.username" placeholder="用户名" />
        <input type="text" v-model="registerUser.password" placeholder="密码" />
        <button @click="register(registerUser.username,registerUser.password)">注册</button>-->


        <div class="terms">
          <input type="checkbox" v-model="termsAccepted" />
          <label>已阅读并同意以下协议</label>
          <div>
            <a href="#">服务协议</a>、<a href="#">隐私政策</a>、
            <a href="#">法律声明</a>、<a href="#">支付协议</a>、
            <a href="#">客户服务协议</a>
          </div>
        </div>
      </div>

    </div>

  </main>
</template>


<style>
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
}

.register-form h2, .register-form h3 {
  margin: 0 0 20px 0;
}

.register-form input {
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
  background-color: #FF8000;
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