import {httpPost, httpGet} from './public.js'

// 测试连接功能（测试接口）
export function testConnection() {
  return httpGet({
      url: '/api/users/',
      params: {},
  })
}

// 用户登录
export function userLogin (username, password) {
    return httpPost({
        url: '/api/users/login/',
        data: {
            username: username,
            password: password,
        },
    })
}

// 用户注册
export function userRegister (username, password) {
  return httpPost({
      url: '/api/users/register/',
      data: {
          username: username,
          password: password
      },
  })
}

// 检查登录状态
export function checkLoginStatus () {
  return httpGet({
      url: '/api/users/checkLogin/',
      params: {},
  })
}

// 用户登出
export function userLogout () {
  return httpGet({
      url: '/api/users/logout/',
      params: {},
  })
}