const goodsSupplyList = () => {
  return { goodsSupplyList: [] };
};

const state = goodsSupplyList();

const mutations = {
  SET_GOODS_SUPPLY: (state, data) => {
    state.goodsSupplyList = data;
  },
};

const getters = {
  goodsId: state => {
    if (state.goodsSupplyList.length > 0) {
      return state.goodsSupplyList[0].goodsId || '';
    } else {
      return '';
    }
  },
  goodsIdList: state => {
    return state.goodsSupplyList.reduce(function(
      sum,
      currentValue,
      currentIndex,
    ) {
      if (currentIndex === 0) {
        return sum + currentValue.goodsId;
      }
      return sum + ',' + currentValue.goodsId;
    },
    '');
  },
  supplyData: state => {
    let goodsNoStr = '';
    let createdTimeStr = '';
    let freightStr = 0;
    state.goodsSupplyList.map((item, index) => {
      if (index === 0) {
        goodsNoStr += item.goodsNo;
        createdTimeStr += item.createdTime;
      } else {
        goodsNoStr += ',' + item.goodsNo;
        createdTimeStr += ',' + item.createdTime;
      }
      freightStr = freightStr + Number(item.freight);
      if (item.goodsType === '0') {
        freightStr = Number(freightStr) - Number(item.insFee);
      }
    });
    let {
      loadingPlace = '',
      unloadingPlace = '',
      carrierOrgName = '',
      goodsName = '',
      goodsAmount = '',
      goodsAmountType = '',
      insFee = '',
      goodsType = '',
    } = state.goodsSupplyList[0];

    return {
      goodsNoStr,
      createdTimeStr,
      freightStr,
      loadingPlace,
      unloadingPlace,
      carrierOrgName,
      goodsName,
      goodsAmount,
      goodsAmountType,
      insFee,
      goodsType,
    };
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
