<template>
  <div class="supplier_modify_waybill_box">
    <c-header isShowTitle class="header">
      <van-nav-bar title="修改运单" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="card_group">
        <van-collapse v-model="activeNames" :border="false">
          <van-collapse-item title="运单信息" name="1">
            <div slot="right-icon">
              <img src="../../assets/imgs/externalassistance/shouqi_icon@2x.png" class="shouqi" />
            </div>
            <van-cell-group>
              <van-field
                v-model.trim="formData.taxWaybillNo"
                label="运单号："
                :disabled="permission.orgCfg718 === '49' ? false : true"
                placeholder="请输入运单号"
                required
                clearable
              />
              <van-field
                v-model="formData.startPlace"
                label="装货地："
                placeholder="请选择装货地"
                :right-icon="permission.orgCfg718 === '49' && (formData.isDBModify === '1' ||  formData.isDBModify === '2' || (formData.isDBModify === '0' && formData.startPlaceModifyCfg === '5')) || permission.orgCfg718 !== '49' ? '' : 'arrow'"
                :disabled="permission.orgCfg718 === '49' && (formData.isDBModify === '1' ||  formData.isDBModify === '2' || (formData.isDBModify === '0' && formData.startPlaceModifyCfg === '5')) || permission.orgCfg718 !== '49' ? true : false"
                required
                readonly
                @click="goChooseCity(0)"
              />
              <van-field
                v-model="formData.endPlace"
                label="卸货地："
                placeholder="请选择卸货地"
                :right-icon="permission.orgCfg718 === '49' && (formData.isDBModify === '1' ||  formData.isDBModify === '2' || (formData.isDBModify === '0' && formData.endCfg === '5')) || permission.orgCfg718 !== '49' ? '' : 'arrow'"
                :disabled="permission.orgCfg718 === '49' && (formData.isDBModify === '1' ||  formData.isDBModify === '2' || (formData.isDBModify === '0' && formData.endCfg === '5')) || permission.orgCfg718 !== '49' ? true : false"
                required
                readonly
                @click="goChooseCity(1)"
              />
              <van-field
                v-model.trim="formData.goodsName"
                label="货物名称："
                placeholder="请输入货物名称"
                :disabled="permission.orgCfg718 === '49' ? false : true"
                required
                clearable
              />
              <van-field
                v-model.trim="formData.goodsAmount"
                label="货物数量："
                type="number"
                placeholder="请输入货物数量"
                :disabled="permission.orgCfg718 === '49' ? false : true"
                required
                clearable
              >
                <div slot="right-icon">
                  <van-radio-group
                    class="goods_amount_type_box"
                    v-model="formData.goodsAmountType"
                    :disabled="permission.orgCfg718 === '49' ? false : true"
                  >
                    <van-radio name="0">
                      <div
                        slot="icon"
                        slot-scope="props"
                        class="goods_amount_type_item"
                        :class="props.checked ? 'active' : 'inactive'"
                      >吨</div>
                    </van-radio>
                    <van-radio name="1">
                      <div
                        slot="icon"
                        slot-scope="props"
                        class="goods_amount_type_item"
                        :class="props.checked ? 'active' : 'inactive'"
                      >方</div>
                    </van-radio>
                    <van-radio name="2">
                      <div
                        slot="icon"
                        slot-scope="props"
                        class="goods_amount_type_item"
                        :class="props.checked ? 'active' : 'inactive'"
                      >件</div>
                    </van-radio>
                    <van-radio name="3">
                      <div
                        slot="icon"
                        slot-scope="props"
                        class="goods_amount_type_item"
                        :class="props.checked ? 'active' : 'inactive'"
                      >车</div>
                    </van-radio>
                  </van-radio-group>
                </div>
              </van-field>
              <van-field
                v-model="formData.startTime"
                label="起运时间："
                @click="startTimeClick"
                :disabled="formData.state !== '0'"
                placeholder="请选择起运时间"
                right-icon="arrow"
                readonly
              />
              <van-field
                v-model="formData.tranRequire"
                label="运输要求："
                placeholder="请填写运输要求，系统将同步告知司机！"
                :disabled="permission.orgCfg718 === '49' ? false : true"
                type="textarea"
                maxlength="60"
                rows="3"
                autosize
                show-word-limit
                clearable
              />
            </van-cell-group>
          </van-collapse-item>

          <van-collapse-item title="承运信息" name="2">
            <div slot="right-icon">
              <img src="../../assets/imgs/externalassistance/shouqi_icon@2x.png" class="shouqi" />
            </div>
            <van-cell-group>
              <div class="van-cell" style="font-size:14px;color:#FFBA00">
                <span class="icon iconfont icongantanhao"></span>
                <p>为保证运输协议规范有效，请务必准确填写司机手机号和司机姓名。协议生成后不可修改！!</p>
              </div>
              <van-field
                v-model.trim="formData.driverName"
                label="司机姓名："
                placeholder="请输入司机姓名"
                @input="driverNameChange"
                :disabled="formData.driverMsg == 1 || Boolean(Number(this.isModifyName)) || nameDisabled ? true : false"
                required
                clearable
              />
              <van-field
                v-model.trim="formData.mobileNo"
                label="手机号码："
                placeholder="请输入司机手机号码"
                :disabled="formData.driverMsg == 1 ? true : false"
                required
                @blur="_phoneGetName"
                clearable
              />
              <van-field
                v-model.trim="formData.cartBadgeNo"
                label="车牌号码："
                placeholder="请输入车牌号码"
                :disabled="formData.payState == '2' ? true : false"
                required
                readonly
                @click="carNumIpt"
              />
              <van-field
                v-model.trim="formData.cartType"
                label="车型："
                placeholder="请选择车型"
                right-icon="arrow"
                required
                readonly
                :disabled="permission.orgCfg718 === '49' && formData.isDBModify === '2' ? true : false"
                @click="carTypeClick"
              />
              <van-field
                v-model.trim="formData.cartLength"
                label="车长（米）："
                placeholder="请输入车长"
                right-icon="arrow"
                required
                readonly
                :disabled="permission.orgCfg718 === '49' && formData.isDBModify === '2' ? true : false"
                @click="carLengthClick"
              />
              <van-field
                v-model.trim="formData.cartTonnage"
                label="吨位（吨）："
                placeholder="请输入吨位"
                right-icon="arrow"
                required
                readonly
                @click="carTonnageClick"
              />
              <van-field
                v-model="formData.note"
                label="备注："
                placeholder="请填写备注信息"
                type="textarea"
                maxlength="64"
                rows="3"
                autosize
                show-word-limit
                clearable
              />
            </van-cell-group>
          </van-collapse-item>

          <van-collapse-item title="应付运费" name="3">
            <div slot="right-icon">
              <img src="../../assets/imgs/externalassistance/shouqi_icon@2x.png" class="shouqi" />
            </div>
            <van-cell-group>
              <van-field
                v-model.trim="formData.userFreight"
                type="number"
                label="应付司机："
                placeholder="请输入应付司机金额"
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7' ? true :false"
                @input="arriveChange"
                required
                clearable
              />
              <van-field
                v-model.trim="formData.prepaymentsOilCard"
                type="number"
                label="预付油卡："
                placeholder="请填写预付油卡"
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7'? true :false"
                v-show="
                  formData.oilCardCfg == 8 ||
                    (formData.oilCardCfg == 9 &&
                      Number(formData.prepaymentsOilCard) != '0')
                "
                @input="arriveChange"
                clearable
              />
              <van-field
                v-model.trim="formData.oilCardNo"
                label="油卡卡号："
                placeholder="请选择油卡卡号"
                right-icon="arrow"
                @click="gotoSelectOilCard(formData.prepaymentsOilCard)"
                v-show="
                  formData.prepaymentsOilCard != '' &&
                    formData.prepaymentsOilCard != 0 &&
                    /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/.test(
                      formData.prepaymentsOilCard
                    )
                "
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7' ? true :false "
                readonly
              />
              <van-field
                type="number"
                v-model.trim="formData.prepayments"
                label="预付现金："
                placeholder="请输入预付现金"
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7' || formData.confirmState === '1' ? true :false "
                @input="arriveChange"
                clearable
              />
              <van-field
                v-model.trim="formData.backFee"
                type="number"
                label="回单押金："
                placeholder="请输入回单押金"
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7' || formData.confirmState === '1' ? true :false "
                @input="arriveChange"
                clearable
              />
              <van-field
                v-model.trim="formData.arrivePay"
                type="number"
                label="到付金额："
                placeholder="请输入到付金额"
                disabled
                clearable
              />
              <van-field
                v-model.trim="formData.freightIncr"
                type="number"
                label="运费增补："
                placeholder="请输入运费增补"
                @input="arriveChange"
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7' || formData.confirmState === '1' ? true :false "
                clearable
              />
              <van-field
                v-model.trim="formData.lossFee"
                type="number"
                label="货损金额："
                placeholder="请输入货损金额"
                :disabled="formData.payState === '2' || formData.payState === '3' || formData.payState === '1' || formData.payState === '6' || formData.payState === '7' || formData.confirmState === '1' ? true :false "
                @input="arriveChange"
                clearable
              />
              <van-field
                required
                v-model.trim="formData.goodsCost"
                type="number"
                label="货值："
                placeholder="请填写实际货值"
                @input="baofeiChange"
                :disabled="permission.orgCfg718 === '49' && (formData.isDBModify === '2' ||formData.isDBModify === '1' || (formData.isDBModify === '0' && formData.state !== '0'))"
                v-show="permission.orgCfg718 === '49' && formData.priceInsuranceCfg === '8'"
                clearable
              />
              <van-field
                v-model.trim="formData.insFee"
                type="number"
                label="保价费："
                v-show="permission.orgCfg718 === '49' && formData.priceInsuranceCfg === '8'"
                disabled
                clearable
              />
            </van-cell-group>
          </van-collapse-item>

          <van-collapse-item title="司机收款信息" name="4">
            <div slot="right-icon">
              <img src="../../assets/imgs/externalassistance/shouqi_icon@2x.png" class="shouqi" />
            </div>
            <van-cell-group>
              <van-field
                v-model="value2"
                label="收款方式："
                placeholder="请选择收款方式"
                :right-icon="
                  permission.zyCapitalCfg === '8' && formData.aliNum !== ''
                    ? 'arrow'
                    : ''
                "
                readonly
                @click="showPayTypeActions"
                v-if="
                  permission.zyCapitalCfg === '8' ||
                    permission.hybWalletCfg == '8'
                "
              />
              <van-field
                v-model="value1"
                label="收款人信息："
                placeholder="请选择收款人信息"
                right-icon="arrow"
                readonly
                @click="gotoSelectInfo"
                v-if="
                  (permission.zyCapitalCfg == '8' && value2 !== '') ||
                    permission.zyCapitalCfg !== '8'
                "
              />
            </van-cell-group>
          </van-collapse-item>
        </van-collapse>
      </div>
      <div class="footer flex_center">
        <div class="button">
          <van-button type="primary" size="large" @click="clickConfirm">保存</van-button>
        </div>
      </div>
    </div>

    <!-- 选择车型 -->
    <van-action-sheet
      v-model="cartTypeActionsShow"
      close-on-click-action
      :actions="cartTypeActions"
      @select="onSelectCartType"
    />
    <!-- 更多车型 -->
    <van-popup v-model="moreCartTypeShow" position="bottom" :overlay="true">
      <selecPopup
        :arrayList="cartTypeList"
        @on-cancle="moreCartTypeShow = false"
        @on-submit="submitMoreCartType"
      ></selecPopup>
    </van-popup>

    <!-- 选择车长 -->
    <van-popup v-model="cartLengthShow" position="bottom" :overlay="true">
      <selecPopup
        :arrayList="cartLengthList"
        :inputShow="true"
        inputUnit="米"
        inputPlaceholder="请输入车长"
        @on-cancle="cartLengthShow = false"
        @on-submit="submitCartLength"
      ></selecPopup>
    </van-popup>

    <!-- 选择吨位 -->
    <van-popup v-model="cartTonnageShow" position="bottom" :overlay="true">
      <selecPopup
        :arrayList="cartTonnageList"
        :inputShow="true"
        inputUnit="吨"
        inputPlaceholder="请输入吨位"
        @on-cancle="cartTonnageShow = false"
        @on-submit="submitCartTonnage"
      ></selecPopup>
    </van-popup>

    <!-- 选择收款方式 -->
    <van-action-sheet
      v-model="payTypeActionsShow"
      close-on-click-action
      :actions="payTypeActions"
      @select="onSelectPayType"
    />

    <!-- 起运时间组件 -->
    <van-popup v-model="startTimeShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        @confirm="confirmDate"
        @cancel="!startTimeShow"
        :formatter="formatter"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { AppFinish } from '@/assets/js/app';
