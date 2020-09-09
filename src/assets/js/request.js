/* eslint-disable */

import axios from 'axios'
import router from '@/router'
import { Toast } from 'vant'
import { BASE_URL } from './consts'
import { AppGetTokenApi } from './app.js'
import serverConfig from './server.config'

let crypto = require('crypto')
let nodeWrapSha1 = function(message) {
  return crypto
    .createHash('sha1')
    .update(message, 'utf8')
    .digest('hex')
}
let signCreateMethod = function({ aid, token, sid, data }) {
  let signStr = aid + sid + token
  if (typeof data === 'string') {
    signStr = signStr + data
  } else {
    signStr = signStr + JSON.stringify(data)
  }
  return {
    sign: nodeWrapSha1(signStr)
  }
}
let serverData = {
  aid: serverConfig.aid, // aid
  token: serverConfig.token, // 登录令牌,token
  ext: {
    version: serverConfig.appVersion,
    terminalType: serverConfig.sysType + '',
    userAgent: serverConfig.userAgent,
    n_state: ''
  }
}
// 创建一个axios的对象
const Axios = axios.create({
  baseURL: BASE_URL,
  method: 'post',
  timeout: 60000,
  responseType: 'json',
  withCredentials: false, // 是否允许带cookie这些
  headers: Object.assign(
    {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    serverConfig.versionType
  ),
  data: {},
  iResType: 0 // 默认为0，渲染型数据类型接口 ，1：交互型数据类型接口
})
// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    config.data = Object.assign(
      config.data,
      serverData,
      signCreateMethod({ ...config.data, ...serverData })
    )
    console.log(config.data)
    return config
  },
  error => {
    return Promise.reject(error.data.error.message)
  }
)

let reCodeArr = []
let whiteList = ['2001']
// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    // 对响应数据做些事
    Toast.clear()
    if (whiteList.indexOf(JSON.parse(res.config.data).sid) > -1) {
      return res
    }
    if (res.data.reCode === '4' || res.data.reCode === '3') {
      // token 失效问题
      if (serverConfig.sysType === 0) {
        router.push({
          path: '/error_page',
          query: { errorMsg: res.data.reInfo }
        })
      } else {
        // 清除cookie里面的token变量名，再重新赋值
        var date = new Date()
        date.setTime(date.getTime() - 10000)
        document.cookie = 'token' + '=v; expires=' + date.toGMTString()
        setTimeout(() => {
          AppGetTokenApi()
        }, 2500)
      }
    } else if (
      res.data &&
      res.data.reCode !== '0' &&
      res.config.iResType === 0
    ) {
      // "跳转至错误页面并且展示服务器返回的对应的错误信息："+res.data.reInfo
      router.push({
        path: '/error_page',
        query: { errorMsg: res.data.reInfo }
      })
    } else if (
      res.data.reCode !== '0' &&
      reCodeArr.indexOf(res.data.reCode) < 0
    ) {
      // 处理除特殊code以外的情况
      Toast({ message: res.data.reInfo, forbidClick: true, duration: 2500 })
      return res
    }
    // 放过正常和特殊code
    return res
  },
  error => {
    // 跳转到错误页面...错误信息为：'+error.message;
    router.push({
      path: '/error_page',
      query: { errorMsg: error.message }
    })
    return Promise.reject(error)
  }
)
// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', { value: Axios })
  },
  Axios
}
