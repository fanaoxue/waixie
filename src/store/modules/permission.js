import { getCompanyConfig } from '@/api/api'
import { Toast } from 'vant'
const state = {
  data: {
    // 8：开通
    // 9：关闭
    // 空为开通
    hybWalletCfg: '', // 好运宝钱包配置
    createWaybillCfg: '', // 新建运单配置
    updateWaybillCfg: '', // 修改运单配置
    deleteWaybillCfg: '', // 删除运单配置
    applePayCfg: '', // 申请支付配置
    collectTwoCfg: '', // 到付金2配置
    supplyChainState: '', // 供应链金融权限
    businessItems: '', // 业务项目配置 2：不展示 3：展示（必填) 38：展示（非必填）
    autoShowWalletCfg: '', // 自动带钱包
    orgCfg718: '', // 开通了德邦外协的配置
    collectionFlagCfg: "", // 车队长配置
  },
  type: false
}

const mutations = {
  UPDATE_PERMISSION: (state, data) => {
    state.data = data
    state.type = true
  },
  UPDATE_FAIL: state => {
    state.type = false
  }
}

const actions = {
  getPermission({ commit }) {
    return new Promise((resolve, reject) => {
      getCompanyConfig({})
        .then(res => {
          if (res.data.reCode === '0') {
            const result = res.data.result
            commit('UPDATE_PERMISSION', result)
            resolve(result)
          } else {
            commit('UPDATE_FAIL')
            reject(res.data.reInfo)
            Toast(res.data.reInfo)
          }
        })
        .catch(err => {
          commit('UPDATE_FAIL')
          reject(err)
        })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
