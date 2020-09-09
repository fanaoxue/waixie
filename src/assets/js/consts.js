let BASE_URL
let AID_TEMP
let APP_URL
let HYB_RECIVE = "好运宝收款"
let YHK_RECIVE = "银行卡收款"
let HYB_WALLET = "好运宝钱包"

switch (process.env.VUE_APP_ENV) {
  case 'development':
    BASE_URL = '/api/luge/gateway.do'
    AID_TEMP = 'QDD201809061356001'
    APP_URL = window.location.protocol + window.location.host + '/#'
    break
  case 'staging':
    BASE_URL = 'https://test-microservice.log56.com/luge/gateway.do'
    AID_TEMP = 'QDD201809061356001'
    APP_URL =
      window.location.protocol +
      window.location.host +
      '/m_extassist_h5/dist/index.html#'
    break
  case 'prepublish':
    BASE_URL = '//pre-syf.log56.com/luge/gateway.do'
    AID_TEMP = 'QDD201809061356001'
    APP_URL =
      window.location.protocol +
      window.location.host +
      '/m_extassist_h5/dist/index.html#'
    break
  case 'production':
    BASE_URL = '//syf.log56.com/luge/gateway.do'
    AID_TEMP = 'QDD201810091648001'
    APP_URL =
      window.location.protocol +
      window.location.host +
      '/m_extassist_h5/dist/index.html#'
    break
  default:
    BASE_URL = '//syf.log56.com/luge/gateway.do'
    AID_TEMP = 'QDD201810091648001'
    APP_URL =
      window.location.protocol + window.location.host + '/dist/index.html#'
    break
}

const serverCode = {}
export { serverCode, BASE_URL, AID_TEMP, APP_URL, HYB_RECIVE, YHK_RECIVE, HYB_WALLET }