import bus from '@/assets/js/bus.js';
import selecPopup from '@/components/selecPopup';
import {
  modifyWaybillBefore,
  waybillRepeat,
  checkCommonCity,
  wxModifyWaybill,
  getCarrier,
} from '../../api/wayBill';
import { phoneGetName, checkFee } from '../../api/apiBuildWaybill';
import { isEmptyStr, getTimeFormat, resolveObj } from '../../assets/js/utils';
import { queryOilCardType, oilCardCheck } from '../../api/apiOilCard';
import { supplyChainState } from '../../api/api';
import { divide, multiply, subtract, add } from '../../assets/js/utils';
import { infoEntry } from '../../api/applyForPayment';
import { operateWaybill } from '@/assets/js/app.js';
export default {
  name: 'supplier_modify_waybill',
  components: { selecPopup },
  data() {
    return {
      activeNames: ['3'],
      disabled: true,
      isFromH5: this.$route.query.isFromH5, // 1 是从H5进来的
      taxWaybillId: this.$route.query.taxWaybillId, // 运单号
      waybillState: this.$route.query.waybillState,
      category: this.$route.query.category,
      classify: this.$route.query.classify,
      isModifyName: '0', //0：可修改 1：不可修改
      nameDisabled: false, //默认司机姓名可以修改
      isModifyElements: '', //0：可修改 1：不可修改
      value1: '',
      value2: '',
      shoukuanType: false,
      payTypeActionsShow: false,
      payTypeActions: [
        { name: '好运宝收款', value: '好运宝收款' },
        { name: '银行卡收款', value: '银行卡收款' },
      ],
      supplyChainState: '', //供应链金融配置
      isEleOil: '', //是否是电子油卡 0：是 1：否
      formData: {
        driverMsg: '', // 承运信息是否支持修改
        taxWaybillNo: '',
        startPlace: '', // 装货地
        startPlaceCode: [],
        endPlace: '', // 卸货地
        endPlaceCode: [],
        goodsName: '', // 货物信息
        goodsAmount: '', // 获取数量
        goodsAmountType: '0', // 货物类型
        tranRequire: '', // 运输要求
        note: '', // 备注

        payState: '',
        loginState: '',
        confirmState: '', //运输结束确认状态
        oilCardCfg: '', // 油卡配置
        belongActSys: '', //所属账户体系
        driverFinanceCfg: '', // 司机金融配置
        oilCardPayUpperCfg: '',
        driverFinanceProportionCfg: '',
        prepayments: '', // 预付款
        prepaymentsBuyOil: '', //线下油款
        lossInvoiceCfg: '',
        yetLossFee: '',
        freightChangeReasonCfg: '',
        priceInsuranceCfg: '',
        priceInsuranceRate: '',
        isDBModify: '', // 德邦外协是否可以修改货值
        startTime: '', // 起运时间

        // 承运信息
        driverName: '',
        mobileNo: '',
        cartBadgeNo: '',
        cartType: '', // 车型
        cartLength: '', // 车长
        cartTonnage: '', // 吨位
        // 应付运费
        userFreight: '', // 应付司机
        prepayments: '', // 预付款
        backFee: '', // 回单押金
        arrivePay: '', // 到付款
        lossFee: '', // 货损
        freightIncr: '', //运费增补
        maxAllFreight: '',
        prepaymentsOilCard: '', // 预付油卡
        oilCardNo: '', // 油卡卡号
        paidAllFreight: '', //已付运费
        goodsCost: '', // 货值
        insFee: '0.00', //保价费

        name: '',
        idCard: '',
        phoneNumber: '',
        aliNum: '',

        startProvinceId: '',
        startCityId: '',
        startCountyId: '',
        endProvinceId: '',
        endCityId: '',
        endCountyId: '',

        freightChangeReason: '', //修改原因

        payName: '',
        payIdCard: '',
        payBankName: '',
        payBankNo: '',
        payMobileNo: '',
        provinceId: '',
        cityId: '',
        alipayNo: '',

        advancePayState: '',
      },
      cartTypeActionsShow: false,
      cartTypeActions: [
        { name: '厢式' },
        { name: '半挂' },
        { name: '高低板' },
        { name: '更多>>', fn: 'showMoreCartType' },
      ],
      // 更多车型
      moreCartTypeShow: false,
      cartTypeList: [
        { type: '平板' },
        // {type:'厢式'},
        { type: '低栏' },
        { type: '中栏' },
        { type: '高栏' },
        { type: '集装箱' },
        { type: '自卸' },
        { type: '开顶厢' },
        { type: '冷藏车' },
        { type: '危险品' },
        { type: '其他' },
      ],
      // 车长
      cartLengthShow: false,
      cartLengthList: [
        { type: '4.2米' },
        { type: '6.8米' },
        { type: '8.7米' },
        { type: '9.6米' },
        { type: '13米' },
        { type: '17.5米' },
      ],
      // 吨位
      cartTonnageShow: false,
      cartTonnageList: [
        { type: '8吨' },
        { type: '15吨' },
        { type: '20吨' },
        { type: '25吨' },
        { type: '30吨' },
        { type: '35吨' },
      ],
      // 银行
      bankListShow: false,
      bankList: [],
      // 选择开户行
      OpeningbankShow: false,
      startTimeShow: false, // 起运时间状态
      currentDate: new Date(),
      minDate: new Date(),
      reg: /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/,
      Reg: /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'choose_city') {
        let val = vm.cityDataArray;
        if (val.type === '0') {
          vm.formData.startPlace = val.cityArr;
          vm.formData.startPlaceCode = val.cityIdArr;
        } else if (val.type === '1') {
          vm.formData.endPlace = val.cityArr;
          vm.formData.endPlaceCode = val.cityIdArr;
        }
      }
    });
  },
  watch: {
    'permission.zyCapitalCfg'(val) {
      if (val !== '8') {
        this.payTypeActions = [
          { name: '好运宝收款', value: '好运宝收款' },
          { name: '银行卡收款', value: '银行卡收款' },
        ];
      }
    },
    insFee() {
      if (Number(this.formData.insFee) == 0 || this.formData.insFee == '') {
        this.formData.insFee = '0.00';
      }
    },
  },
  computed: {
    ...mapState({
      cityDataArray: state => state.cityData.cityDataArray,
      receiveInfo: state => state.buildWaybill.write_receive_information,
    }),
    ...mapGetters(['permission']),
  },
  mounted() {
    this.dataInit();
    bus.$on('selectOilCard', res => {
      this.formData.oilCardNo = res.oilCardNo;
    });
    bus.$on('selectWriteReceiveInformation', res => {
      this.value1 = res.payName;
    });
  },
  beforeDestroy() {
    bus.$off('selectOilCard');
    bus.$off('selectWriteReceiveInformation');
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      if (this.isFromH5) {
        this.$router.go(-1);
      } else {
        AppFinish(-1);
      }
    },
    // 数据初始化
    dataInit() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      modifyWaybillBefore({ taxWaybillId: this.taxWaybillId })
        .then(res => {
          if (res.data.reCode === '0') {
            let result = res.data.result;
            Object.assign(this.formData, result);
            this.formData.insFee = this.formData.insFee
              ? this.formData.insFee
              : '0.00';
            this.$store.dispatch(
              'buildWaybill/set_write_receive_information',
              this.formData,
            );
            this.formData.startPlaceCode.push(
              result.startProvinceId,
              result.startCityId,
              result.startCountyId,
            );
            this.formData.endPlaceCode.push(
              result.endProvinceId,
              result.endCityId,
              result.endCountyId,
            );
            this.formData.startPlace =
              result.startProvinceName +
              ' ' +
              result.startCityName +
              ' ' +
              result.startCountyName;
            this.formData.endPlace =
              result.endProvinceName +
              ' ' +
              result.endCityName +
              ' ' +
              result.endCountyName;
            localStorage.setItem('oldTaxWaybillNo', result.taxWaybillNo);
            localStorage.setItem('oldAllFreight', result.userFreight);
            if (
              result.advancePayState == '1' &&
              this.permission.collectTwoCfg == '8'
            ) {
              this.value2 = result.driverName + '好运宝钱包';
            } else {
              if (this.permission.zyCapitalCfg != '8') {
                this.value2 = '银行卡收款';
              } else {
                if (result.payType == '1') {
                  this.value2 = '好运宝收款';
                } else if (result.payType == '0') {
                  this.value2 = '银行卡收款';
                } else {
                  this.value2 = '请选择收款方式';
                }
              }
            }

            this.value1 =
              !isEmptyStr(result.payName) &&
              !isEmptyStr(result.payIdCard) &&
              !isEmptyStr(result.payBankName) &&
              !isEmptyStr(result.payBankNo) &&
              !isEmptyStr(result.payMobileNo)
                ? result.payName
                : '未填写';
            if (this.permission.zyCapitalCfg == '8') {
              this._phoneGetName();
            }

            setTimeout(() => {
              if (this.formData.oilCardNo) {
                this.$toast.loading({
                  duration: 0,
                  message: '加载中',
                  forbidClick: true,
                });
                queryOilCardType({ oilCardNo: this.formData.oilCardNo }).then(
                  res => {
                    if (res.data.reCode == 0) {
                      this.isEleOil = res.data.result.isEleOil;
                    }
                    supplyChainState({}).then(re => {
                      this.supplyChainState = re.data.result.supplyChainState;
                    });
                  },
                );
              }
              this.arriveChange();
            }, 40);
          }
        })
        .catch(err => {
          this.$toast(err.message);
        });
    },
    //通过司机手机号码获取注册过的司机姓名
    _phoneGetName() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      phoneGetName({ mobileNo: this.formData.mobileNo })
        .then(res => {
          if (res.data.reCode == '0') {
            if (Object.keys(res.data.result).length != '0') {
              let result = res.data.result;
              if (
                result.driverName !== '' &&
                result.alipayNo !== '' &&
                result.mobileNo !== ''
              ) {
                //已认证->修改司机姓名
                this.formData.driverName = result.driverName;
                this.formData.name = result.driverName;
                this.formData.idCard = result.idCard;
                this.formData.phoneNumber = result.mobileNo;
                this.formData.aliNum = result.alipayNo;
                this.isModifyName = 1;
                this.isModifyElements = 0;
                this.nameDisabled = true;
                if (
                  this.formData.advancePayState == '1' &&
                  this.permission.collectTwoCfg == '8'
                ) {
                  this.value2 = this.formData.driverName + '好运宝钱包';
                } else {
                  if (this.permission.zyCapitalCfg != '8') {
                    this.value2 = '银行卡收款';
                  } else {
                    if (this.formData.payType == '1') {
                      this.value2 = '好运宝收款';
                    } else if (this.formData.payType == '0') {
                      this.value2 = '银行卡收款';
                    } else {
                      this.value2 = '请选择收款方式';
                    }
                  }
                }
                if (this.formData.payType != '1') {
                  this.value1 =
                    this.formData.payName == ''
                      ? '未填写'
                      : this.formData.payName;
                } else {
                  this.value1 = this.formData.driverName;
                }
              } else {
                //未认证
                this.formData.payType = '银行卡收款';
                if (
                  this.formData.advancePayState == '1' &&
                  this.permission.collectTwoCfg == '8'
                ) {
                  this.value2 = this.formData.driverName + '好运宝钱包';
                } else {
                  this.value2 = '银行卡收款';
                }
                this.isModifyName = 0;
                this.isModifyElements = 1;
                this.nameDisabled = false;
              }
            } else {
              //未认证
              this.payType = '银行卡收款';
              if (
                this.formData.advancePayState == '1' &&
                this.permission.collectTwoCfg == '8'
              ) {
                this.value2 = this.formData.driverName + '好运宝钱包';
              } else {
                this.value2 = '银行卡收款';
              }
              this.nameDisabled = false;
              //动态修改 这两个值
              this.isModifyName = 0;
              this.isModifyElements = 0;
            }
          }
        })
        .catch(() => {
          // this.$toast(err.message)
        });
    },
    goChooseCity(type) {
      if((this.permission.orgCfg718 === '49' &&
          (this.formData.isDBModify === '1' ||
            this.formData.isDBModify === '2')) || this.permission.orgCfg718 !== '49'){
              return
      }
      if(this.formData.isDBModify === '0'){
        if(type=='0' ){
          if(this.formData.startPlaceModifyCfg === '5'){
            return
          }else{
            this.$router.push(`/choose_city?type=${type}`);
          }
        }else{
          if(this.formData.endCfg === '5'){
            return
          }else{
            this.$router.push(`/choose_city?type=${type}`);
          }
        }
      }else{
        this.$router.push(`/choose_city?type=${type}`);
      }
    },
    // 司机车牌
    carNumIpt() {
      if (this.formData.payState == '2') {
        return;
      }
      const _this = this;
      this.$carIpt({
        dpCartNum: this.formData.cartBadgeNo,
        fn: function(res) {
          _this.formData.cartBadgeNo = res;
        },
      });
    },
    carTypeClick() {
      if (
        this.permission.orgCfg718 === '49' &&
        this.formData.isDBModify === '2'
      ) {
        return;
      }
      this.cartTypeActionsShow = true;
    },
    carLengthClick() {
      if (
        this.permission.orgCfg718 === '49' &&
        this.formData.isDBModify === '2'
      ) {
        return;
      }
      this.cartLengthShow = true;
    },
    carTonnageClick() {
      this.cartTonnageShow = true;
    },
    // 选择车型
    onSelectCartType(item) {
      if (item.fn) {
        this[item.fn]();
      } else {
        this.formData.cartType = item.name;
      }
    },
    // 展示更多车型
    showMoreCartType() {
      this.moreCartTypeShow = true;
    },
    // 更多车型确定
    submitMoreCartType(val) {
      this.moreCartTypeShow = false;
      this.formData.cartType = val;
    },
    // 展示选择车长
    submitCartLength(val) {
      this.cartLengthShow = false;
      this.formData.cartLength = val;
    },
    // 展示选择吨位
    submitCartTonnage(val) {
      this.cartTonnageShow = false;
      this.formData.cartTonnage = val;
    },
    // 司机姓名修改
    driverNameChange(val) {
      if (
        this.formData.advancePayState == '1' &&
        this.permission.collectTwoCfg == '8'
      ) {
        this.value2 = val + '好运宝钱包';
      }
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      if (
        this.formData.payState === '2' ||
        this.formData.payState === '3' ||
        this.formData.payState === '1' ||
        this.formData.payState === '6' ||
        this.formData.payState === '7'
      ) {
        return;
      }
      this.$router.push({
        path: '/choose_oil_card',
        query: {
          belongActSys: this.formData.belongActSys,
          prepaymentsOilCard: item,
          cartBadgeNo: this.formData.cartBadgeNo,
          driverName: this.formData.driverName,
          mobileNo: this.formData.mobileNo,
        },
      });
    },
    // 收款方式点击
    showPayTypeActions() {
      if (this.permission.zyCapitalCfg === '8' && this.formData.aliNum !== '') {
        this.payTypeActionsShow = true;
      }
    },
    // 收款人信息点击
    gotoSelectInfo() {
      if (this.value2 === '好运宝收款') {
        this.$router.push({
          path: '/receiver_information',
          query: {
            driverName: this.formData.driverName,
            idCard: this.formData.idCard,
            mobileNo: this.formData.mobileNo,
            alipayNo: this.formData.alipayNo,
          },
        });
      } else {
        this.$store.dispatch(
          'buildWaybill/set_write_receive_information',
          this.receiveInfo,
        );
        this.$router.push({
          path: '/write_receive_information',
          query: {
            mobileNo: this.formData.mobileNo,
            driverName: this.formData.driverName,
            alipayNo: this.formData.alipayNo,
          },
        });
      }
    },
    onSelectPayType(item) {
      this.formData.payType = item.value;
      this.value2 = item.value;
      if (this.value2 === '好运宝收款') {
        this.value1 = this.formData.driverName;
      } else {
        this.value1 = this.receiveInfo.payName;
      }
    },
    // 验证
    async verify() {
      if (isEmptyStr(this.formData.taxWaybillNo)) {
        this.$toast('运单号不能为空！');
        return false;
      } else {
        let regExp = /^[0-9a-zA-Z_-]+$/;
        if (!regExp.test(this.formData.taxWaybillNo)) {
          this.$toast(
            '运单号只接受数字,字母,' + '_' + '与 ' + '-' + ',不接受特殊字符！',
          );
          return false;
        }
      }

      //货物数量
      if (!isEmptyStr(this.formData.goodsAmount)) {
        let regexp;
        if (this.formData.goodsAmountType === '0') {
          regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,4})?$/;
        } else {
          regexp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        }
        if (!regexp.test(this.formData.goodsAmount)) {
          this.$toast('无效的货物数量！');
          return;
        }
      } else {
        this.$toast('货物数量必填！');
        return;
      }

      //司机手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.formData.mobileNo)) {
        this.$toast('司机手机号码输入错误');
        return false;
      }
      //司机姓名验证
      if (
        !isEmptyStr(this.formData.driverName) &&
        this.formData.driverName.length >= 64
      ) {
        this.$toast('司机姓名长度最大不可以超过64个字符！');
        return;
      }

      //应付司机金额验证
      if (!isEmptyStr(this.formData.userFreight)) {
        if (!this.Reg.test(this.formData.userFreight)) {
          this.$toast('应付司机金额不合法！');
          return false;
        }
        if (
          Number(this.formData.userFreight) >
          Number(this.formData.maxAllFreight)
        ) {
          this.$toast('应付司机金额不能超过最大运费金额！');
          return false;
        }
      } else {
        this.$toast('应付司机金额不能为空！');
        return false;
      }

      //预付油卡
      if (!isEmptyStr(this.formData.prepaymentsOilCard)) {
        let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
        if (!regExp.test(this.formData.prepaymentsOilCard)) {
          this.$toast('无效的预付油卡金额！');
          return false;
        } else {
          if (
            Number(this.formData.prepaymentsOilCard) >
            Number(this.formData.maxAllFreight)
          ) {
            this.$toast('预付油卡金额不能超过最大金额！');
            return false;
          }
          if (
            Number(this.formData.prepaymentsOilCard) &&
            this.formData.oilCardNo == ''
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: `<p style='color:#454545;'>当前运单存在预付油卡</p><p style='color:#454545;'>请选择油卡!</p>`,
              confirmText: '选择油卡',
              cancelText: '保存',
              onConfirm: () => {
                this.$router.push({
                  path: '/choose_oil_card',
                  query: {
                    belongActSys: this.formData.belongActSys,
                    prepaymentsOilCard: this.formData.prepaymentsOilCard,
                    cartBadgeNo: this.formData.cartBadgeNo,
                    driverName: this.formData.driverName,
                    mobileNo: this.formData.mobileNo,
                  },
                });
              },
              onCancel: () => {
                if (!this.driverFinanceJudge()) {
                  return false;
                }
                if (
                  this.formData.taxWaybillNo !=
                  localStorage.getItem('oldTaxWaybillNo')
                ) {
                  this.waybillRepeatCheck(this.taxWaybillNo);
                } else {
                  //运费各种判断
                  this.checkFee();
                }
                return false;
              },
            });
            return false;
          }
        }
      }

      //运费增补
      if (!isEmptyStr(this.formData.freightIncr)) {
        if (!this.Reg.test(this.formData.freightIncr)) {
          this.$toast('无效的运费增补金额！');
          return false;
        }
      }

      //货损金额
      if (!isEmptyStr(this.formData.lossFee)) {
        if (!this.Reg.test(this.formData.lossFee)) {
          this.$toast('无效的运费扣减金额！');
          return false;
        }
      }

      //预付现金
      if (!isEmptyStr(this.formData.prepayments)) {
        if (!this.Reg.test(this.formData.prepayments)) {
          this.$toast('无效的预付现金！');
          return false;
        }
        if (
          Number(this.formData.prepayments) > Number(this.formData.userFreight)
        ) {
          this.$toast('预付现金不能大于应付司机金额！');
          return false;
        }
        if (
          Number(this.formData.prepayments) >
          Number(this.formData.maxAllFreight)
        ) {
          this.$toast('预付现金不能超过最大金额！');
          return false;
        }
      }

      //货值判断
      if (
        this.permission.orgCfg718 === '49' &&
        this.formData.priceInsuranceCfg === '8'
      ) {
        if (!isEmptyStr(this.formData.goodsCost)) {
          if (!this.Reg.test(this.formData.goodsCost)) {
            this.$toast('无效的货值！');
            return;
          }
        } else {
          this.$toast('货值必填!');
          return;
        }
      }

      this.formData.startProvinceId = this.formData.startPlaceCode[0];
      this.formData.startCityId = this.formData.startPlaceCode[1];
      this.formData.startCountyId = this.formData.startPlaceCode[2];
      this.formData.endProvinceId = this.formData.endPlaceCode[0];
      this.formData.endCityId = this.formData.endPlaceCode[1];
      this.formData.endCountyId = this.formData.endPlaceCode[2];

      return await this.isSameCity();
    },
    // 点击确定保存按钮
    async clickConfirm() {
      if ((await this.verify()) == '1') {
        // 判断是否修改了运单号
        if (
          this.formData.taxWaybillNo != localStorage.getItem('oldTaxWaybillNo')
        ) {
          this.buttonFlag = false;
          setTimeout(() => {
            this.waybillRepeatCheck(this.formData.taxWaybillNo);
          }, 20);
        } else {
          //运费各种判断
          this.checkFee();
        }
      }
    },
    // 验证同城区县
    isSameCity() {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        let json = {
          fromProvId: this.formData.startProvinceId,
          fromCityId: this.formData.startCityId,
          fromCountyId: this.formData.startCountyId,
          toCountyId: this.formData.endCountyId,
          toCityId: this.formData.endCityId,
        };
        checkCommonCity(json)
          .then(res => {
            if (res.data.reCode === '0') {
              waybillRepeat({
                taxWaybillNo: this.formData.taxWaybillNo,
                type: '1',
              }).then(res => {
                if (res.data.reCode === '1') {
                  resolve(res.data.reInfo);
                } else {
                  resolve('1');
                }
              });
            } else {
              resolve(res.data.reInfo);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    //3018通过运单号判断运单是否重复
    waybillRepeatCheck(item) {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      waybillRepeat({ taxWaybillNo: item, type: '1' })
        .then(res => {
          if (res.data.reCode == 1) {
            this.$toast(res.data.reInfo);
          } else {
            //运费各种判断
            this.checkFee();
          }
          this.buttonFlag = true;
        })
        .catch(err => {
          this.$toast(err.message);
          this.buttonFlag = true;
        });
    },
    /**
     * 司机金融1.1新加逻辑
     */
    driverFinanceJudge() {
      if (this.formData.driverFinanceCfg == '8') {
        let prepaymentsOilCardRate = parseFloat(
          this.formData.oilCardPayUpperCfg * this.formData.userFreight,
        ).toFixed(2);
        let allFreightRate = parseFloat(
          this.formData.driverFinanceProportionCfg * this.formData.userFreight,
        ).toFixed(2);
        if (Number(this.formData.prepaymentsOilCard) > prepaymentsOilCardRate) {
          this.$klb.confirm.show({
            title: '提示',
            content: `您输入的预付油卡金额超过运费的${this.toPercent(
              this.formData.oilCardPayUpperCfg,
            )}，请重新输入！`,
            showCancelButton: false,
            onConfirm: () => {},
          });
          return;
        }
        if (
          !(
            Number(this.formData.lossFee) > 0 ||
            Number(this.formData.freightIncr) > 0
          )
        ) {
          if (Number(this.formData.driverFinanceProportionCfg) != 1) {
            if (
              this.isEmptyStr(this.formData.backFee) ||
              Number(this.formData.backFee) <= '0'
            ) {
              this.$klb.confirm.show({
                title: '提示',
                content: `请输入回单押金！`,
                showCancelButton: false,
                onConfirm: () => {},
              });
              return;
            }
            if (Number(this.formData.arrivePay) > allFreightRate) {
              this.$klb.confirm.show({
                title: '提示',
                content: `您输入的到付款&回单押金金额不合规，请重新输入！`,
                showCancelButton: false,
                onConfirm: () => {},
              });
              return;
            }
            if (Number(this.formData.arrivePay) <= '0') {
              this.$klb.confirm.show({
                title: '提示',
                content: `到付金额必须大于0！`,
                showCancelButton: false,
                onConfirm: () => {},
              });
              return;
            }
          }
        }
      } else {
        return true;
      }
    },
    // 运费判断
    checkFee() {
      if (
        this.d(
          this.f(this.formData.userFreight, this.formData.lossFee),
          this.formData.freightIncr,
        ) <= 0
      ) {
        this.$klb.confirm.show({
          title: '提示',
          content: `请确认，运费金额加运费增补减货损必须大于0。`,
          showCancelButton: false,
          onConfirm: () => {},
        });
        return;
      }

      if (
        this.formData.oilCardCfg == 9 &&
        subtract(
          this.formData.prepaymentsBuyOil,
          multiply(
            this.d(
              this.d(
                this.f(this.formData.userFreight, this.formData.lossFee),
                this.formData.freightIncr,
              ),
              this.formData.prepaymentsBuyOil,
            ),
            this.formData.oilCardPayUpperCfg,
          ),
        ) > 0
      ) {
        this.$klb.confirm.show({
          title: '提示',
          content: `请确认，线下油款金额不能大于设置的上限！`,
          showCancelButton: false,
          onConfirm: () => {},
        });
        return;
      }

      if (
        this.d(
          this.f(this.formData.userFreight, this.formData.lossFee),
          this.formData.freightIncr,
        ) < this.d(this.formData.paidAllFreight, 0)
      ) {
        this.$klb.confirm.show({
          title: '提示',
          content: `请确认，运费金额加运费增补减货损必须大于等于已付运费。`,
          showCancelButton: false,
          onConfirm: () => {},
        });
        return;
      }

      var allF;
      if (this.formData.lossInvoiceCfg == '13') {
        //要支付货损
        allF = this.d(this.formData.userFreight, this.formData.freightIncr);
      } else {
        allF = this.d(
          this.f(this.formData.userFreight, this.formData.lossFee),
          this.formData.freightIncr,
        );
      }
      this.lossFee = this.formData.lossFee.toString();
      if (Number(allF) == Number(this.paidAllFreight)) {
        if (this.formData.lossInvoiceCfg == '13') {
          if (
            (this.formData.yetLossFee == '' && this.formData.lossFee > 0) ||
            (this.formData.yetLossFee != '' &&
              this.f(this.formData.yetLossFee, this.formData.lossFee) < 0)
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: `预付货损未完成支付，不能修改运费金额等于已支付金额！`,
              showCancelButton: false,
              onConfirm: () => {},
            });
            return;
          }
        }
      }
      //验证运费合理性接口
      let json1 = {
        fromProvId: this.formData.startProvinceId, //起运省份ID
        toProvId: this.formData.endProvinceId, //目的省份ID
        fromCityId: this.formData.startCityId, //起运城市ID
        toCityId: this.formData.endCityId, //目的城市ID
        allFreight: this.formData.userFreight, //运输总价
      };
      this.buttonFlag = false;
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      checkFee(json1)
        .then(res => {
          this.buttonFlag = true;
          var _this = this;
          if (res.data.reCode === '0') {
            _this.submit();
          } else {
            if (res.data.reCode === '1') {
              _this.$klb.confirm.show({
                title: '提示',
                confirmText: '确认',
                cancelText: '取消',
                content: res.data.reInfo,
                onConfirm: () => {
                  //点击确定去建单
                  _this.submit();
                },
              });
            } else {
              this.$toast('抱歉,您录入的数据不合法,请核实后重试！');
            }
          }
        })
        .catch(err => {
          this.buttonFlag = true;
        });
    },
    //修改成功后提交的方法
    submit() {
      let bankName = this.receiveInfo.payName
        ? this.receiveInfo.payBankName
        : this.formData.payBankName;
      var _this = this;
      let userFreightOld = localStorage.getItem('oldAllFreight');
      if (
        this.formData.freightChangeReasonCfg == 1 &&
        Number(this.formData.userFreight) !== Number(userFreightOld)
      ) {
        this.$klb.confirm.prompt('请输入修改原因', {
          title: '请输入修改原因',
          onConfirm(value) {
            _this.formData.freightChangeReason = value;
            let regexp = /^\s+$/g;
            if (value == '' || regexp.test(value) || value == null) {
              _this.$toast('运费金额修改原因必填！');
              return false;
            }
            if (value != '' && !regexp.test(value) && value != null) {
              if (value.length >= 120) {
                _this.$toast('输入内容超过限制，请修改重试！');
                return false;
              } else {
                if (bankName == '好运宝钱包') {
                  _this.oilCardCheck();
                } else {
                  _this.informationEntry();
                }
              }
            }
          },
        });
      } else {
        if (bankName == '好运宝钱包') {
          this.oilCardCheck();
        } else {
          this.informationEntry();
        }
      }
    },
    //录入信息的方法
    informationEntry() {
      let jsons = {
        mobileNo: this.formData.mobileNo,
        payeeName: this.receiveInfo.payName
          ? this.receiveInfo.payName
          : this.formData.payName,
        payeeBankNo: this.receiveInfo.payName
          ? this.receiveInfo.payBankNo
          : this.formData.payBankNo,
        payeeBankName: this.receiveInfo.payName
          ? this.receiveInfo.payBankName
          : this.formData.payBankName,
        payeeProvinceId: this.receiveInfo.payName
          ? this.receiveInfo.provinceId
          : this.formData.provinceId,
        payeeCityId: this.receiveInfo.payName
          ? this.receiveInfo.cityId
          : this.formData.cityId,
        payeeIdCard: this.receiveInfo.payName
          ? this.receiveInfo.payIdCard
          : this.formData.payIdCard,
        payeeMobileNo: this.receiveInfo.payName
          ? this.receiveInfo.payMobileNo
          : this.formData.payMobileNo,
        alipayNo: this.receiveInfo.payName
          ? this.receiveInfo.alipayNo
          : this.formData.alipayNo,
      };
      if (
        jsons.mobileNo != '' &&
        jsons.payeeBankNo != '' &&
        jsons.payeeName != '' &&
        jsons.payeeBankName != '' &&
        jsons.payeeProvinceId != '' &&
        jsons.payeeCityId != '' &&
        jsons.payeeIdCard != '' &&
        jsons.payeeMobileNo != ''
      ) {
        this.buttonFlag = false;
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        infoEntry(jsons)
          .then(res => {
            this.oilCardCheck();
          })
          .catch(err => {
            this.buttonFlag = true;
            this.$toast(err.message);
          });
      } else {
        this.oilCardCheck();
      }
    },
    //油卡验证接口 油卡配置开通了要去验证油卡
    oilCardCheck() {
      if (
        this.formData.oilCardCfg == 8 ||
        (this.formData.oilCardCfg == 9 &&
          Number(this.formData.prepaymentsOilCard) != '0')
      ) {
        let json = {
          prepaymentsOilCard:
            this.formData.prepaymentsOilCard == ''
              ? '0.00'
              : this.formData.prepaymentsOilCard,
          cartBadgeNo: this.formData.cartBadgeNo,
          belongActSys: this.formData.belongActSys,
          oilCardNo:
            this.formData.prepaymentsOilCard == '' ||
            Number(this.formData.prepaymentsOilCard) == '0'
              ? ''
              : this.formData.oilCardNo,
        };
        this.buttonFlag = false;
        oilCardCheck(json)
          .then(res => {
            if (res.data.reCode == '0') {
              this.sendMessage();
            } else {
              this.$klb.confirm.show({
                title: '提示',
                content: res.data.reInfo,
                showCancelButton: false,
                onConfirm: () => {},
              });
              this.buttonFlag = true;
              return;
            }
          })
          .catch(err => {
            this.$toast(err.message);
            this.buttonFlag = false;
          });
      } else {
        this.sendMessage();
      }
    },
    //走后台接口，提供信息
    sendMessage() {
      let shoukuanrenleixing = '';
      let shoukuanrenleixing1 = '';
      let bankName = this.receiveInfo.payBankName
        ? this.receiveInfo.payBankName
        : this.formData.payBankName;
      if (
        this.formData.advancePayState == '1' &&
        this.permission.collectTwoCfg == '8'
      ) {
        shoukuanrenleixing = '1';
        shoukuanrenleixing1 = '1';
      } else {
        if (this.permission.zyCapitalCfg === '8') {
          if (this.value2 === '好运宝收款' || this.value2 === '1') {
            shoukuanrenleixing = '1';
            shoukuanrenleixing1 = '1';
          } else {
            if (this.value2 == '') {
              shoukuanrenleixing = '';
              shoukuanrenleixing1 = '';
            } else {
              let payName = this.receiveInfo.payName
                ? this.receiveInfo.payName
                : this.formData.payName;
              if (bankName == '好运宝钱包') {
                shoukuanrenleixing = '1';
              } else {
                if (this.formData.driverName == payName) {
                  shoukuanrenleixing = '1';
                } else {
                  shoukuanrenleixing = '0';
                }
              }
              shoukuanrenleixing1 = '0';
            }
          }
        } else {
          let payName = this.receiveInfo.payName
            ? this.receiveInfo.payName
            : this.formData.payName;
          shoukuanrenleixing1 = '0';
          if (this.formData.driverName == payName) {
            shoukuanrenleixing = '1';
          } else {
            shoukuanrenleixing = '0';
          }
        }
      }
      let json = {
        xid: this.formData.xid,
        taxWaybillId: this.taxWaybillId,
        tranRequire: this.formData.tranRequire,
        taxWaybillNo: this.formData.taxWaybillNo,
        startProvinceId: this.formData.startPlaceCode[0],
        startCityId: this.formData.startPlaceCode[1],
        startCountyId: this.formData.startPlaceCode[2],
        endProvinceId: this.formData.endPlaceCode[0],
        endCityId: this.formData.endPlaceCode[1],
        endCountyId: this.formData.endPlaceCode[2],
        driverName: this.formData.driverName,
        cartBadgeNo: this.formData.cartBadgeNo,
        mobileNo: this.formData.mobileNo, //司机手机号
        goodsName: this.formData.goodsName,
        goodsAmount: this.formData.goodsAmount,
        goodsAmountType: this.formData.goodsAmountType,
        userFreight: this.formData.userFreight,
        transTrip:
          this.formData.billCycleMode == 8 ? this.formData.transTrip : '', //运输趟次
        // drawee: this.formData.loginState == 0 ? this.formData.drawee : '', //受票方
        prepayments: isEmptyStr(this.formData.prepayments)
          ? '0.00'
          : this.formData.prepayments, //预付现金
        backFee: isEmptyStr(this.formData.backFee)
          ? '0.00'
          : this.formData.backFee, //回单押金
        freightIncr: isEmptyStr(this.formData.freightIncr)
          ? '0.00'
          : this.formData.freightIncr, //运单增补
        prepaymentsBuyOil: isEmptyStr(this.prepaymentsBuyOil)
          ? '0.00'
          : this.prepaymentsBuyOil, //线下油款
        lossFee: isEmptyStr(this.formData.lossFee)
          ? '0.00'
          : this.formData.lossFee, //运费扣减
        // taxDraweePartyId:this.formData.loginState == 0 ? this.formData.taxDraweePartyId : '', //受票方ID
        freightChangeReason: this.formData.freightChangeReason, //修改原因
        cartType: this.formData.cartType,
        cartLength: parseFloat(this.formData.cartLength), //车长
        cartTonnage: parseFloat(this.formData.cartTonnage), //吨位
        payType: shoukuanrenleixing, //正常的收款人类型
        hkbPayeeType: shoukuanrenleixing1, //回款宝收款人类型
        payName:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg === '8' &&
              this.value2 == '好运宝收款'
            ? this.formData.name
            : this.receiveInfo.payName
            ? this.receiveInfo.payName
            : this.value1 == '未填写'
            ? ''
            : this.formData.payName, //收款人姓名
        payIdCard:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? this.formData.idCard
            : this.receiveInfo.payName
            ? this.receiveInfo.payIdCard
            : this.value1 == '未填写'
            ? ''
            : this.formData.payIdCard, //收款人身份证
        payBankName:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? this.formData.payBankName
            : this.receiveInfo.payBankName
            ? this.receiveInfo.payBankName == '好运宝钱包'
              ? '浙江网商银行'
              : this.receiveInfo.payBankName
            : this.value1 == '未填写'
            ? ''
            : this.formData.payBankName, //收款人银行名称
        payBankNo:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? this.formData.payBankNo
            : this.receiveInfo.payName
            ? this.receiveInfo.payBankNo
            : this.value1 == '未填写'
            ? ''
            : this.formData.payBankNo, //收款人银行卡号
        payMobileNo:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? this.formData.phoneNumber
            : this.receiveInfo.payName
            ? this.receiveInfo.payMobileNo
            : this.value1 == '未填写'
            ? ''
            : this.formData.payMobileNo, //收款人手机号
        provinceId:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? ''
            : this.receiveInfo.payName
            ? this.receiveInfo.payBankName == '好运宝钱包'
              ? '7'
              : this.receiveInfo.provinceId
            : this.value1 == '未填写'
            ? ''
            : this.formData.provinceId, //开户行省份id
        cityId:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? ''
            : this.receiveInfo.payName
            ? this.receiveInfo.payBankName == '好运宝钱包'
              ? '701'
              : this.receiveInfo.cityId
            : this.value1 == '未填写'
            ? ''
            : this.formData.cityId, //开户行城市id
        oilCardNo:
          this.formData.prepaymentsOilCard == '' ||
          Number(this.formData.prepaymentsOilCard) == '0'
            ? ''
            : this.formData.oilCardNo, //油卡卡号
        prepaymentsOilCard:
          this.formData.prepaymentsOilCard == ''
            ? '0.00'
            : this.formData.prepaymentsOilCard, //预付油卡
        alipayNo:
          this.formData.advancePayState == '1' &&
          this.permission.collectTwoCfg == '8'
            ? ''
            : this.permission.zyCapitalCfg == '8' && this.value2 == '好运宝收款'
            ? this.formData.aliNum
            : this.receiveInfo.payName
            ? this.receiveInfo.alipayNo
            : this.value1 == '未填写'
            ? ''
            : this.formData.alipayNo, //收款人支付宝账号
        goodsCost: this.formData.goodsCost,
        startTime: this.formData.startTime,
        extassistType: this.permission.orgCfg718 === '49' ? '2' : '', // 2代表德邦外协
        wbMode: this.permission.orgCfg718 === '49' ? '1' : '2',
      };
      console.log(json);
      this.buttonFlag = false; //禁用按钮
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      wxModifyWaybill(json)
        .then(res => {
          if (res.data.reCode == '0') {
            this.$toast(res.data.reInfo);
            let json = {
              type: '2',
              taxWaybillId: this.taxWaybillId,
              refreshList: [this.waybillState],
              waybillState: this.waybillState,
              content: resolveObj(
                Object.assign(this.formData, {
                  allFreight: this.formData.allFreight + '元',
                  userFreight: this.formData.userFreight + '元',
                }),
              ),
            };
            operateWaybill(json);
            setTimeout(() => {
              this.$router.replace({
                path: '/waybill_detail',
                query: {
                  taxWaybillId: this.taxWaybillId,
                  category: this.category, // 0
                  classify: this.classify, // 1承运商
                  xid: this.formData.xid,
                },
              });
              this.buttonFlag = true;
            }, 500);
          } else {
            this.$klb.confirm.show({
              title: '提示',
              content: res.data.reInfo,
              showCancelButton: false,
              onConfirm: () => {},
            });
            this.buttonFlag = true;
            return;
          }
        })
        .catch(err => {
          this.buttonFlag = true;
          this.$toast(err.message);
        });
    },
    // 计算方法
    f(s, r) {
      var q, p, o, u;
      try {
        q = s.toString().split('.')[1].length;
      } catch (t) {
        q = 0;
      }
      try {
        p = r.toString().split('.')[1].length;
      } catch (t) {
        p = 0;
      }
      o = Math.pow(10, Math.max(q, p));
      u = q >= p ? q : p;
      return parseFloat(((s * o - r * o) / o).toFixed(u));
    },
    d(r, q) {
      var p, o, n;
      try {
        p = r.toString().split('.')[1].length;
      } catch (s) {
        p = 0;
      }
      try {
        o = q.toString().split('.')[1].length;
      } catch (s) {
        o = 0;
      }
      n = Math.pow(10, Math.max(p, o));
      return parseFloat(((r * n + q * n) / n).toFixed(Math.max(p, o)));
    },
    arriveChange() {
      this.formData.arrivePay = (
        Number(this.formData.userFreight) -
        Number(this.formData.prepayments) -
        Number(this.formData.prepaymentsOilCard) -
        Number(this.formData.backFee) -
        Number(this.formData.lossFee) +
        Number(this.formData.freightIncr)
      ).toFixed(2);
      if (this.formData.arrivePay == 'NaN') {
        this.formData.arrivePay = '0.00';
      }
    },
    //货值输入动态计算
    baofeiChange() {
      let reg = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
      if (this.formData.priceInsuranceCfg == '8') {
        if (!reg.test(this.formData.goodsCost)) {
          this.formData.insFee = '0.00';
        } else {
          this.formData.insFee = Number(
            this.formData.goodsCost * this.formData.priceInsuranceRate,
          ).toFixed(2);
        }
      }
      if (this.formData.goodsCost == '') {
        this.formData.insFee = '0.00';
      }
    },
    // 选定起运时间
    confirmDate(value) {
      this.startTimeShow = false;
      this.formData.startTime = getTimeFormat(value, 's');
    },
    // 点击起运时间
    startTimeClick() {
      if (this.formData.state !== '0') {
        return;
      }
      this.startTimeShow = true;
    },
    // 处理控件显示的时间格式
    formatter(type, value) {
      // 格式化选择器日期
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      }
      return value;
    },
  },
};
</script>

