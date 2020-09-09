const state = {
  cityDataArray: {
    type: '',
    cityArr: '',
    cityIdArr: ['', '', ''],
  }
}

const mutations = {
  updateCityData(state, payload) {
    state.cityDataArray = payload
  }
}
export default {
  state,
  mutations
}
