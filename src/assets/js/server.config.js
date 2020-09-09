import { AID_TEMP } from './consts'
import { getCookie } from './utils'
/**
 *查看手机类型 运力模块调用
 *
 * @export systemType
 * @returns
 */
function systemType() {
  if (
    typeof AndroidAppJs !== 'undefined' &&
    // eslint-disable-next-line no-undef
    typeof AndroidAppJs.finish !== 'undefined'
  ) {
    return 1
  } else if (
    typeof window.webkit !== 'undefined' &&
    typeof window.webkit.messageHandlers !== 'undefined' &&
    typeof window.webkit.messageHandlers.nativeGoBack !== 'undefined'
  ) {
    return 2
  } else {
    return 0
  }
}
/**
 *
 *token失效客户端重新给H5赋值
 * @export AppGetTokenApi
 */
function AppGetTokenApi(sysType) {
  if (sysType === 1) {
    // eslint-disable-next-line no-undef
    AndroidAppJs.getNewH5Token()
  } else if (sysType === 2) {
    // eslint-disable-next-line no-unused-expressions
    window.webkit.messageHandlers.getNewH5Token.postMessage('')
  } else {
    console.log('当前登录信息失效了~~~')
  }
}

let aid = ''
let appVersion = ''
let token = getCookie('token')
let sysType = systemType()
let versionType
let userAgent

if (sysType === 1) {
  aid = getCookie('client_aid')
  appVersion = getCookie('app_version')
} else if (sysType === 2) {
  aid = getCookie('client_aid')
  appVersion = getCookie('app_version')
} else {
  aid = AID_TEMP
  appVersion = ''
}

// 取不到token的时候,安卓的获取token方法,ios暂时没写
if (token === null || token === '' || token === undefined) {
  AppGetTokenApi(sysType)
  token = getCookie('token')
}
token = token.toString()

versionType =
  sysType === 1
    ? { android_version: appVersion }
    : sysType === 2
    ? { ios_version: appVersion }
    : { v: appVersion }

userAgent =
  navigator.userAgent +
  (sysType === 1 ? 'KLB_ANDROID' : sysType === 2 ? 'KLB_IOS' : '')

export default {
  aid,
  appVersion, // app版本号
  token, // 登录令牌,token
  versionType,
  userAgent,
  sysType
}
