import server from '@/assets/js/request'
let $http = server.Axios

/**
 *获取下载支付二维码链接
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getAlipayQRcode(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3061' },
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
 *3020-获取企业配置信息
 * @export
 * @param {*} params
 * @returns
 */
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

// 1008-查询自供应链金融配置
export function supplyChainState(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '1008' },
      iResType: 1
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}