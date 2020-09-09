/**
 * 申请支付相关接口
 */
import server from '@/assets/js/request'
let $http = server.Axios
//3079 - 新申请支付运单信息
export function applyDataInit(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3079' },
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
//5015- 获取填写收款信息页面银行卡列表
export function gateCheckOfCardNum(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '5015' },
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
// 8003-获取填写收款信息页面收款记录列表
export function getRecPayHistory(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8003' },
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
// 9000-申请支付根据卡号获取开户行名称
export function getBankName(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '9000' },
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
// 8007-获取好运宝钱包
export function getHYBwallet(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8007' },
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
//  8002-计算服务费
export function computedPayServerNum(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8002' },
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
// 8000-申请支付
export function sureApplyPay(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8000' },
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
// 8004-申请支付根据卡号获取开户行名称
export function deletePayPerson(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8004' },
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
// 8006 - 查询上一笔运费是否是相同的司机收款
export function beforeSureApplyPay(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8006' },
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
// 5020 - 选择本人后获取身份证号
export function getIdCard(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '5020' },
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
//  8008-查询运费账户信息
export function queryWaybillAccount(params) {
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
// 8009 - 验证支付密码接口
export function yanzhengPWD(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8009' },
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
// 8010-确认支付
export function ensureForPayment(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8010' },
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
// 8005 - 收款人信息录入
export function infoEntry(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8005' },
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

// 3083 - 企业申请支付查询信息
export function queryForPaymentMsg(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3083' },
      iResType: 1
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 3035 -支付明细
export function waybillPayMsg(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3035' },
      iResType: 1
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

//  3082-确认支付前的查询
export function queryPaymentInfo(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3082' },
      iResType: 1
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 3088-获取运单状态和角色信息
export function queryPayState(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '3088' },
      iResType: 1
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 8033 - 获取司机和车队长钱包信息
export function getCarMasterInfo(params) {
  return new Promise((resolve, reject) => {
    $http({
      method: 'post',
      data: { data: JSON.stringify(params), sid: '8033' },
      iResType: 1
    }).then((res) => {
      resolve(res)
    }).catch((error) => {
      reject(error)
    })
  })
}