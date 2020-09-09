<template>
  <div class="confirm_pay_freight_container">
    <c-header>
      <van-nav-bar title="应付运费" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <div class="radio-container" v-if="permission.collectTwoCfg === '8'">
          <div>
            <span class="vertical-line"></span>请选择付款方式：
          </div>
          <van-radio-group v-model="modelRadio" class="radio-group">
            <van-radio
              name="1"
              checked-color="#15499A"
              :class="modelRadio === '1' ? 'checked' : ''"
            >企业自付</van-radio>
            <van-radio
              name="2"
              checked-color="#15499A"
              :class="modelRadio === '2' ? 'checked' : ''"
            >
              供应链金融 (结算保障)
              <i class="iconfont iconwenhao" @click="seeSettlementActivity"></i>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="gray"></div>
        <div
          v-if="permission.collectTwoCfg === '8' && modelRadio === ''"
          class="mask"
          @click="checkChooseModel"
        ></div>
        <div v-if="modelRadio === '1' || modelRadio === ''">
          <van-cell-group>
            <van-field
              v-model.trim="formData.userFreight"
              label="运费总额："
              placeholder="请输入运费总额"
              type="number"
              required
              clearable
              v-if="permission.orgCfg718 === '49' && isFromH5 === '1'"
              @blur="arriveBlur"
            />
            <van-field
              v-model.trim="formData.userFreight"
              label="应付运费："
              placeholder="请输入应付运费"
              type="number"
              required
              clearable
              v-else
              @blur="arriveBlur"
            />
            <van-field
              v-model.trim="formData.prepayments"
              label="预付现金："
              placeholder="请输入预付现金"
              type="number"
              clearable
              @blur="arriveBlur"
            />
            <van-field
              v-model.trim="formData.prepaymentsOilCard"
              label="预付油卡："
              placeholder="请输入预付油卡"
              type="number"
              clearable
              @blur="arriveBlur"
              v-show="
                wayillConfig.oilCardCfg == '8' &&
                  !(
                    wayillConfig.isSfOrg === '1' &&
                    permission.collectTwoCfg === '8'
                  )
              "
            />
            <van-field
              v-model="formData.oilCardNo"
              label="油卡卡号："
              placeholder="请选择油卡卡号"
              right-icon="arrow"
              @click="gotoSelectOilCard(formData.prepaymentsOilCard)"
              v-show="
                wayillConfig.oilCardCfg == '8' &&
                  formData.prepaymentsOilCard != '' &&
                  formData.prepaymentsOilCard != 0 &&
                  /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/.test(
                    formData.prepaymentsOilCard
                  ) &&
                  !(
                    wayillConfig.isSfOrg === '1' &&
                    permission.collectTwoCfg === '8'
                  )
              "
              readonly
            />
            <van-field
              label="货值："
              type="number"
              v-model.trim="formData.goodsCost"
              @input="inputBlur()"
              placeholder="请填写实际货值"
              :disabled="permission.orgCfg718 === '49' && isFromH5 === '1'"
              v-if="wayillConfig.priceInsuranceCfg == '8'"
            >
              <div
                slot="right"
                style="color:#15499a"
                @click="claimRules()"
                v-show="permission.orgCfg718=== '49'&& isFromH5 === '1' ? false : true"
              >理赔规则》</div>
            </van-field>
            <van-field
              label="保价费："
              placeholder="请填写保价费"
              type="number"
              v-model.trim="formData.insFee"
              disabled
              v-show="wayillConfig.priceInsuranceCfg == '8'"
            ></van-field>
            <van-field
              label="线下油款："
              type="number"
              @blur="arriveBlur"
              placeholder="请填写线下油款"
              v-model.trim="formData.prepaymentsBuyOil"
              v-show="wayillConfig.existsAvaibleOilStation == '1'"
            ></van-field>
            <van-field
              label="线下气款："
              placeholder="请填写线下气款"
              type="number"
              @blur="arriveBlur"
              v-model.trim="formData.prepaymentsBuyGas"
              v-show="wayillConfig.existsAvaibleGasStation == '1'"
            ></van-field>
            <van-field
              label="线下路桥费："
              placeholder="请填写线下路桥费"
              type="number"
              @blur="arriveBlur"
              v-model.trim="formData.prepaymentsBuyEtc"
              v-show="wayillConfig.existsAvaibleEtcStation == '1'"
            ></van-field>
            <van-field
              v-model.trim="formData.arrivePay"
              label="到付金额："
              placeholder="请输入到付金额"
              type="number"
              disabled
            />
            <van-field
              v-model="formData.backFee"
              label="回单押金："
              placeholder="请输入回单押金"
              type="number"
              clearable
              @blur="arriveBlur"
            />
            <van-radio-group
              v-model="formData.items1Value"
              v-show="wayillConfig.goodsInsuranceCfg === '8'"
            >
              <van-cell-group>
                <van-cell title="购买保险" clickable @click="changeType">
                  <van-radio slot="icon" name="0" />
                </van-cell>
              </van-cell-group>
            </van-radio-group>

            <van-field
              label="货值："
              type="number"
              v-model.trim="formData.goodsCost"
              placeholder="请输入实际货值"
              required
              v-if="
                (wayillConfig.goodsInsuranceCfg == '8' &&
                  formData.items1Value == 0) ||
                  wayillConfig.orgAttr == '2'
              "
            />
            <div class="gray"></div>
            <!-- 回款宝配置||好运宝钱包配置（此时默认银行卡收款） 展示，  回款宝配置开启且四要素-->
            <van-field
              v-model="value2"
              label="收款方式："
              placeholder="请选择收款方式"
              :right-icon="
                wayillConfig.zyCapitalCfg === '8' &&
                write_car_information.alipayNo !== ''
                  ? 'arrow'
                  : ''
              "
              readonly
              @click="showPayTypeActions"
              v-if="
                wayillConfig.zyCapitalCfg === '8' ||
                  wayillConfig.hybWalletCfg == '8'
              "
            />
            <!-- （开回款宝配置 && 选择了方式）|| 不开回款宝配置-->
            <van-field
              v-model="value1"
              label="收款人信息："
              placeholder="请选择收款人信息"
              right-icon="arrow"
              readonly
              @click="gotoSelectInfo"
              v-if="
                (wayillConfig.zyCapitalCfg == '8' && value2 !== '') ||
                  wayillConfig.zyCapitalCfg !== '8'
              "
            />
          </van-cell-group>
          <div class="gray"></div>
          <div class="tips" v-show="wayillConfig.zyCapitalCfg == '8' && value2 === '好运宝收款'">
            <i class="iconfont icongantanhao"></i>
            <span>
              司机{{
              write_car_information.driverName
              }}已开通好运宝收款，请提醒司机去收款~
            </span>
          </div>
          <van-field
            label="定金："
            type="number"
            v-model.trim="formData.deposit"
            v-show="wayillConfig.depositCfg == '8'"
            placeholder="请填写定金"
          />
          <van-field
            label="推广费："
            type="number"
            v-model.trim="formData.promotionFee"
            v-show="wayillConfig.promotionFeeCfg == '8'"
            placeholder="请填写推广费"
          />
          <van-field
            label="应收回款："
            type="number"
            v-model.trim="formData.receivablePayback"
            v-show="wayillConfig.receivablePaybackCfg == '8'"
            placeholder="请填写应收回款"
          />
        </div>
        <div v-if="modelRadio === '2'">
          <van-field
            label="运费金额："
            type="number"
            v-model.trim="collectTwoCfg_formData.userFreight"
            placeholder="请填写运费金额"
            @blur="arriveBlur(1)"
            required
          />

          <van-field
            label="预付油卡："
            placeholder="请填写预付油卡"
            type="number"
            v-model.trim="collectTwoCfg_formData.prepaymentsOilCard"
            @blur="arriveBlur(2)"
            ref="prepayOilcard"
            required
          />

          <van-field
            label="油卡卡号："
            placeholder="请选择卡号"
            readonly
            v-model="collectTwoCfg_formData.oilCardNo"
            @click.native="
              gotoSelectOilCard(collectTwoCfg_formData.prepaymentsOilCard)
            "
            required
            right-icon="arrow"
          />

          <van-field
            label="到付金额："
            type="number"
            v-model.trim="collectTwoCfg_formData.arrivePay"
            @blur="arriveBlur"
            disabled
            required
          />

          <div class="gray"></div>
          <van-cell title="收款人信息：" :value="write_car_information.driverName + '好运宝钱包'"></van-cell>
          <div>
            <p style="color:red;text-indent:1em;font-size:14px;">
              <i class="iconfont icongantanhao"></i>
              <span
                v-if="
                  wayillConfig.hybWalletCfg === '8' &&
                    write_car_information.hybWallet === '1'
                "
              >提醒司机去好运宝钱包提现运费！</span>
              <span v-else>提醒司机开通好运宝钱包绑定银行卡去提现运费！</span>
            </p>
          </div>
        </div>
      </div>
      <div class="footer">
        <div v-if="permission.collectTwoCfg === '8' && modelRadio === ''" class="mask"></div>
        <van-button type="primary" size="large" @click="surePayFreight">确认并派车</van-button>
      </div>
    </div>
    <!-- 选择收款方式 -->
    <van-action-sheet
      v-model="payTypeActionsShow"
      close-on-click-action
      :actions="payTypeActions"
      @select="onSelectPayType"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import bus from '@/assets/js/bus.js';
