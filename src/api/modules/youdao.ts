import request from '@/api/index'

export const getTranslate = (data: any) => {
  return request({
    baseURL: 'http://localhost:3000',
    url: '/agent/api',
    method: 'post',
    data,
  })
}
