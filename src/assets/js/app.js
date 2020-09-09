/* eslint-disable */
import serverConfig from './server.config'
let { sysType } = serverConfig

/**
 *查看手机类型 运力模块调用
 *
 * @export systemType
 * @returns
 */
export function systemType() {
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
 * 判断是否在浏览器
 */
export function isWeb() {
  if (sysType === 0) {
    return true
  }
  return false
}
/**
 *
 *app关闭当前webview窗口方法
 * @export AppFinish
 * @param {*} item
 */
export function AppFinish(item) {
  // 判断机型
  if (sysType === 1) {
    // android写法
    // eslint-disable-next-line no-undef
    AndroidAppJs.finish('')
  } else if (sysType === 2) {
    // ios写法
    window.webkit.messageHandlers.nativeGoBack.postMessage('')
  } else {
    window.history.go(item)
  }
}
/**
 *
 *证件识别 带参数
 * @export
 * @param {*}
 */
export function startRecgnizeWithParam(json) {
  if (sysType === 1) {
    // JSON.stringify(json)
    // eslint-disable-next-line no-undef
    AndroidWaybillJs.startRecgnizeWithParam(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.startRecgnizeWithParam.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('此操作只可在快路宝app，快去下载吧~~~')
  }
}
/**
 *
 *【KS1006】H5Ocr识别结果页面返回，刷新对应运单识别状态
 * @export
 * @param {*}
 */
export function refreshWaybllRecState(json) {
  if (sysType === 1) {
    // JSON.stringify(json)
    // eslint-disable-next-line no-undef
    AndroidWaybillJs.refreshWaybllRecState(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.refreshWaybllRecState.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('此操作只可在快路宝app，快去下载吧~~~')
  }
}
/**
 *
 *证件识别
 * @export
 * @param {*}
 */
export function startRecgnize(json) {
  if (sysType === 1) {
    // JSON.stringify(json)
    // eslint-disable-next-line no-undef
    AndroidWaybillJs.startRecgnize('')
  } else if (sysType === 2) {
    window.webkit.messageHandlers.startRecgnize.postMessage('')
  } else {
    console.log('此操作只可在快路宝app，快去下载吧~~~')
  }
}
/**
 *
 *token失效客户端重新给H5赋值
 * @export AppGetTokenApi
 */
export function AppGetTokenApi() {
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
/**
 *
 *json客户端修改运单成功后更新列表所需数据
 * @export AppUpdateWaybillData
 */
export function AppUpdateWaybillData(json) {
  // 修改运单成功后更新列表数据
  if (sysType === 1) {
    // eslint-disable-next-line no-undef
    AndroidWaybillJs.updateWaybillData(JSON.stringify(json))
  } else if (sysType === 2) {
    // eslint-disable-next-line no-unused-expressions
    window.webkit.messageHandlers.updateWaybillData.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('该功能仅限于app端使用')
  }
}
/**
 *
 *客户端刷新列表方法
 * @export AppUpdateWaybillData
 */
export function AppRefreshData(json) {
  // 客户端刷新列表方法
  if (sysType === 1) {
    // eslint-disable-next-line no-undef
    AndroidWaybillJs.refreshNativePage(JSON.stringify(json))
  } else if (sysType === 2) {
    // eslint-disable-next-line no-unused-expressions
    window.webkit.messageHandlers.refreshNativePage.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('该功能仅限于app端使用')
  }
}
/**
 * type "0" : 默认客户端点击返回一层一层返回 "1"：返回直接关闭页面
 *客户端头部点击返回控制方法
 * @export AppHowtoBack
 */
export function AppHowtoBack(type) {
  let json = { type: type }
  if (sysType === 1) {
    // android写法
    // eslint-disable-next-line no-undef
    AndroidAppJs.howToBack(JSON.stringify(json))
  } else if (sysType === 2) {
    // ios写法
    // eslint-disable-next-line no-unused-expressions
    window.webkit.messageHandlers.howToBack.postMessage(JSON.stringify(json))
  } else {
    console.log('该功能仅限于app端使用')
  }
}
/**
 *
 * type:taxWaybillId,获取建单成功后得到的参数
 * @export
 * @param {*} type
 */
export function buildBillAgain(type) {
  // 再建一单关闭webView方法
  let json = { taxWaybillId: type }
  if (sysType === 1) {
    // android写法
    // eslint-disable-next-line no-undef
    AndroidWaybillJs.buildBillAgain(JSON.stringify(json))
  } else if (sysType === 2) {
    // ios写法
    // eslint-disable-next-line no-unused-expressions
    window.webkit.messageHandlers.buildBillAgain.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('该功能仅限于app端使用')
  }
}
/**
 *
 *客户端刷新列表方法
 * @export AppUpdateWaybillData
 */
export function AppGotoTell(mobileNo) {
  // 客户端刷新列表方法
  if (sysType === 1) {
    // eslint-disable-next-line no-undef
    AndroidAppJs.callPhone(JSON.stringify(mobileNo))
  } else if (sysType === 2) {
    // eslint-disable-next-line no-unused-expressions
    let json = {
      tel: mobileNo
    }
    window.webkit.messageHandlers.callPhone.postMessage(JSON.stringify(json))
  } else {
    console.log('该功能仅限于app端使用')
  }
}

/**
 *客户端刷新列表方法
 *
 * @export
 * @param {*} json
 */
export function AppRefreshUpload(json) {
  // 客户端刷新列表方法
  try {
    if (sysType === 1) {
      // eslint-disable-next-line no-undef
      AndroidWaybillJs.uploadProtocolOrPoundSuccess(JSON.stringify(json))
    } else if (sysType === 2) {
      // eslint-disable-next-line no-unused-expressions
      window.webkit.messageHandlers.uploadProtocolOrPoundSuccess.postMessage(
        JSON.stringify(json)
      )
    } else {
      console.log('该功能仅限于app端使用')
    }
  } catch (e) {}
}

/**
 *查看手机类型
 *
 * @export
 * @returns
 */
export function getDeviceType() {
  var u = navigator.userAgent
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
    return 1
  } else if (u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    return 2
  }
  return 0
}

/**
 *
 *app打开新窗口跳转
 * @export openNewWindow
 * @param {*} item {\"url\":\"https://www.baidu.com\"}
 */
export function openNewWindow(item) {
  // 判断机型
  if (sysType === 1) {
    // android写法
    // eslint-disable-next-line no-undef
    AndroidYunliJs.openNewWindow(JSON.stringify(item))
  } else if (sysType === 2) {
    // ios写法
    window.webkit.messageHandlers.openNewWindow.postMessage(
      JSON.stringify(item)
    )
  } else {
    // window.open(item.url)
    window.location.href = item.url
    console.log('该功能仅限于app端使用')
  }
}

/**
 *H5隐藏客户端原生导航栏
 *JS1001
 * @export
 * @param {*} json
 */
export function ApphiddenNativeNav() {
  // H5隐藏客户端原生导航栏
  if (sysType === 1) {
    // eslint-disable-next-line no-undef
    AndroidAppJs.hiddenNativeNav()
  } else if (sysType === 2) {
    // eslint-disable-next-line no-unused-expressions
    window.webkit.messageHandlers.hiddenNativeNav.postMessage('')
  } else {
    console.log('该功能仅限于app端使用')
  }
}

/**
 *
 *app刷新前窗口数据
 * @export refreshPrePageWhenGoBack
 * @param {*} item
 */
export function refreshPrePageWhenGoBack() {
  // 判断机型
  if (sysType === 1) {
    // android写法
    // eslint-disable-next-line no-undef
    AndroidYunliJs.refreshPrePageWhenGoBack()
  } else if (sysType === 2) {
    // ios写法
    window.webkit.messageHandlers.refreshPrePageWhenGoBack.postMessage('')
  } else {
    console.log('该功能仅限于app端使用')
  }
}

/**
 * 去原生的建单页面
 *
 * @export
 */
export function openWaybillModule(json) {
  // 判断机型
  if (sysType === 1) {
    // android写法
    // eslint-disable-next-line no-undef
    AndroidYunliJs.openWaybillModule(JSON.stringify(json))
  } else if (sysType === 2) {
    // ios写法
    window.webkit.messageHandlers.openWaybillModule.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('该功能仅限于app端使用')
  }
}

/**
 * 收款人信息页返回
 *
 * @export 1004
 */
export function receivePersonBack(json) {
  // 判断机型
  if (sysType === 1) {
    AndroidWaybillJs.updateWaybillDataNew(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.updateWaybillDataNew.postMessage(
      JSON.stringify(json)
    )
  } else {
    window.history.go('-1')
  }
}

/**
 *
 *H5隐藏原生头部方法【JS1002】
 * @export
 * @param {*}
 */
export function setNativeHead(json) {
  try {
    if (sysType === 1) {
      // eslint-disable-next-line no-undef
      console.log(JSON.stringify(json))
      AndroidAppJs.setNativeHead(JSON.stringify(json))
    } else if (sysType === 2) {
      // eslint-disable-next-line no-unused-expressions
      console.log(JSON.stringify(json))
      window.webkit.messageHandlers.setNativeHead.postMessage(
        JSON.stringify(json)
      )
    } else {
      console.log(JSON.stringify(json))
      console.log('该功能仅限于app端使用')
    }
  } catch (error) {}
}

/**
 *  分享
 *
 * @export
 */
export function goToShare(json) {
  // 判断机型
  if (sysType === 1) {
    AndroidAppJs.goToShare(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.goToShare.postMessage(JSON.stringify(json))
  } else {
    console.log('分享暂无此功能！')
  }
}

/**
 *  跳转列表
 * 【JSO-001】
 * @export
 */
export function jumpIndex(json) {
  // 判断机型
  if (sysType === 1) {
    AndroidWaybillJs.jumpIndex(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.jumpIndex.postMessage(JSON.stringify(json))
  } else {
    console.log('该功能仅限于app端使用')
  }
}

/**
 * 【JS - 1007】
 * operateWaybill企业外协 + 承运商外协运单删除、修改、刷新等
 * @export
 */
export function operateWaybill(json) {
  // 判断机型
  if (sysType === 1) {
    JsEnterpriseWaybill.operateWaybill(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.operateWaybill.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('该功能仅限于app端使用')
  }
}

/**
 *【JS-1008】关闭当前webview窗口，并且回调上个窗口webviewJS方法
 *
 * @export
 * @param {*} json
 */
export function finishCallBack(json) {
  // 判断机型
  if (sysType === 1) {
    AndroidAppJs.finishCallBack(JSON.stringify(json))
  } else if (sysType === 2) {
    window.webkit.messageHandlers.finishCallBack.postMessage(
      JSON.stringify(json)
    )
  } else {
    console.log('该功能仅限于app端使用')
  }
}
