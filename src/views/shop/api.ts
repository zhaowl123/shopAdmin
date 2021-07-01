import { fetch } from '@/axios-config/axios'

export const shoplistApi = (params:{}) => {
    return fetch({ url: 'mock/104/shoplist', method: 'get', params })
}

export const shopdetailApi = (params:{}) => {
    return fetch({ url: 'mock/104/shopdetail', method: 'get', params})
}