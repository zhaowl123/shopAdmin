import request from './request'

import config from './config'

import { AxiosPromise, ResponseType } from 'axios'

const { default_headers } = config

interface Config {
  params?: any
  data?: any
  url: string
  method: 'get' | 'post' | 'delete' | 'put'
  headersType?: string
  responseType?: ResponseType
}

function fetch({ url, method, params, data, headersType, responseType }: Config): AxiosPromise {
  const map = {
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': headersType || default_headers
    }
  }
  // console.log("zwl test",map)
  return request(map)

  // return request({
  //   url: url,
  //   method,
  //   params,
  //   data,
  //   responseType: responseType,
  //   headers: {
  //     'Content-Type': headersType || default_headers
  //   }
  // })
}

export {
  fetch
}
