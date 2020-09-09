import server from '@/assets/js/request'
let $http = server.Axios

// 8008-查询运费账户信息 -- WE组
export function getFreightInfo(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8008' },
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

// 8011-运费账户收支明细 -- WE组
export function getBudgetDetailed(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8011' },
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

// 8012-提前收款服务费计算 -- WE组
export function getReceivablesCalc(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8012' },
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

// 8012-提前收款服务费计算 -- WE组
export function applyReceivables(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8013' },
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

// 8012-提前收款服务费计算 -- WE组
export function searchReceiveRule(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8014' },
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

// 3020-提前收款按钮显示规则 -- WE组
export function receivesConfig(params) {
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

// 8034-查询外协金融合计数据 -- DO组
export function getFinanceTotal(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8034' },
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

// 11051-查询外协收款应收或已收列表 -- DO组
export function getCollectedList(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '11051' },
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

// 11052-查询外协收款不可收列表 -- DO组
export function getNotCollectedList(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '11052' },
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
