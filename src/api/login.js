import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}
export function personal_login(code) {
  return request({
    url: '/user/personal_login',
    method: 'post',
    data: {
      code
    }
  })
}


export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