import { pushCarInfo } from '@/api/externalassistanceapi';
import { queryWaybill, checkFee } from '@/api/apiBuildWaybill';
import { infoEntry } from '@/api/applyForPayment';
import { modifyWaybill, deliverWaybill } from '@/api/wayBill';
import { submitSupply } from '@/api/DB';
import { oilCardCheck, getOilCardNo } from '@/api/apiOilCard';
import { multiply, subtract, add } from '@/assets/js/utils';
import { dateFormat, getNow } from '@/common/filters';
export default {
  name: 'should_pay_freight',
  data() {
    return {
      isFromH5: this.$route.query.isFromH5, //0 否 1 是
      xid: this.$route.query.xid,
      taxWaybillId: this.$route.query.taxWaybillId,
      modelRadio: '',
      payTypeActionsShow: false,
      value1: '',
      value2: '',
      isSfOrg: '0', // 是否是盛丰企业 1：是 0 否
      payTypeActions: [
        { name: '好运宝收款', value: '好运宝收款' },
        { name: '银行卡收款', value: '银行卡收款' },
      ],
      wayillConfig: {}, // 建单前查的配置
      formData: {
        userFreight: '', // 运费金额
        backFee: '', // 回单押金
        prepayments: '', // 预付现金
        prepaymentsOilCard: '', // 预付油卡
        prepaymentsBuyOil: '', // 线下油款
        prepaymentsBuyGas: '', // 线下气款
        prepaymentsBuyEtc: '', // 线下路桥费
        goodsCost: '', // 货值
        demo1Checkbox: '', // 预付现金选中项
        items1Value: '0', // 保险选中项
        zyCapitalCfg: '', // 回款宝配置
        hybWalletCfg: '', // 钱包配置
        arrivePay: '',
        deposit: '', // 定金
        promotionFee: '', // 推广费
        receivablePayback: '', // 应收回款
        advancePayState: '', // 0：企业自付（为空也为此值）1：供应链金融
        oilCardNo: '',
        hkbPayeeType: '',
        startTime: '',
        oilBigType: '',
        insFee: '0.00',
      },
      collectTwoCfg_formData: {
        userFreight: '',
        prepaymentsOilCard: '',
        oilCardNo: '',
        arrivePay: '',
      },

      prepaymentsEtcCard: '0', //预付ETC
      freightIncr: '0', //运费增补默认给0
    };
  },
  computed: {
    ...mapGetters([
      'permission',
      'waybill_information',
      'write_car_information',
      'write_receive_information',
    ]),
    ...mapGetters({ goodsIdList: 'goodsSupply/goodsIdList' }),
  },
  watch: {
    modelRadio(val) {
      this.formData.advancePayState = val;
      if (val === '2') {
        this.modelRadioInit();
      }
    },
  },
  created() {},
  mounted() {
    bus.$on('selectOilCard', res => {
      this.formData.oilCardNo = res.oilCardNo;
      this.formData.oilBigType = res.oilBigType;
    });
    bus.$on('selectWriteReceiveInformation', res => {
      this.value1 = res.payName;
    });
    if (this.permission.orgCfg718 === '49' && this.isFromH5 === '1') {
      // 20200727 zhanghui 被要求不带
      // this.formData.userFreight = this.waybill_information.freight;
      this.formData.goodsCost = this.waybill_information.goodsCost;
      this.formData.insFee = this.waybill_information.insFee;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'write_car_information') {
        if (
          vm.write_car_information.cartBadgeNoChange == 1 &&
          vm.formData.oilBigType != '4'
        ) {
          vm.formData.oilCardNo = '';
        }
        if (
          vm.write_car_information.mobileNoChange == 1 &&
          vm.formData.oilBigType == '4'
        ) {
          vm.formData.oilCardNo = '';
        }
        vm._queryWaybill();
      }
    });
  },
  beforeDestroy() {
    bus.$off('selectOilCard');
    bus.$off('selectWriteReceiveInformation');
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    modelRadioInit() {
      this._getOilCardNo();
    },
    _getOilCardNo() {
      return new Promise((resolve, reject) => {
        let json = {
          driverMobileNo: this.write_car_information.mobileNo,
        };
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        getOilCardNo(json)
          .then(res => {
            if (res.data.reCode === '0') {
              this.collectTwoCfg_formData.oilCardNo = res.data.result.oilCardNo;
              resolve();
            } else {
              reject();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    seeSettlementActivity() {
      this.$router.push({
        path: '/settlement_activity',
      });
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      this.$router.push({
        path: '/choose_oil_card',
        query: {
          belongActSys: this.wayillConfig.belongActSys,
          cartBadgeNo: this.write_car_information.cartBadgeNo,
          driverName: this.write_car_information.driverName,
          mobileNo: this.write_car_information.mobileNo,
          prepaymentsOilCard: item,
        },
      });
    },
    showPayTypeActions() {
      if (
        this.wayillConfig.zyCapitalCfg === '8' &&
        this.write_car_information.alipayNo !== ''
      ) {
        this.payTypeActionsShow = true;
      }
    },
    // 收款人类型点击选择的值
    onSelectPayType(item) {
      this.value2 = item.value;
      if (this.value2 === '好运宝收款') {
        this.value1 = this.write_car_information.driverName;
      } else {
        this.value1 = this.write_receive_information.payName;
      }
    },
    gotoSelectInfo() {
      if (this.value2 === '好运宝收款') {
        this.$router.push({
          path: '/receiver_information', //携带四要素
          query: {
            driverName: this.write_car_information.driverName,
            idCard: this.write_car_information.idCard,
            mobileNo: this.write_car_information.mobileNo,
            alipayNo: this.write_car_information.alipayNo,
          },
        });
      } else {
        // await this.$store.dispatch(
        //   'buildWaybill/set_write_receive_information',
        //   this.write_car_information
        // )
        this.$router.push({
          path: '/write_receive_information',
          query: {
            driverName: this.write_car_information.driverName,
            idCard: this.write_car_information.idCard,
            mobileNo: this.write_car_information.mobileNo,
            alipayNo: this.write_car_information.alipayNo,
          },
        });
      }
    },
    _queryWaybill() {
      //初始化配置信息
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      queryWaybill({})
        .then(res => {
          if (res.data.reCode == 0) {
            let data = res.data.result;
            this.wayillConfig.belongActSys = data.belongActSys; //所属账户体系
            this.wayillConfig.oilCardCfg = data.oilCardCfg; //油卡权限配置
            this.wayillConfig.etcCardCfg = data.etcCardCfg;
            this.wayillConfig.maxAllFreight = data.maxAllFreight; //最大运费配置
            this.wayillConfig.existsAvaibleOilStation =
              data.existsAvaibleOilStation; //线下油款配置
            this.wayillConfig.existsAvaibleEtcStation =
              data.existsAvaibleEtcStation; //线下ETC配置
            this.wayillConfig.existsAvaibleGasStation =
              data.existsAvaibleGasStation; //线下气款配置
            this.wayillConfig.goodsInsuranceCfg = data.goodsInsuranceCfg; //购买保险配置
            this.wayillConfig.orgAttr = data.orgAttr; //用户属性
            this.wayillConfig.yetBuyEtcNotInvoice = data.yetBuyEtcNotInvoice; //累计ETC未开票金额
            this.wayillConfig.yetBuyGasNotInvoice = data.yetBuyGasNotInvoice; //累计加气未开票金额
            this.wayillConfig.yetBuyOilNotInvoice = data.yetBuyOilNotInvoice; //累计购油未开票金额
            this.wayillConfig.yetPrepaymentsBuyEtc = data.yetPrepaymentsBuyEtc; //线下路桥费
            this.wayillConfig.yetPrepaymentsBuyGas = data.yetPrepaymentsBuyGas; //线下气款
            this.wayillConfig.yetPrepaymentsBuyOil = data.yetPrepaymentsBuyOil; //线下油款
            this.wayillConfig.oilCardPayUpperCfg = data.oilCardPayUpperCfg; //油卡支付上限
            this.wayillConfig.loginState = data.loginState; //状态
            this.wayillConfig.report003Cfg = data.report003Cfg; //经营会计报表配置
            this.wayillConfig.depositCfg = data.depositCfg;
            this.wayillConfig.promotionFeeCfg = data.promotionFeeCfg;
            this.wayillConfig.receivablePaybackCfg = data.receivablePaybackCfg;
            this.wayillConfig.priceInsuranceCfg = data.priceInsuranceCfg; //保价运输险配置
            this.wayillConfig.priceInsuranceRate = data.priceInsuranceRate; //保价费率
            this.wayillConfig.zyCapitalCfg = data.zyCapitalCfg; // 回款宝配置
            this.wayillConfig.hybWalletCfg = data.hybWalletCfg; // 好运宝钱包配置
            this.wayillConfig.driverFinanceCfg = data.driverFinanceCfg;
            this.wayillConfig.driverFinanceProportionCfg =
              data.driverFinanceProportionCfg;

            this.wayillConfig.isSfOrg = data.isSfOrg;

            this.wayillConfig = Object.assign({}, this.wayillConfig);

            if (this.value2 === '好运宝收款' || this.value2 === '') {
              if (
                this.wayillConfig.zyCapitalCfg === '8' &&
                this.write_car_information.alipayNo
              ) {
                this.value2 = '';
                this.value1 = '';
              } else {
                this.value2 = '银行卡收款';
                this.value1 = '';
              }
            }
          }
        })
        .catch(() => {});
    },
    inputBlur() {
      let reg = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
      if (this.formData.goodsCost == '') {
        this.formData.insFee = '0.00';
      }
      if (this.wayillConfig.priceInsuranceCfg == '8') {
        if (!reg.test(this.formData.goodsCost)) {
          this.formData.insFee = '0.00';
        } else {
          this.formData.insFee = Number(
            this.formData.goodsCost * this.wayillConfig.priceInsuranceRate,
          ).toFixed(2);
        }
      }
    },
    //点击购买保险
    changeType() {
      if (this.formData.items1Value == 0) {
        this.formData.items1Value = '1';
      } else {
        this.formData.items1Value = '0';
      }
    },
    //鼠标离开自动计算到付金额
    arriveBlur(typeInput) {
      if (this.modelRadio === '2') {
        if (typeInput === 1) {
          let temp = (Number(this.collectTwoCfg_formData.userFreight) * 3) / 10;
          if (Number(temp) > 100) {
            this.collectTwoCfg_formData.prepaymentsOilCard = Number(
              Math.ceil(temp / 100) * 100,
            ).toFixed(2);
          } else {
            this.collectTwoCfg_formData.prepaymentsOilCard = Number(
              temp,
            ).toFixed(2);
          }
          this.collectTwoCfg_formData.arrivePay = (
            Number(this.collectTwoCfg_formData.userFreight) -
            Number(this.collectTwoCfg_formData.prepaymentsOilCard)
          ).toFixed(2);
        } else if (typeInput === 2) {
          this.checkPrepaymentsOilCard();
        }
      } else {
        this.formData.arrivePay = (
          Number(this.formData.userFreight) -
          Number(this.formData.prepayments) -
          Number(this.formData.prepaymentsOilCard) -
          Number(this.formData.backFee) +
          Number(this.freightIncr)
        ).toFixed(2);
      }
      //如果输入非法的值计算，则结果不能为NaN，替换为0.00
      if (this.formData.arrivePay == 'NaN') {
        this.formData.arrivePay = '0.00';
      }
    },
    // 检查预付油卡金额
    checkPrepaymentsOilCard() {
      // eslint-disable-next-line no-useless-escape
      let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
      if (!regExp.test(this.collectTwoCfg_formData.prepaymentsOilCard)) {
        this.$klb.confirm.show({
          title: '提示',
          content: '无效的预付油卡金额！',
          showCancelButton: false,
          onConfirm: () => {},
        });
        return false;
      }
      let temp = (Number(this.collectTwoCfg_formData.userFreight) * 3) / 10;
      if (
        Number(this.collectTwoCfg_formData.prepaymentsOilCard) < Number(temp)
      ) {
        this.collectTwoCfg_formData.prepaymentsOilCard = 0;
        this.collectTwoCfg_formData.arrivePay = (
          Number(this.collectTwoCfg_formData.userFreight) -
          Number(this.collectTwoCfg_formData.prepaymentsOilCard)
        ).toFixed(2);
        this.$klb.confirm.show({
          title: '提示',
          content: `您输入的预付油卡金额不可小于${temp}元`,
          confirmText: '确认',
          showCancelButton: false,
          onConfirm: () => {
            this.$refs.prepayOilcard.focus();
          },
          onCancel: () => {
            this.$refs.prepayOilcard.focus();
          },
          onClose: () => {
            this.$refs.prepayOilcard.focus();
          },
        });
        return false;
      } else if (
        Number(this.collectTwoCfg_formData.prepaymentsOilCard) >
        Number(this.collectTwoCfg_formData.userFreight)
      ) {
        this.collectTwoCfg_formData.prepaymentsOilCard = 0;
        this.collectTwoCfg_formData.arrivePay = (
          Number(this.collectTwoCfg_formData.userFreight) -
          Number(this.collectTwoCfg_formData.prepaymentsOilCard)
        ).toFixed(2);
        this.$klb.confirm.show({
          title: '提示',
          content: '您输入的预付油卡金额不可大于运费金额！',
          confirmText: '确认',
          showCancelButton: false,
          onConfirm: () => {
            this.$refs.prepayOilcard.focus();
          },
          onCancel: () => {
            this.$refs.prepayOilcard.focus();
          },
          onClose: () => {
            this.$refs.prepayOilcard.focus();
          },
        });
        return false;
      } else {
        this.collectTwoCfg_formData.arrivePay = (
          Number(this.collectTwoCfg_formData.userFreight) -
          Number(this.collectTwoCfg_formData.prepaymentsOilCard)
        ).toFixed(2);
      }
      return true;
    },
    //理赔规则跳转方法
    claimRules() {
      this.$router.push('/claim_rules');
    },
    checkChooseModel(event) {
      if (this.permission.collectTwoCfg === '8' && this.modelRadio === '') {
        // 开通到付金2配置且没有选择付款方式
        this.$klb.confirm.show({
          title: '提示',
          content: '请先选择运费付款方式',
          confirmText: '确认',
          showCancelButton: false,
          onConfirm: () => {},
        });
        event.stopPropagation();
      }
    },
    gotoBuild() {
      if (this.wayillConfig.zyCapitalCfg === '8') {
        if (this.value2 === '好运宝收款') {
          this.formData.payType = '1';
          this.formData.hkbPayeeType = '1';
        } else {
          if (this.value2 === '') {
            this.formData.payType = '';
            this.formData.hkbPayeeType = '';
          } else {
            let payName = this.write_receive_information.payName
              ? this.write_receive_information.payName
              : '';
            if (this.write_receive_information.payBankName == '好运宝钱包') {
              this.formData.payType = '1';
            } else {
              if (payName == this.write_car_information.driverName) {
                this.formData.payType = '1';
              } else {
                this.formData.payType = '0';
              }
            }
            this.formData.hkbPayeeType = '0';
          }
        }
      } else {
        let payName = this.write_receive_information.payName
          ? this.write_receive_information.payName
          : '';
        this.formData.hkbPayeeType = '0';
        if (payName == this.write_car_information.driverName) {
          this.formData.payType = '1';
        } else {
          this.formData.payType = '0';
        }
      }
      // 处理起运时间
      this.formData.startTime = this.waybill_information.startTime;
      if (this.formData.startTime == '') {
        this.formData.startTime = getNow();
      } else {
        this.formData.startTime =
          this.formData.startTime.split(':').length == '3'
            ? this.formData.startTime
            : this.formData.startTime + ':00';
      }
      if (this.permission.orgCfg718 === '49' && this.isFromH5 === '1') {
        try {
          delete this.write_car_information.userFreight;
        } catch (error) {
          console.log(error);
        }
      }
      let json = ''
      if (this.permission.orgCfg718 === '49' && this.isFromH5 === '1') {
        json = Object.assign({},this.waybill_information, this.write_car_information,this.formData);
      } else {
        json = Object.assign({}, this.write_car_information,this.formData);
      }


      if (this.value2 == '好运宝收款') {
        json.cityId = ''; //开户行城市
        json.alipayNo = this.write_car_information.alipayNo; //收款人支付宝账号
        json.payIdCard = this.write_car_information.idCard; //收款人身份证
        json.payBankNo = this.write_car_information.payBankNo; //收款人银行卡号
        json.payName = this.write_car_information.driverName; //收款人姓名
        json.payBankName = this.write_car_information.payBankName; //收款银行名称
        json.provinceId = ''; //开户行省份
        json.payMobileNo = this.write_car_information.mobileNo; //收款人手机号
      } else {
        json.cityId =
          this.write_receive_information.payBankName == '好运宝钱包'
            ? '701'
            : this.write_receive_information.cityId;
        json.alipayNo = '';
        json.payIdCard = this.write_receive_information.payIdCard;
        json.payBankNo = this.write_receive_information.payBankNo; //收款人银行卡号
        json.payName = this.write_receive_information.payName; //收款人姓名
        json.payBankName =
          this.write_receive_information.payBankName == '好运宝钱包'
            ? '浙江网商银行'
            : this.write_receive_information.payBankName; //收款银行名称
        json.provinceId =
          this.write_receive_information.payBankName == '好运宝钱包'
            ? '7'
            : this.write_receive_information.provinceId; //开户行省份
        json.payMobileNo = this.write_receive_information.payMobileNo; //收款人手机号
      }

      json.deposit =
        this.wayillConfig.depositCfg == '8' ? this.formData.deposit : ''; //定金

      json.promotionFee =
        this.wayillConfig.promotionFeeCfg == '8'
          ? this.formData.promotionFee
          : ''; //推广费

      json.receivablePayback =
        this.wayillConfig.receivablePaybackCfg == '8'
          ? this.formData.receivablePayback
          : ''; //应收回款

      if (this.modelRadio === '2') {
        // 走供应链
        json.userFreight = this.collectTwoCfg_formData.userFreight;
        json.prepaymentsOilCard = this.collectTwoCfg_formData.prepaymentsOilCard;
        json.oilCardNo = this.collectTwoCfg_formData.oilCardNo;
        json.arrivePay = this.collectTwoCfg_formData.arrivePay;
        json.payType = '1';
        json.payIdCard = '';
        json.payBankName = '';
        json.payBankNo = '';
        json.payMobileNo = '';
        json.provinceId = '';
        json.cityId = '';
        json.payName = '';
        json.alipayNo = '';

        json.prepayments = '';
        json.backFee = '';
        json.deposit = '';
        json.promotionFee = '';
        json.receivablePayback = '';
      }
      json.cartLength = parseFloat(json.cartLength);
      json.cartTonnage = parseFloat(json.cartTonnage);
      json.taxWaybillId = this.taxWaybillId;
      json.xid = this.xid;
      json.allFreight =
        this.formData.userFreight || this.waybill_information.allFreight;
      json.wbMode =
        this.permission.orgCfg718 === '49' && this.isFromH5 === '1' ? '1' : '2';
      json.extassistType =
        this.permission.orgCfg718 === '49' && this.isFromH5 === '1' ? '2' : ''; // 2代表德邦外协
      json.updwOrgid = this.waybill_information.updwOrgid; // 发货方ID
      json.updwFreight = this.waybill_information.updwFreight; // 上游运费
      console.log(json);
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      if (this.permission.orgCfg718 === '49' && this.isFromH5 === '1') {
        deliverWaybill(json).then(res => {
          if (res.data.reCode === '0') {
            let taxWaybillId = res.data.result.taxWaybillId;
            submitSupply({
              taxWaybillId: taxWaybillId,
              goodsId: this.goodsIdList,
            }).then(res => {
              if (res.data.reCode === '0') {
                pushCarInfo({ taxWaybillId });
                this.$router.push({
                  path: '/dispatching_cars_success',
                  query: {
                    isFromH5: this.isFromH5,
                    taxWaybillId: taxWaybillId,
                  },
                });
              } else {
                this.$toast(res.data.reInfo, 'middle');
              }
            });
          }
        });
      } else {
        modifyWaybill(json).then(res => {
          if (res.data.reCode === '0') {
            if (this.permission.orgCfg718 === '49') {
              pushCarInfo({ taxWaybillId: res.data.result.taxWaybillId});
            }
            this.$router.push({
              path: '/dispatching_cars_success',
              query: { isFromH5: this.isFromH5,taxWaybillId: res.data.result.taxWaybillId, },
            });
          }
        });
      }
    },
    informationEntry() {
      let jsons = {
        mobileNo: this.write_car_information.mobileNo,
        payeeBankNo: this.write_receive_information.payBankNo, //收款人银行卡号
        payeeName: this.write_receive_information.payName, //收款人姓名
        payeeBankName: this.write_receive_information.payBankName, //收款银行名称
        payeeProvinceId: this.write_receive_information.provinceId, //开户行省份
        payeeCityId: this.write_receive_information.cityId, //开户行城市
        payeeIdCard: this.write_receive_information.payIdCard, //收款人身份证
        payeeMobileNo: this.write_receive_information.payMobileNo, //收款人手机号
        alipayNo: this.write_car_information.alipayNo, //收款人支付宝
      };
      if (
        jsons.mobileNo &&
        jsons.payeeBankNo &&
        jsons.payeeName &&
        jsons.payeeBankName &&
        jsons.payeeProvinceId &&
        jsons.payeeCityId &&
        jsons.payeeIdCard &&
        jsons.payeeMobileNo
      ) {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        infoEntry(jsons).then(() => {
          this.oilCardCheck();
        });
      } else {
        this.oilCardCheck();
      }
    },
    //油卡验证接口
    oilCardCheck() {
      //油卡配置开通了要去验证油卡
      if (this.wayillConfig.oilCardCfg == '8') {
        let _that = this;
        let json = {
          prepaymentsOilCard: this.formData.prepaymentsOilCard,
          cartBadgeNo: this.write_car_information.cartBadgeNo,
          belongActSys: this.wayillConfig.belongActSys,
          oilCardNo: this.formData.oilCardNo,
        };
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        oilCardCheck(json).then(res => {
          if (res.data.reCode == '0') {
            _that.gotoBuild();
          } else {
            this.successFlag = 1;
            this.$klb.confirm.show({
              title: '提示',
              buttonText: '知道了',
              content: res.data.reInfo,
            });
          }
        });
      } else {
        this.gotoBuild();
      }
    },
    success() {
      var _this = this;
      this.successFlag = 0;
      var json = {
        fromProvId: this.waybill_information.startProvinceId, //起运省份ID
        toProvId: this.waybill_information.endProvinceId, //目的省份ID
        fromCityId: this.waybill_information.startCityId, //起运城市ID
        toCityId: this.waybill_information.endCityId, //目的城市ID
        userFreight: this.formData.userFreight, //运输总价
        allFreight:
          this.formData.userFreight || this.waybill_information.allFreight, //运输总价
      };
      if (this.modelRadio === '2') {
        json.userFreight = this.collectTwoCfg_formData.userFreight;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      checkFee(json).then(res => {
        if (res.data.reCode == '0') {
          if (_this.modelRadio === '2') {
            _this.gotoBuild();
          } else {
            if (this.write_receive_information.payBankName == '好运宝钱包') {
              _this.oilCardCheck();
            } else {
              _this.informationEntry();
            }
          }
        } else {
          this.successFlag = 1;
          if (res.data.reCode == '1') {
            //走confirm
            this.$klb.confirm.show({
              title: '提示',
              content: res.data.reInfo,
              confirmText: '确认',
              cancelText: '取消',
              onConfirm: () => {
                if (_this.modelRadio === '2') {
                  _this.gotoBuild();
                } else {
                  //点击确定去建单
                  if (
                    this.write_receive_information.payBankName == '好运宝钱包'
                  ) {
                    _this.oilCardCheck();
                  } else {
                    _this.informationEntry();
                  }
                }
              },
            });
          } else {
            this.$toast('抱歉,您录入的数据不合法,请核实后重试！', 'middle');
          }
        }
      });
    },
    // 建单保存
    surePayFreight() {
      if (this.modelRadio === '2') {
        // 到付2&&选择第二个
        if (!this.checkPrepaymentsOilCard()) {
          return false;
        }
        //
        if (!this.isEmptyStr(this.collectTwoCfg_formData.userFreight)) {
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.collectTwoCfg_formData.userFreight)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '运费金额不合法！',
            });
            return false;
          }
          if (
            Number(this.collectTwoCfg_formData.userFreight) >
            Number(this.wayillConfig.maxAllFreight)
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '运费金额不能超过最大金额！',
            });
            return false;
          }
        } else {
          this.$klb.confirm.show({ title: '提示', content: '运费金额必填！' });
          return false;
        }
        //
        if (this.isEmptyStr(this.collectTwoCfg_formData.oilCardNo)) {
          this.$klb.confirm.show({ title: '提示', content: '油卡卡号必填！' });
          return false;
        }
        //
        if (this.isEmptyStr(this.collectTwoCfg_formData.prepaymentsOilCard)) {
          this.$klb.confirm.show({ title: '提示', content: '预付油卡必填！' });
          return false;
        }
        //货值判断(保价费)
        if (this.wayillConfig.priceInsuranceCfg == 8) {
          // eslint-disable-next-line no-useless-escape
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.formData.goodsCost = this.trim(this.formData.goodsCost);
          if (!this.isEmptyStr(this.formData.goodsCost)) {
            if (!regexp.test(this.formData.goodsCost)) {
              this.$toast('货值输入不合法！', 'middle');
              return false;
            }
          } else {
            this.$klb.confirm.show({
              title: '提示',
              content: '企业已开通"保价运输"请输入此次运输货值！',
            });
            return false;
          }
        }
        if (
          (this.wayillConfig.goodsInsuranceCfg == 8 &&
            this.formData.items1Value == 0) ||
          this.wayillConfig.orgAttr == 2
        ) {
          // eslint-disable-next-line no-useless-escape
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.formData.goodsCost = this.trim(this.formData.goodsCost);
          if (!this.isEmptyStr(this.formData.goodsCost)) {
            if (!regexp.test(this.formData.goodsCost)) {
              //（货值最小一万, 最大五百万）
              this.$toast('货值输入不合法！', 'middle');
              return false;
            }
          } else {
            this.$toast('货值必填！', 'middle');
            return false;
          }
        }
        this.success();
      } else {
        //是否购买保险来判断货值,以用户属性判断 orgAttr 是否显示货值
        if (!this.isEmptyStr(this.formData.userFreight)) {
          this.formData.userFreight = this.trim(this.formData.userFreight);
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.userFreight)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '运费金额不合法！',
            });
            return false;
          }
          if (
            Number(this.formData.userFreight) >
            Number(this.wayillConfig.maxAllFreight)
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '运费金额不能超过最大金额！',
            });
            return false;
          }
        } else {
          this.$klb.confirm.show({ title: '提示', content: '运费金额必填！' });
          return false;
        }

        //预付和回单付的值判断
        if (!this.isEmptyStr(this.formData.prepayments)) {
          this.formData.prepayments = this.trim(this.formData.prepayments);
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.prepayments)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的预付现金！',
            });
            return false;
          }
          if (!this.isEmptyStr(this.formData.userFreight)) {
            if (
              Number(this.formData.prepayments) >
              Number(this.formData.userFreight)
            ) {
              this.$klb.confirm.show({
                title: '提示',
                content: '预付现金不能超过运费金额！',
              });
              return false;
            }
          }
          if (
            Number(this.formData.prepayments) >
            Number(this.wayillConfig.maxAllFreight)
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '预付现金不能超过最大金额！',
            });
            return false;
          }
        }
        if (
          this.wayillConfig.oilCardCfg == 8 &&
          !this.isEmptyStr(this.formData.prepaymentsOilCard)
        ) {
          this.formData.prepaymentsOilCard = this.trim(
            this.formData.prepaymentsOilCard,
          );
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.prepaymentsOilCard)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的预付油卡金额！',
            });
            return false;
          } else {
            if (
              Number(this.formData.prepaymentsOilCard) >
              Number(this.wayillConfig.maxAllFreight)
            ) {
              this.$klb.confirm.show({
                title: '提示',
                content: '预付油卡金额不能超过最大金额！',
              });
              return false;
            }
            if (this.oilCardNo == '') {
              this.$klb.confirm.show({
                title: '提示',
                content:
                  '<p style="color:#454545;">当前运单存在预付油卡</p><p style="color:#454545;">请选择油卡!</p>',
                confirmText: '选择油卡',
                cancelText: '确认建单',
                onConfirm: () => {
                  this.$router.push({
                    path: '/chooseOilCard',
                    query: {
                      belongActSys: this.wayillConfig.belongActSys,
                      prepaymentsOilCard: this.formData.prepaymentsOilCard,
                    },
                  });
                },
                onCancel: () => {
                  if (this.driverFinanceJudge() == false) {
                    return false;
                  }
                  this.success();
                },
              });
              return false;
            }
          }
        }

        //货值判断(保价费)
        if (this.wayillConfig.priceInsuranceCfg == 8) {
          // eslint-disable-next-line no-useless-escape
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.formData.goodsCost = this.trim(this.formData.goodsCost);
          if (!this.isEmptyStr(this.formData.goodsCost)) {
            if (!regexp.test(this.formData.goodsCost)) {
              this.$toast('货值输入不合法！', 'middle');
              return false;
            }
          } else {
            this.$klb.confirm.show({
              title: '提示',
              content: '企业已开通"保价运输"请输入此次运输货值！',
            });
            return false;
          }
        }

        if (
          this.wayillConfig.existsAvaibleOilStation == 1 &&
          !this.isEmptyStr(this.formData.prepaymentsBuyOil)
        ) {
          this.formData.prepaymentsBuyOil = this.trim(
            this.formData.prepaymentsBuyOil,
          );
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.prepaymentsBuyOil)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的线下油款金额！',
            });
            return false;
          } else {
            if (
              Number(this.formData.prepaymentsBuyOil) >
              Number(this.wayillConfig.maxAllFreight)
            ) {
              this.$klb.confirm.show({
                title: '提示',
                content: '线下油款不能超过最大金额！',
              });
              return false;
            }
          }
        }

        //线下路桥费配置existsAvaibleEtcStation
        if (
          this.wayillConfig.existsAvaibleEtcStation == 1 &&
          !this.isEmptyStr(this.formData.prepaymentsBuyEtc)
        ) {
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          this.formData.prepaymentsBuyEtc = this.trim(
            this.formData.prepaymentsBuyEtc,
          );
          if (!regExp.test(this.formData.prepaymentsBuyEtc)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的线下路桥费金额！',
            });
            return false;
          }
        }

        //线下气款配置existsAvaibleGasStation
        if (
          this.wayillConfig.existsAvaibleGasStation == 1 &&
          !this.isEmptyStr(this.formData.prepaymentsBuyGas)
        ) {
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          this.formData.prepaymentsBuyGas = this.trim(
            this.formData.prepaymentsBuyGas,
          );
          if (!regExp.test(this.formData.prepaymentsBuyGas)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的线下气款金额！',
            });
            return false;
          }
        }
        //预付油卡、预付ETC、判断
        if (this.wayillConfig.oilCardCfg == '8') {
          if (
            this.wayillConfig.existsAvaibleOilStation == 0 &&
            subtract(
              this.formData.prepaymentsOilCard,
              multiply(
                this.d(this.f(this.formData.userFreight, 0), this.freightIncr),
                this.wayillConfig.oilCardPayUpperCfg,
              ),
            ) > 0
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '请确认，预付油卡金额不能大于设置的上限。',
            });

            return false;
          }
          // 预付油卡金额加上线下油款金额不能大于运费金额*油卡支付上限
          if (
            subtract(
              add(
                this.formData.prepaymentsOilCard,
                this.formData.prepaymentsBuyOil,
              ),
              multiply(
                this.d(
                  this.d(
                    this.f(this.formData.userFreight, 0),
                    this.freightIncr,
                  ),
                  this.formData.prepaymentsBuyOil,
                ),
                this.wayillConfig.oilCardPayUpperCfg,
              ),
            ) > 0
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content:
                '请确认，预付油卡金额加上线下油款金额不能大于设置的上限。',
            });
            return false;
          }
        }
        // 企业累计线下油款不能大于累计购油未开票余额
        if (
          subtract(
            add(
              this.formData.prepaymentsBuyOil,
              this.wayillConfig.yetPrepaymentsBuyOil,
            ),
            this.wayillConfig.yetBuyOilNotInvoice,
          ) > 0
        ) {
          this.$klb.confirm.show({
            title: '提示',
            content: '请确认，企业累计线下油款不能大于累计购油未开票余额。',
          });
          return false;
        }

        // 企业累计线下路桥费不能大于累计路桥费未开票余额
        if (
          subtract(
            add(
              this.formData.prepaymentsBuyEtc,
              this.wayillConfig.yetPrepaymentsBuyEtc,
            ),
            this.wayillConfig.yetBuyEtcNotInvoice,
          ) > 0
        ) {
          this.$klb.confirm.show({
            title: '提示',
            content: '请确认，企业累计线下路桥费不能大于累计路桥费未开票余额。',
          });
          return false;
        }

        // 企业累计线下路桥费不能大于累计路桥费未开票余额
        if (
          subtract(
            add(
              this.formData.prepaymentsBuyGas,
              this.wayillConfig.yetPrepaymentsBuyGas,
            ),
            this.wayillConfig.yetBuyGasNotInvoice,
          ) > 0
        ) {
          this.$klb.confirm.show({
            title: '提示',
            content: '请确认，企业累计线下气款不能大于累计气款未开票余额。',
          });
          return false;
        }
        //预付、回单付 都点击的情况
        if (!this.isEmptyStr(this.formData.backFee)) {
          this.formData.backFee = this.trim(this.formData.backFee);
          this.formData.userFreight = this.trim(this.formData.userFreight);
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.backFee)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的回单押金金额！',
            });
            return false;
          }
          if (!this.isEmptyStr(this.formData.userFreight)) {
            if (
              Number(this.formData.backFee) > Number(this.formData.userFreight)
            ) {
              this.$klb.confirm.show({
                title: '提示',
                content: '回单押金不能大于运费金额！',
              });
              return false;
            }
          }
          if (
            Number(this.formData.backFee) >
            Number(this.wayillConfig.maxAllFreight)
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '回单押金不能超过最大运费金额！',
            });
            return false;
          }
        }

        if (
          (this.wayillConfig.goodsInsuranceCfg == 8 &&
            this.formData.items1Value == 0) ||
          this.wayillConfig.orgAttr == 2
        ) {
          // eslint-disable-next-line no-useless-escape
          let regexp = /^([1-9]\d{0,9})([\.]\d{0,2})?$/;
          this.formData.goodsCost = this.trim(this.formData.goodsCost);
          if (!this.isEmptyStr(this.formData.goodsCost)) {
            if (!regexp.test(this.formData.goodsCost)) {
              //（货值最小一万, 最大五百万）
              this.$toast('货值输入不合法！', 'middle');
              return false;
            }
          } else {
            this.$toast('货值必填！', 'middle');
            return false;
          }
        }
        if (
          this.d(
            this.prepaymentsEtcCard,
            this.d(
              this.formData.prepaymentsOilCard,
              this.d(this.formData.prepayments, this.formData.backFee),
            ),
          ) > this.d(this.f(this.formData.userFreight, 0), this.freightIncr)
        ) {
          if (
            this.wayillConfig.oilCardCfg == '8' &&
            this.wayillConfig.etcCardCfg == '8'
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content:
                '请确认，预付油卡加上预付现金加上回单押金必须要小于等于运费金额。',
            });
          } else if (
            this.wayillConfig.oilCardCfg == '8' &&
            this.wayillConfig.etcCardCfg == '9'
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content:
                '请确认，预付油卡加上预付现金加上回单押金必须要小于等于运费金额。',
            });
          } else if (
            this.wayillConfig.oilCardCfg == '9' &&
            this.wayillConfig.etcCardCfg == '8'
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '请确认，预付现金加上回单押金必须要小于等于运费金额。',
            });
          } else {
            this.$klb.confirm.show({
              title: '提示',
              content: '请确认，预付现金加上回单押金必须要小于等于运费金额。',
            });
          }
          return false;
        }

        //点击了回单付
        //只有回单押金
        if (!this.isEmptyStr(this.formData.backFee)) {
          this.formData.backFee = this.trim(this.formData.backFee);
          this.formData.userFreight = this.trim(this.formData.userFreight);
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.backFee)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的回单押金金额！',
            });
            return false;
          }
          if (!this.isEmptyStr(this.formData.userFreight)) {
            if (
              Number(this.formData.backFee) > Number(this.formData.userFreight)
            ) {
              this.$klb.confirm.show({
                title: '提示',
                content: '回单押金不能大于运费金额！',
              });
              return false;
            }
          }
          if (
            Number(this.formData.backFee) >
            Number(this.wayillConfig.maxAllFreight)
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '回单押金不能超过最大运费金额！',
            });
            return false;
          }
        }

        //定金、推广费、应收回款 deposit promotionFee receivablePayback
        if (!this.isEmptyStr(this.formData.etcCardCfg)) {
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.etcCardCfg)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的定金！',
            });
            return false;
          }
        }
        if (!this.isEmptyStr(this.formData.promotionFee)) {
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.promotionFee)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的推广费！',
            });
            return false;
          }
        }
        if (!this.isEmptyStr(this.formData.receivablePayback)) {
          // eslint-disable-next-line no-useless-escape
          let regExp = /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/;
          if (!regExp.test(this.formData.receivablePayback)) {
            this.$klb.confirm.show({
              title: '提示',
              content: '无效的应收回款！',
            });
            return false;
          }
        }

        if (this.driverFinanceJudge() == false) {
          return false;
        }

        if (
          !this.isEmptyStr(this.waybill_information.startProvinceId) &&
          !this.isEmptyStr(this.waybill_information.endProvinceId) &&
          !this.isEmptyStr(this.waybill_information.startCityId) &&
          !this.isEmptyStr(this.waybill_information.endCityId) &&
          !this.isEmptyStr(this.formData.userFreight)
        ) {
          //建单运费判断
          this.success();
        }
      }
    },
    //自定义去前后空格的方法
    trim: function(i) {
      return i.toString().replace(/\s/g, '');
    },
    //非空验证通用方法
    isEmptyStr: function(str) {
      var pat = /^[\s]*$/;
      if (undefined == str || '' == str || null == str || pat.test(str)) {
        return true;
      }
      return false;
    },
    //油款,气款,路桥费 等计算方法
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
    /**
     * 司机金融1.1新加逻辑
     */
    driverFinanceJudge() {
      if (this.wayillConfig.driverFinanceCfg == '8') {
        let allFreightRate = parseFloat(
          this.wayillConfig.driverFinanceProportionCfg *
            this.formData.belongActSys,
        ).toFixed(2);
        let prepaymentsOilCardRate = parseFloat(
          this.wayillConfig.oilCardPayUpperCfg * this.formData.belongActSys,
        ).toFixed(2);
        /**
         * toPercent(a) 小数转换成百分比
         */
        if (Number(this.formData.oilCardPayUpperCfg) > prepaymentsOilCardRate) {
          this.$klb.confirm.show({
            title: '提示',
            content: `您输入的预付油卡金额超过运费的${this.toPercent(
              this.wayillConfig.oilCardPayUpperCfg,
            )}，请重新输入！`,
          });
          return false;
        }
        if (Number(this.wayillConfig.driverFinanceProportionCfg) != 1) {
          if (
            this.isEmptyStr(this.formData.backFee) ||
            Number(this.formData.backFee) <= '0'
          ) {
            this.$klb.confirm.show({
              title: '提示',
              content: '请输入回单押金！',
            });
            return false;
          }
          if (Number(this.formData.arrivePay) > allFreightRate) {
            this.$klb.confirm.show({
              title: '提示',
              content: '您输入的到付款&回单押金金额不合规，请重新输入！',
            });
            return false;
          }
          if (Number(this.formData.arrivePay) <= '0') {
            this.$klb.confirm.show({
              title: '提示',
              content: '到付金额必须大于0！',
            });
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.confirm_pay_freight_container {
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #fff;
    .radio-container {
      background-color: #fff;
      padding-top: 10px;
      padding-left: 20px;
      font-size: 15px;
      .vertical-line {
        display: inline-block;
        width: 2px;
        height: 0.8em;
        background: #15499a;
        margin-right: 4px;
      }
      .radio-group {
        padding: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 16px;
        .van-radio {
          margin-right: 10px;
        }
        .checked {
          .van-radio__label {
            color: #15499a;
          }
        }
        .iconwenhao {
          color: #ffba00;
        }
      }
    }
    .content {
      position: relative;
      flex: 1;
      .tips {
        font-size: 14px;
        color: rgba(216, 75, 76, 1);
        line-height: 24px;
        padding: 12px;
        .icongantanhao {
          margin-right: 5px;
        }
      }
    }
    .footer {
      // position: relative;
      // margin-bottom: 39px;
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
      margin-bottom: 60px;
    }
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      background: rgba(255, 255, 255, 0.1);
      z-index: 999;
      top: 0;
      left: 0;
    }
  }
}
</style>
