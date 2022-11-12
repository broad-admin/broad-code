export interface Response<T = any> {
  total?: number | 0
  code: number
  message: string
  data?: T
  rows?: Array<T>
}
