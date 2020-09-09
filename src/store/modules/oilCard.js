
const state = {
  // 选择油卡
  chooseOilCardItem:{
    isSelfOrg: '',
    isUseEleOil: '',
    oilBgType: '',
    oilBigType: '',
    oilCardNo: '',
    oilTypeName: '',
    preOilBalance: ''
  }
}
const mutations = {
  // 部分替换，保留已有
  updateOildCardStatus (state, payload) {
    state[payload.type] = Object.assign({},state[payload.type] ,payload.updatMsg)
  },
  // 强制替换整个对象
  newUpdateOildCardStatus(state, payload) {
    state[payload.type] = Object.assign({} ,payload.updatMsg)
  },
  // 清空初始化整个对象
  cleanOildCardStatus(state,payload){
    Object.keys(state[payload.type]).forEach((key) => {
      state[payload.type][key] = '';
    });
  }
}
export default {
  state,
  mutations
}
