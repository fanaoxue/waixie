const state = {
  waybill_information: {
    taxWaybillNo: '',
    startPlace: '',
    startPlaceCode: [],
    endPlace: '',
    endPlaceCode: [],
    goodsName: '',
    goodsAmount: '',
    goodsAmountType: '',
    supplierOrgName: '', //外协供应商
    supplierOrgId: '',
    tranRequire: '', // 运输要求
    allFreight: '', // 运费金额
    userFreight: '', // 应收运费
    arrivePlaceTime: '', // 到场时间
    startTime: '', // 起运时间
    startProvinceId: '',
    startCityId: '',
    startCountyId: '',
    endProvinceId: '',
    endCityId: '',
    endCountyId: '',
    drawee: '', // 受票方名称
    taxDraweePartyId: '' //受票方ID
  },
  // 承运信息
  write_car_information: {
    cartBadgeNo: '',
    driverName: '',
    mobileNo: '',
    cartType: '',
    cartLength: '',
    cartTonnage: '',
    note: '',
    idCard: '', //收款人身份证
    alipayNo: '', //收款人支付宝
    zyCapitalCfg: '',
    payBankName: '',
    payBankNo: '',
    hybWallet: ''
  },
  // 结算信息
  should_pay_freight: {
    userFreight: '', // 运费金额
    backFee: '', // 回单押金
    prepayments: '', // 预付现金
    prepaymentsOilCard: '', // 预付油卡
    prepaymentsBuyOil: '', // 线下油款
    prepaymentsBuyGas: '', // 线下气款
    prepaymentsBuyEtc: '', // 线下路桥费
    goodsCost: '', // 货值
    demo1Checkbox: '', // 预付现金选中项
    items1Value: '', // 保险选中项
    zyCapitalCfg: '', // 回款宝配置
    hybWalletCfg: '', // 钱包配置
    arrivePay: '',
    deposit: '', // 定金
    promotionFee: '', // 推广费
    receivablePayback: '', // 应收回款
    advancePayState: '', // 0：企业自付（为空也为此值）1：供应链金融
    oilCardNo: '',
    hkbPayeeType: ''
  },
  write_receive_information: {
    acctType: '', // 1：车队长 5：钱包收款(禁止输入)
    reciveBankAdress: '', //收款人银行地址
    jiedanState: '1',
    payTypeStr: '',
    payType: '', // 页面本人非本人
    payName: '', //收款人姓名
    payIdCard: '', //收款人身份证号
    payBankNo: '', //收款人银行卡号
    payMobileNo: '', //收款人手机号
    payBankName: '', //收款人银行名称
    provinceId: '', // 开户行省份id
    cityId: '', // 开户行城市id

    alipayNo: '' //支付宝账号
  }
}

const mutations = {
  UPDATE_WAYBILL_INFORMATION: (state, data) => {
    state.waybill_information = Object.assign(state.waybill_information, data)
  },
  UPDATE_WRITE_CAR_INFORMATION: (state, data) => {
    state.write_car_information = Object.assign(
      state.write_car_information,
      data
    )
  },
  UPDATE_SHOULD_PAY_FREIGHT: (state, data) => {
    state.should_pay_freight = Object.assign(state.should_pay_freight, data)
  },
  UPDATE_WRITE_RECEIVE_INFORMATION: (state, data) => {
    state.write_receive_information = Object.assign(
      state.write_receive_information,
      data
    )
  }
}

const actions = {
  set_write_car_information({ commit }, data) {
    commit('UPDATE_WRITE_CAR_INFORMATION', data)
  },
  set_waybill_information({ commit }, data) {
    commit('UPDATE_WAYBILL_INFORMATION', data)
  },
  set_write_receive_information({ commit }, data) {
    commit('UPDATE_WRITE_RECEIVE_INFORMATION', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
