import { fetch } from '@/axios-config/axios'

export const recordlistApi = (params:{}) => {
    return fetch({ url: 'mock/104/recordlist', method: 'get', params })
}