<style lang="less" scoped>
.supplier_modify_waybill_box {
  .card_group {
    width: 100%;
    margin-top: 10px;
    position: relative;
    padding-bottom: 65px;
  }
  /deep/ .van-collapse {
    .van-collapse-item {
      margin-bottom: 10px;
      .van-cell {
        position: relative;
        .shouqi {
          width: 13px;
          transition: transform 0.3s;
        }
        &.van-collapse-item__title--expanded {
          .shouqi {
            transform: rotate(-180deg);
          }
        }
      }
      .van-collapse-item__content {
        padding: 0;
        .van-cell-group {
          .van-cell {
            .van-field__control {
              color: #202020;
              font-size: 16px;
              &:disabled {
                color: #969799 !important;
                background-color: transparent !important;
                opacity: 1 !important;
                -webkit-text-fill-color: currentColor !important;
              }
            }
            .van-field__right-icon {
              color: #454545;
            }
          }
          &.van-hairline--top-bottom::after,
          .van-hairline-unset--top-bottom::after {
            border: none;
          }
        }
      }
      &.van-hairline--top::after {
        display: none;
      }
    }
  }
  .footer {
    height: 65px;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #ffffff;
    z-index: 10;
    .button {
      flex: 1;
      padding: 0 25px;
    }
  }
  // 吨方件车
  .goods_amount_type_box {
    display: flex;
    .goods_amount_type_item {
      font-size: 15px;
      background: #bebebe;
      padding: 0 2px;
      margin: 0 2px;
      border-radius: 4px;
      color: #fff;
      &.active {
        background: #1581cf;
      }
    }
  }
}
</style>
