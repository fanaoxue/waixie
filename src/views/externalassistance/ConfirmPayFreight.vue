<template>
  <div class="confirm_pay_freight">
    <c-header isShowTitle class="header">
      <van-nav-bar title="确认应付运费" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base" v-show="pageShow">
      <div class="gray"></div>
      <div class="card_group">
        <van-cell title="运单信息" @click.native="showOrHide(0)" class="header_cell_title">
          <div slot="default" class="show-or-hide">
            <img
              src="../../assets/imgs/shouqi_icon@2x.png"
              alt
              width="16"
              height="12"
              class="img-icon"
              :class="{
                shouQi: showControl[0] === 0,
                zhanKai: showControl[0] === 1
              }"
            />
          </div>
        </van-cell>
        <div class="slide" :class="{ animate: showControl[0] === 1 }">
          <van-cell-group>
            <van-field
              v-model.trim="formData.taxWaybillNo"
              label="运单号："
              placeholder="请输入运单号"
              required
              clearable
            />
            <van-field
              v-model="formData.startPlace"
              label="装货地："
              placeholder="请选择装货地"
              @click="goChooseCity(0)"
              required
              :right-icon="readOnly ? '' : 'arrow'"
            />
            <van-field
              v-model="formData.endPlace"
              label="卸货地："
              placeholder="请选择卸货地"
              @click="goChooseCity(1)"
              required
              :right-icon="readOnly ? '' : 'arrow'"
            />
            <van-field
              v-model.trim="formData.goodsName"
              label="货物名称："
              placeholder="请输入货物名称"
              required
              clearable
            ></van-field>
            <van-field
              v-model.trim="formData.goodsAmount"
              label="货物数量："
              required
              placeholder="请输入货物数量"
            >
              <div slot="right-icon">
                <van-radio-group v-model="formData.goodsAmountType" class="goods-amount-type-box">
                  <van-radio name="0">
                    <div
                      slot="icon"
                      slot-scope="props"
                      class="goods-amount-type-item"
                      :class="props.checked ? 'active' : 'inactive'"
                    >吨</div>
                  </van-radio>
                  <van-radio name="1">
                    <div
                      slot="icon"
                      slot-scope="props"
                      class="goods-amount-type-item"
                      :class="props.checked ? 'active' : 'inactive'"
                    >方</div>
                  </van-radio>
                  <van-radio name="2">
                    <div
                      slot="icon"
                      slot-scope="props"
                      class="goods-amount-type-item"
                      :class="props.checked ? 'active' : 'inactive'"
                    >件</div>
                  </van-radio>
                  <van-radio name="3">
                    <div
                      slot="icon"
                      slot-scope="props"
                      class="goods-amount-type-item"
                      :class="props.checked ? 'active' : 'inactive'"
                    >车</div>
                  </van-radio>
                </van-radio-group>
              </div>
            </van-field>
            <van-field
              v-model="formData.carrierOrgName"
              @click="carrierStart"
              label="外协供应商："
              placeholder="请选择供应商"
              right-icon="arrow"
              readonly
              required
            />
            <van-field
              v-model.trim="formData.userFreight"
              label="运费总额："
              type="number"
              :disabled="
                formData.payState === '2' ||
                  formData.payState === '3' ||
                  formData.payState === '1' ||
                  formData.payState === '6' ||
                  formData.payState === '7'
              "
              required
              clearable
              placeholder="请输入运费总额"
            >
              <div slot="right-icon">元</div>
            </van-field>
            <van-field
              v-model.trim="formData.lossFee"
              label="货损金额："
              type="number"
              :disabled="
                formData.payState === '2' ||
                  formData.payState === '3' ||
                  formData.payState === '1' ||
                  formData.payState === '6' ||
                  formData.payState === '7' ||
                  formData.confirmState === '1'
              "
              clearable
              placeholder="请输入货损金额"
            >
              <div slot="right-icon">元</div>
            </van-field>
          </van-cell-group>
          <div class="gray"></div>
        </div>
      </div>
      <div class="button">
        <van-button type="primary" size="large" @click="SaveData">确认</van-button>
      </div>
      <!-- 外协供应商组件 -->
      <van-popup v-model="carrierShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          :columns="carrierArray"
          @cancel="carrierShow = false"
          @confirm="onConfirmCarrier"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { AppFinish, operateWaybill } from '@/assets/js/app.js';
