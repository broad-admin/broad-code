import Axios, { AxiosResponse } from 'axios'
import { createDiscreteApi } from 'naive-ui'
import { Response } from '@/api/types'

export const baseURL = import.meta.env.VITE_BASE_AXIOS_URL as string

const REQUEST_HEADER = import.meta.env.VITE_BASE_REQUEST_HEADER as string

export const CONTENT_TYPE = 'Content-Type'

export const FORM_URLENCODED = 'application/x-www-form-urlencoded; charset=utf-8'

export const APPLICATION_JSON = 'application/json; charset=utf-8'

export const TEXT_PLAIN = 'text/plain; charset=utf-8'

const service = Axios.create({
  baseURL,
  timeout: 10 * 60 * 1000,
})

const { message } = createDiscreteApi(['message'])

service.interceptors.request.use(
  (config) => {
    !config.headers && (config.headers = {})
    config.headers[CONTENT_TYPE] = FORM_URLENCODED
    // 添加token请求头
    // if (!config.headers[REQUEST_HEADER]) {
    //   config.headers[REQUEST_HEADER] = useUserStoreConvex().token
    // }
    // 如果get请求，参数为对象，转换为字符串
    if (
      config.method === 'get' ||
      config.method === 'GET' ||
      config.method === 'delete' ||
      (config.method === 'DELETE' && config.data)
    ) {
      config.params = config.data
      config.data = {}
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  }
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const data = response.data
    return data
  },
  (error) => {
    if (import.meta.env.MODE === 'development') {
      console.log(error)
    }
    message.error('服务器异常，请稍后重试…')
    return Promise.reject({ code: 500, msg: '服务器异常，请稍后重试…' })
  }
)
/**
 * 异常检测
 * @param res
 */
export const abnormalInspection = (res: Response) => {
  if (res.code === 500) {
    message.error(res.message)
  }
  if (res.code === 401 || res.code === 403) {
    message.error(res.message)
  }
}

export default service
