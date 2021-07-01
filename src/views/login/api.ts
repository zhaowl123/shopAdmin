import { fetch } from '@/axios-config/axios'

interface PropsData {
  params?: any
  data?: any
}

// export const loginApi = ({ data }: PropsData) => {
export const loginApi = ({ params }: PropsData) => {
    //http://10.113.8.129:90/mock/104/login?username=123456&password=892
    return fetch({ url: 'mock/104/login', method: 'post', params })
//   return fetch({ url: '/user/login', method: 'post', data })
}

// export const getRoleDetApi = ({ params }: PropsData) => {
//   return fetch({ url: '/role/detail', method: 'get', params })
// }
