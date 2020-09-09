import server from '@/assets/js/request'
let $http = server.Axios
// 3049-获取运单最热门起始目的地
export function getHotCity(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3049' },
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

// 3020-获取企业配置信息
export function getCompanyConfig(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3020' },
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
 *3022 车队选择列表数据请求
 * @export
 * @returns
 */
export function getDriverMsgList(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3022' },
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
 *3003 车队选择列表数据请求
 * @export
 * @returns
 */
export function getDriverMsgSearch(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3003' },
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

//3101-推送承运信息
export function pushCarInfo(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3101' },
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
