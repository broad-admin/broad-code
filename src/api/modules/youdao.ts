import request from '@/api/index'

export const getTranslate = (data: any) => {
  return request({
    url: '/agent/api',
    method: 'post',
    data,
  })
}
