import request from '@/api/index'

export const getTranslate = (data: any) => {
  return request({
    url: '/agent/api',
    method: 'post',
    data,
  })
}

export const getPoetryOfDay = () => {
  return request({
    baseURL: 'https://v2.jinrishici.com',
    url: '/one.json',
    method: 'get',
  })
}
