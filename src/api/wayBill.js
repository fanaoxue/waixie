/**
 * 运单相关接口
 */
import server from '@/assets/js/request'
let $http = server.Axios
// 3002 - 删除运单
export function deleteWaybill(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3002' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3004-查询自保理状态
export function zblState(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3004' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//  3008-验证始发和目的区县是否必填
export function checkCommonCity(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3008' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
//  3013-新增前的运单查询
export function queryWaybillBefore(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3013' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3015 - 获取受票方
export function getDrawee(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3015' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3017-修改运单前的查询
export function modifyWaybillBefore(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3017' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3018-运单号重复性判断
export function waybillRepeat(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3018' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3023 - 获取运单号
export function qeuryWaybillNo(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3023' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3044-查看运单修改记录
export function modifyRecord(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3044' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3045-查看运单修改记录是否存在
export function isRecordShow(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3045' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3053-运单详情
export function waybillDetail(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3053' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3056-模板详情
export function templateDetail(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3056' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

// 3085 - 获取外协供应商
export function getCarrier(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3085' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *3080-运单列表(企业+外协)
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getWayBillList(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3080' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *11002-查询运单图片信息
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getBillImage(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '11002' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *
 *
 * @export
 * @param {*} params
 * @returns
 */
export function uploadImage(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '25014' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *
 *  11006-修改运单的回单、出库单、合同照
 * @export
 * @param {*} params
 * @returns
 */
export function uploadImgUrl(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3042' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *
 * 3084 - 派单
 * @export
 * @param {*} params
 * @returns
 */
export function deliverWaybill(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3084' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}
// 3086-外协修改运单
export function wxModifyWaybill(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3086' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *
 *  3087-终结运单
 * @export
 * @param {*} params
 * @returns
 */
export function closingWaybill(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3087' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 *
 *  3086-修改运单
 * @export
 * @param {*} params
 * @returns
 */
export function modifyWaybill(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3086' },
      iResType: 1
    })
      .then(res => {
        resolve(res)
      })
      .catch(error => {
        reject(error)
      })
  })
}

/**
 * 3093-去派车
 * @param {*} params 
 */
export function getDebangDetail(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3093' },
      iResType: 1
    }).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}