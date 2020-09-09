import server from '@/assets/js/request'
let $http = server.Axios

/**
 *进入选择油卡页面前的查询
 *
 * @export
 * @param {*} params
 * @returns
 */
export function selectOilCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16001' },
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
 *通过手机号判断是否已经开通电子油卡
 *
 * @export
 * @param {*} params
 * @returns
 */
export function openElectronicOilCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16006' },
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
 * 绑定油卡
 *
 * @export
 * @param {*} params
 * @returns
 */
export function newAddOilCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16002' },
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
 * 绑定油卡接口
 *
 * @export
 * @param {*} params
 * @returns
 */
export function bindOilCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16004' },
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
 * 油卡校验接口
 *
 * @export
 * @param {*} params
 * @returns
 */
export function oilCardCheck(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16005' },
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
 * 获取电子油卡卡号
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getOilCardNo(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16008' },
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
 *判断是否是电子油卡
 *
 * @export
 * @param {*} oilCardNo
 * @returns
 */
export function queryOilCardType(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '16007' },
      iResType: 1
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}
