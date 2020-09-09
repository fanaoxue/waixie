const state = {
  excludeComponets: [],
};
const getters = {};
const actions = {
  clearKeepalive({ commit }, { vm, list }) {
    return new Promise((resolve, reject) => {
      try {
        commit('keepalive/ADD_EXCLUDE_COMPONENT', list);
        vm.$nextTick(() => {
          commit('keepalive/REMOVE_EXCLUDE_COMPONENT', list);
          resolve();
        });
      } catch (error) {
        reject();
      }
    });
  },
};
const mutations = {
  ADD_EXCLUDE_COMPONENT(state, excludeComponet) {
    let excludeComponets = state.excludeComponets;
    if (Array.isArray(excludeComponet)) {
      state.excludeComponets = [
        ...new Set([...excludeComponets, ...excludeComponet]),
      ];
    } else {
      state.excludeComponets = [
        ...new Set([...excludeComponets, excludeComponet]),
      ];
    }
  },
  REMOVE_EXCLUDE_COMPONENT(state, excludeComponet) {
    let excludeComponets = state.excludeComponets;
    if (Array.isArray(excludeComponet)) {
      for (let i = 0; i < excludeComponet.length; i++) {
        let index = excludeComponets.findIndex(v => v === excludeComponet[i]);
        if (index > -1) {
          excludeComponets.splice(index, 1);
        }
      }
    } else {
      for (let i = 0, len = excludeComponets.length; i < len; i++) {
        if (excludeComponets[i] === excludeComponet) {
          excludeComponets.splice(i, 1);
          break;
        }
      }
    }
    state.excludeComponets = excludeComponets;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
