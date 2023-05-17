import request from '@/api/index'

export const getTranslate = (data: any) => {
  return request({
    baseURL: 'https://openapi.youdao.com',
    url: '/api',
    method: 'get',
    params: data,
  })
}

export const getPoetryOfDay = () => {
  return request({
    baseURL: 'https://v1.hitokoto.cn/?encode=json&lang=cn',
    url: '/',
    method: 'get',
  })
}

export const getIpCity = () => {
  return request({
    baseURL: 'https://restapi.amap.com',
    url: '/v3/ip?key=940a4357b2fff76d09ad090d74ccc111',
    method: 'get',
  })
}
