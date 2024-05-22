import {httpPost, httpGet} from './public.js'

// 测试连接功能（测试接口）
export function testConnection() {
  return httpGet({
      url: '/api/users/',
      params: {},
  })
}

// 用户登录
export function userLogin (params) {
  return httpPost({
      url: '/api/users/login/',
      data: params
  })
}

// 用户注册
export function userRegister (username, password) {
  return httpPost({
      url: '/api/users/register/',
      data: new Object({
          username: username,
          password: password
      }),
  })
}
