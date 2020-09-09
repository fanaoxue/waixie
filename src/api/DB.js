import server from '@/assets/js/request';
let $http = server.Axios;

/**
 *3095-我的货源列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getMySourceOfGoodsList(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3095' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * 3096-货源关联运单列表
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getWaybillLinkList(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3096' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *  3092-关联详情
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getSupplyDetails(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3092' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *  3094-确认关联
 *
 * @export
 * @param {*} params
 * @returns
 */
export function submitSupply(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3094' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *   3098-德邦订单报价详情
 *
 * @export
 * @param {*} params
 * @returns
 */
export function getQuotationDetails(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3098' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *   3099-去报价
 *
 * @export
 * @param {*} params
 * @returns
 */
export function goQuotation(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3099' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *    3100-德邦订单条数
 *
 * @export
 * @param {*} params
 * @returns
 */
export function goQuotationStatistics(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3100' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 *     3104-货源列表搜索
 *
 * @export
 * @param {*} params
 * @returns
 */
export function searchGoodsResultApi(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3104' },
      iResType: 1,
    })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
  });
}