import {
  modifyWaybillBefore,
  getCarrier,
  checkCommonCity,
  waybillRepeat,
  wxModifyWaybill,
} from '../../api/wayBill';
import { isEmptyStr } from '../../assets/js/utils';

export default {
  name: 'confirm_pay_freight',
  data() {
    return {
      msg: '确认应付运费',
      pageShow: false,
      readOnly: this.$route.query.readOnly === '1',
      showControl: [1, 0],
      carrierArray: [], // 外协供应商集合
      carrierObj: {},
      carrierShow: false, //外协状态
      taxWaybillId: this.$route.query.taxWaybillId,
      category: this.$route.query.category,
      classify: this.$route.query.classify,
      waybillState: this.$route.query.waybillState,
      formData: {
        taxWaybillNo: '',
        goodsName: '',
        goodsAmount: '',
        goodsAmountType: '0',
        userFreight: '',
        lossFee: '',
        carrierOrgName: '', //外协供应商名称
        supplierOrgId: '', //外协供应商ID
        startPlace: '',
        startPlaceCode: [],
        endPlace: '',
        endPlaceCode: [],
        startProvinceId: '',
        startCityId: '',
        startCountyId: '',
        endProvinceId: '',
        endCityId: '',
        endCountyId: '',

        cardBadge: '',
        driverName: '',
        mobile: '',
        cartType: '',
        cartLength: '',
        carTonage: '',
        payState: '',
        confirmState: '', //运输结束确认状态
      },
      moneyReg: /^([1-9]\d{0,6}|0)([\.]\d{0,2})?$/,
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'choose_city') {
        let val = vm.cityDataArray;
        if (val.type === 0) {
          vm.formData.startPlace = val.cityArr;
          vm.formData.startPlaceCode = val.cityIdArr;
        } else if (val.type === 1) {
          vm.formData.endPlace = val.cityArr;
          vm.formData.endPlaceCode = val.cityIdArr;
        }
      }
    });
  },
  computed: {
    ...mapState({
      cityDataArray: state => state.cityData.cityDataArray,
    }),
  },
  mounted() {
    this.dataInit();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
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
          }
          this.pageShow = true;
        })
        .catch(err => {});
    },
    // 外协供应商点击
    carrierStart() {
      return;
      if (this.readOnly) {
        return;
      }
      const loading = this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getCarrier({})
        .then(res => {
          if (res.data.reCode === '0') {
            var data = res.data.result;
            this.carrierObj = data;
            this.carrierArray = [];
            data.forEach(item => {
              this.carrierArray.push(item.carrierOrgShortName);
            });
            if (this.carrierArray.length === 0) {
              return;
            }
            this.carrierShow = true;
          }
        })
        .catch(() => {});
    },
    // 外协供应商确定
    onConfirmCarrier(picker, value, index) {
      this.carrierShow = false;
      this.formData.carrierOrgName = picker;
      this.formData.supplierOrgId = this.carrierObj[value].supplierOrgId;
    },
    goChooseCity(type) {
      this.$router.push({ path: '/choose_city', query: { type: type } });
    },
    // 字段验证信息
    async verify() {
      if (isEmptyStr(this.formData.taxWaybillNo)) {
        this.$toast('运单号不能为空！');
        return;
      } else {
        let regExp = /^[0-9a-zA-Z_-]+$/;
        if (!regExp.test(this.formData.taxWaybillNo)) {
          this.$toast(
            '运单号只接受数字,字母,' + '_' + '与 ' + '-' + ',不接受特殊字符！',
          );
          return;
        }
      }

      if (this.formData.startPlaceCode.length === 0) {
        this.$toast('装货地必填！');
        return;
      }
      if (this.formData.endPlaceCode.length === 0) {
        this.$toast('卸货地必填！');
        return;
      }

      //货物名称
      if (isEmptyStr(this.formData.goodsName)) {
        this.$toast('货物名称必填！');
        return;
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

      if (this.formData.carrierOrgName == '') {
        this.$toast('外协供应商必填！');
        return;
      }

      // 运费总额
      if (this.formData.userFreight == '') {
        this.$toast('运费金额必填！');
        return;
      } else {
        if (!this.moneyReg.test(this.formData.userFreight)) {
          this.$toast('运费金额输入不合法！');
          return;
        }
      }
      // 货损金额
      if (!isEmptyStr(this.formData.lossFee)) {
        if (!this.moneyReg.test(this.formData.lossFee)) {
          this.$toast('货损金额输入不合法！');
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
                  resolve(res.data.reCode);
                  this.$toast(res.data.reInfo);
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
    // 确认按钮
    async SaveData() {
      if ((await this.verify()) == '1') {
        this.formData = Object.assign(this.formData, {
          lossFee: isEmptyStr(this.formData.lossFee)
            ? '0.00'
            : this.formData.lossFee,
        });
        wxModifyWaybill(this.formData)
          .then(res => {
            this.$toast(res.data.reInfo);
            if (res.data.reCode === '0') {
              let json = {
                type: '2',
                taxWaybillId: this.taxWaybillId,
                waybillState: this.waybillState,
                refreshList: [],
                content: {
                  taxWaybillNo: this.formData.taxWaybillNo,
                  startPlace: this.formData.startPlace,
                  endPlace: this.formData.endPlace,
                  goodsName: this.formData.goodsName,
                  goodsAmount: this.formData.goodsAmount,
                  goodsAmountType: this.formData.taxWaygoodsAmountTypebillNo,
                  userFreight: this.formData.userFreight,
                  lossFee: isEmptyStr(this.formData.lossFee)
                    ? '0.00'
                    : this.formData.lossFee,
                },
              };
              operateWaybill(json);
              setTimeout(() => {
                this.onClickLeft();
              }, 500);
            }
          })
          .catch(err => {
            this.$toast(err.message);
          });
      }
    },
    // 展开or折叠
    showOrHide(type) {
      if (this.showControl[type]) {
        this.$set(this.showControl, type, 0);
      } else {
        this.$set(this.showControl, type, 1);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.confirm_pay_freight {
  background: #ffffff;
  .card_group {
    width: 100%;
    position: relative;
    &:before {
      content: ' ';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 1px;
      border-top: 1px solid #d9d9d9;
      color: #d9d9d9;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
    }
    .show-or-hide {
      .img-icon {
        transition: transform 0.3s, -webkit-transform 0.3s;
      }
      .shouQi {
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-45deg);
      }
      .zhanKai {
        transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-225deg);
      }
    }
    .slide {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
    }
    .animate {
      max-height: 9999px;
      transition: max-height 1s cubic-bezier(0, 1, 0, 1) -0.1s;
      transition-delay: 0s;
    }
    .header_cell_title {
      color: #121212;
      font-weight: bold;
    }
    // 吨方件车
    .goods-amount-type-box {
      display: flex;
      .goods-amount-type-item {
        font-size: 15px;
        background: #bebebe;
        padding: 0 2px;
        margin: 0 2px;
        border-radius: 6px;
        color: #fff;
        &.active {
          background: #1581cf;
        }
      }
    }
  }
  .button {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    .van-button {
      display: inherit;
      margin: 10px auto 60px;
      border-radius: 5px;
      width: 90%;
    }
  }
}
</style>
