const state = {
  carTeamInfo: {
    acctType: '',
    alipayNo: '',
    bankInfoId: '',
    mobileNo: '',
    payeeBankName: '',
    payeeBankNo: '',
    payeeCityId: '',
    payeeCityName: '',
    payeeIdCard: '',
    payeeName: '',
    payeeProvince: '',
    payeeProvinceId: '',
    wsMerchantId: '',
  }
}

const getters = {};
const actions = {};

const mutations = {
  setcarTeamInfo(state, payload) {
    state.carTeamInfo = Object.assign({}, payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
