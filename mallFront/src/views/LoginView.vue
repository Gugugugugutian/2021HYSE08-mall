<script>
export default {
  name: "LoginView",
  methods: {
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
  },
  data() {
    return {
      username: '',
      password: '',
    };
  },
};
</script>

<template>
  <div class="login-view">
    <main>
      This is the 用户登录 page.

      test_sun
      <div class="login-form">
        <h2>注册 | 登录</h2>
        <h3>你好，请登录</h3>
        <input type="text" v-model="username" placeholder="用户名" />
        <input type="text" v-model="password" placeholder="密码" />
        <button @click="login(username,password)">登录</button>
        <div class="links">
          界面跳转可能需要靠前端
          <router-link to="/register">免费注册</router-link>
          <a href="#">忘记账号</a>
          <a href="#">忘记密码</a>
        </div>
      </div>
    </main>

  </div>


</template>


<style>
.login-view {
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

.login-form {
  display: inline-block;
  text-align: left;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.login-form h2, .login-form h3 {
  margin: 0 0 20px 0;
}

.login-form input {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.login-form button {
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

.links {
  display: flex;
  justify-content: space-between;
}

.links a, .links router-link {
  color: #4CAF50;
  text-decoration: none;
}


</style>