<script>
import { useRouter } from "vue-router";
import router from "@/router/index.js";
export default {
  name: "LoginView",
  data() {
    return {
      username: '',
      password: '',
      response: '',
      // 登录后，重定向到这个链接
      redirect: undefined,
    };
  },
  mounted() {
    const router = useRouter();
    this.redirect = router.currentRoute.value.query.redirect ? router.currentRoute.value.query.redirect : '/user';
    console.log(this.redirect);
  },
  methods: {
    // 用户登录
    login() {
      this.$store.dispatch('userLogin', {
        username: this.username,
        password: this.password,
      }).then(res => {
        this.response = res ? res : 'Unknown Error';
        router.go(0);
      }).catch(err => {
        this.response = err;
        throw err;
      });
    },
    // 用户登出
    logout() {
      return this.$store.dispatch('userLogout').then(res => {
        this.response = res ? res : 'Unknown Error';
      }).then(()=> {
        console.log('a');
      }).catch(err => {
        this.response = err;
        throw err;
      });
    },
    goBack() {
      router.push(this.redirect);
    },
  },
  computed: {
    isLogin() {
      return !!this.$store.getters.username;
    },
    curUsername() {
      return this.$store.getters.username;
    },
  },
};
</script>

<template>
  <div class="login-view">
    <main>
      <div class="login-form">
        <h2 style="text-align: center" v-if="!isLogin">
          <router-link to="/user/login">登录</router-link> | <router-link to="/user/register">注册</router-link>
        </h2>
        <h2 style="text-align: center" v-else>
          已登录
        </h2>
        <div v-if="!isLogin">
          <h3>你好，请登录</h3>
          <input type="text" v-model="username" placeholder="用户名" />
          <input type="text" v-model="password" placeholder="密码" />
          <button @click="login()">登录</button>
          <div class="links">
            {{ response }}
          </div>
        </div>
        <div v-else>
          <h3>你好，{{ curUsername }}</h3>
          <button v-if="redirect!=='/user'" @click="goBack()">继续查看登录前的页面</button>
          <button @click="logout()">退出</button>
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
  width: 100%;
  max-width: 600px;
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
  background-color: green;
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