<template>
  <div class="business_modify_waybill">
    <c-header isShowTitle class="header">
      <van-nav-bar title="修改运单" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
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
              :readonly="readOnly"
              required
              clearable
            />
            <van-field
              v-model="formData.startPlace"
              label="装货地："
              placeholder="请选择装货地"
              :right-icon="readOnly ? '' : 'arrow'"
              @click="goChooseCity(0)"
              required
              readonly
            />
            <van-field
              v-model="formData.endPlace"
              label="卸货地："
              placeholder="请选择卸货地"
              :right-icon="readOnly ? '' : 'arrow'"
              @click="goChooseCity(1)"
              required
              readonly
            />
            <van-field
              v-model.trim="formData.goodsName"
              label="货物名称："
              placeholder="请输入货物名称"
              :readonly="readOnly"
              required
              clearable
            />
            <van-field
              v-model.trim="formData.goodsAmount"
              label="货物数量："
              type="number"
              placeholder="请输入货物数量"
              :readonly="readOnly"
              required
              clearable
            >
              <div slot="right-icon" v-if="!readOnly">
                <van-radio-group class="goods-amount-type-box" v-model="formData.goodsAmountType">
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
              :right-icon="readOnly ? '' : 'arrow'"
              readonly
              required
              clearable
            />
            <van-field
              v-model.trim="formData.userFreight"
              label="运费总额："
              placeholder="请输入运费总额"
              :readonly="readOnly"
              :disabled="
                formData.payState === '2' ||
                  formData.payState === '3' ||
                  formData.payState === '1' ||
                  formData.payState === '6' ||
                  formData.payState === '7'
              "
              required
              clearable
            >
              <div slot="right-icon">元</div>
            </van-field>
            <van-field
              v-model.trim="formData.freightIncr"
              type="number"
              label="运费增补："
              placeholder="请输入运费增补"
              :disabled="
                formData.payState === '2' ||
                  formData.payState === '3' ||
                  formData.payState === '1' ||
                  formData.payState === '6' ||
                  formData.payState === '7' ||
                  formData.confirmState === '1'
              "
              clearable
            >
              <div slot="right-icon">元</div>
            </van-field>
            <van-field
              v-model.trim="formData.lossFee"
              type="number"
              label="货损金额："
              placeholder="请输入货损金额"
              :disabled="
                formData.payState === '2' ||
                  formData.payState === '3' ||
                  formData.payState === '1' ||
                  formData.payState === '6' ||
                  formData.payState === '7' ||
                  formData.confirmState === '1'
              "
              clearable
            >
              <div slot="right-icon">元</div>
            </van-field>
            <van-field
              v-model="formData.drawee"
              v-show="formData.loginState == '0'"
              label="受票方："
              @click="draweeStart"
              placeholder="请选择受票方"
              :right-icon="readOnly ? '' : 'arrow'"
              :required="formData.loginState == '0'"
              readonly
              clearable
            />
            <van-field
              v-model="formData.arrivePlaceTime"
              label="到场时间："
              @click="timeStart"
              placeholder="请选择到场时间"
              :right-icon="readOnly ? '' : 'arrow'"
              readonly
              clearable
            />
            <van-field
              v-model.trim="formData.tranRequire"
              label="运输要求："
              placeholder="请填写运输要求，系统将同步告知司机！"
              :readonly="readOnly"
              type="textarea"
              maxlength="60"
              rows="3"
              autosize
              show-word-limit
              clearable
            />
          </van-cell-group>
        </div>
      </div>
      <div class="card_group" v-show="formData.cartBadgeNo">
        <van-cell title="承运信息" @click.native="showOrHide(1)" class="header_cell_title">
          <div slot="default" class="show-or-hide">
            <img
              src="../../assets/imgs/shouqi_icon@2x.png"
              alt
              width="16"
              height="12"
              class="img-icon"
              :class="{
                shouQi: showControl[0] === 0,
                zhanKai: showControl[1] === 1
              }"
            />
          </div>
        </van-cell>
        <div class="slide" :class="{ animate: showControl[1] === 1 }">
          <van-cell-group>
            <van-field
              v-model="formData.cartBadgeNo"
              label="车牌号码："
              placeholder="请输入车牌号码"
              readonly
              required
              @click="carNumIpt"
            />
            <van-field
              v-model="formData.driverName"
              label="司机姓名："
              placeholder="请输入司机姓名"
              prop="driverName"
              readonly
              clearable
            />
            <van-field
              v-model="formData.mobileNo"
              label="司机手机："
              placeholder="请输入司机手机"
              prop="mobileNo"
              readonly
              clearable
            />
            <van-field
              v-model="formData.cartType"
              label="车型："
              placeholder="请输入车型"
              right-icon="arrow"
              readonly
              required
              @click="showCartTypeActions"
            />
            <van-field
              v-model="formData.cartLength"
              label="车长（米）："
              placeholder="请输入车长"
              right-icon="arrow"
              readonly
              required
              @click="showCartLength"
            />
            <van-field
              v-model="formData.cartTonnage"
              label="吨位（吨）："
              placeholder="请输入吨位"
              right-icon="arrow"
              readonly
              required
              @click="showCartTonnage"
            />
          </van-cell-group>
        </div>
      </div>
      <div class="footer" style="height:90px;"></div>
      <div class="button">
        <van-button type="primary" size="large" @click="SaveData">保存</van-button>
      </div>

      <!-- 到场时间组件 -->
      <van-popup v-model="timeShow" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="datetime"
          :min-date="minDate"
          @confirm="confirmDate"
          @cancel="timeShow = false"
          :formatter="formatter"
        />
      </van-popup>

      <!-- 受票方组件 -->
      <van-popup v-model="draweeShow" position="bottom" :overlay="true">
        <van-picker
          :default-index="draweeDefaultIndex"
          show-toolbar
          :columns="draweeArray"
          @cancel="draweeShow = false"
          @confirm="onConfirmDrawee"
        />
      </van-popup>

      <!-- 外协供应商组件 -->
      <van-popup v-model="carrierShow" position="bottom" :overlay="true">
        <van-picker
          show-toolbar
          :columns="carrierArray"
          @cancel="carrierShow = false"
          @confirm="onConfirmCarrier"
        />
      </van-popup>
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
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import selecPopup from '@/components/selecPopup';
import { dateFormat } from '@/common/filters';
import { AppFinish, operateWaybill } from '@/assets/js/app.js';
import { getCompanyConfig } from '../../api/externalassistanceapi';
import {
  modifyWaybillBefore,
  getDrawee,
  getCarrier,
  checkCommonCity,
  waybillRepeat,
  wxModifyWaybill,
} from '../../api/wayBill';
import { isEmptyStr, resolveObj } from '../../assets/js/utils';
export default {
  name: 'business_modify_waybill',
  components: {
    selecPopup,
  },
  data() {
    return {
      msg: '企业端-修改运单',
      xingxing: require('../../assets/imgs/bitian_icon@2x.png'),
      taxWaybillId: this.$route.query.taxWaybillId, //运单ID
      category: this.$route.query.category,
      classify: this.$route.query.classify,
      waybillState: this.$route.query.waybillState,
      isFromH5: this.$route.query.isFromH5, // 1 是从H5进来的
      readOnly: this.$route.query.readOnly === '1',
      timeShow: false,
      draweeShow: false,
      carrierShow: false,
      currentDate: new Date(),
      minDate: new Date(),
      draweeArray: [], // 受票方集合
      carrierArray: [], // 外协供应商集合
      draweeObj: {},
      carrierObj: {},
      draweeDefaultIndex: 0,
      cartLengthShow: false,
      cartTonnageShow: false,
      moreCartTypeShow: false,
      cartTypeActionsShow: false,
      cartTypeActions: [
        { name: '厢式' },
        { name: '半挂' },
        { name: '高低板' },
        { name: '更多>>', fn: 'showMoreCartType' },
      ],
      cartTypeList: [
        //更多车型
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
      cartLengthList: [
        { type: '4.2米' },
        { type: '6.8米' },
        { type: '8.7米' },
        { type: '9.6米' },
        { type: '13米' },
        { type: '17.5米' },
      ],
      cartTonnageList: [
        { type: '8吨' },
        { type: '15吨' },
        { type: '20吨' },
        { type: '25吨' },
        { type: '30吨' },
        { type: '35吨' },
      ],
      formData: {
        startPlace: '',
        startPlaceCode: [],
        endPlace: '',
        endPlaceCode: [],
        goodsAmount: '',
        goodsAmountType: '0',
        drawee: '', // 受票方名称
        taxDraweePartyId: '', //受票方ID
        carrierOrgName: '', //外协供应商名称
        carrierOrgId: '', //外协供应商ID
        taxWaybillNo: '', // 运单号
        arrivePlaceTime: '', // 到场时间
        goodsName: '',
        allFreight: '',
        freightIncr: '',
        lossFee: '',
        shouldReceive: '',
        cartBadgeNo: '',
        driverName: '',
        mobileNo: '',
        cartType: '',
        cartLength: '',
        cartTonnage: '',
        tranRequire: '',
        userFreight: '',
        startProvinceId: '',
        startCityId: '',
        startCountyId: '',
        endProvinceId: '',
        endCityId: '',
        endCountyId: '',
        payState: '',
        confirmState: '', //运输结束确认状态
      },
      showControl: [1, 1],
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
    ...mapGetters(['permission']),
  },
  mounted() {
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
      })
      .catch(err => {});
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
    // 展开or折叠
    showOrHide(type) {
      if (this.showControl[type]) {
        this.$set(this.showControl, type, 0);
      } else {
        this.$set(this.showControl, type, 1);
      }
    },
    draweeStart() {
      if (this.readOnly) {
        return;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getDrawee({})
        .then(res => {
          var data = res.data.result;
          if(data.length > 0){
            if (res.data.reCode === '0') {
              this.draweeObj = data;
              this.draweeArray = [];
              data.forEach(item => {
                this.draweeArray.push(item.drawee);
              });
              // 定位
              if (this.formData.drawee) {
                this.draweeArray.forEach((item, index) => {
                  if (this.formData.drawee === item) {
                    this.draweeDefaultIndex = index;
                  }
                });
              }
              this.draweeShow = true;
            }
          }
        })
        .catch(err => {});
    },
    // 受票方确定
    onConfirmDrawee(picker, value, index) {
      this.draweeShow = false;
      this.formData.drawee = picker;
      this.formData.taxDraweePartyId = this.draweeObj[value].taxDraweePartyId;
    },
    // 外协供应商点击
    carrierStart() {
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
            this.carrierShow = true;
          }
        })
        .catch(err => {});
    },
    // 外协供应商确定
    onConfirmCarrier(picker, value, index) {
      this.carrierShow = false;
      this.formData.carrierOrgName = picker;
      this.formData.carrierOrgId = this.carrierObj[value].carrierOrgId;
    },
    goChooseCity(type) {
      this.$router.push({ path: '/choose_city', query: { type: type } });
    },
    // 到场时间点击事件
    timeStart() {
      if (this.readOnly) {
        return;
      }
      this.timeShow = true;
    },
    // 选定时间
    confirmDate(value) {
      this.timeShow = false;
      let year = value.getFullYear();
      let month = value.getMonth() + 1;
      let day = value.getDate();
      let hour = value.getHours();
      let minute = value.getMinutes();
      let second = value.getSeconds();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      if (second < 10) {
        second = '0' + second;
      }
      this.formData.arrivePlaceTime =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second;
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
    // 输入车牌
    carNumIpt() {
      if (
        this.waybillState == '1' ||
        this.waybillState == '2' ||
        this.waybillState == '3'
      ) {
        return;
      }
      let _this = this;
      this.$carIpt({
        dpCartNum: this.formData.cartBadgeNo,
        fn: function(res) {
          _this.formData.cartBadgeNo = res;
        },
      });
    },
    onSelectCartType(item) {
      // 默认情况下，点击选项时不会自动关闭菜单
      // 可以通过 close-on-click-action 属性开启自动关闭
      if (item.fn) {
        this[item.fn]();
      } else {
        this.formData.cartType = item.name;
      }
    },
    // 展示选择车型
    showCartTypeActions() {
      if (
        this.waybillState == '1' ||
        this.waybillState == '2' ||
        this.waybillState == '3'
      ) {
        return;
      }
      this.cartTypeActionsShow = true;
    },
    // 展示更多车型
    showMoreCartType() {
      this.moreCartTypeShow = true;
    },
    // 展示选择车长
    showCartLength() {
      if (
        this.waybillState == '1' ||
        this.waybillState == '2' ||
        this.waybillState == '3'
      ) {
        return;
      }
      this.cartLengthShow = true;
    },
    // 展示选择吨位
    showCartTonnage() {
      if (
        this.waybillState == '1' ||
        this.waybillState == '2' ||
        this.waybillState == '3'
      ) {
        return;
      }
      this.cartTonnageShow = true;
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
      if (this.formData.loginState == 0 && this.formData.drawee == '') {
        this.$toast('受票方必填！');
        return;
      }
      if (this.formData.userFreight == '') {
        this.$toast('运费总额必填！');
        return;
      } else {
        if (!this.moneyReg.test(this.formData.userFreight)) {
          this.$toast('运费总额输入不合法！');
          return;
        }
      }

      //运费增补
      if (!isEmptyStr(this.formData.freightIncr)) {
        if (!this.moneyReg.test(this.formData.freightIncr)) {
          this.$toast('无效的运费增补金额！');
          return false;
        }
      }

      //货损金额
      if (!isEmptyStr(this.formData.lossFee)) {
        if (!this.moneyReg.test(this.formData.lossFee)) {
          this.$toast('无效的运费扣减金额！');
          return false;
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
            reject(err.message);
          });
      });
    },
    // 保存
    async SaveData() {
      if ((await this.verify()) == 1) {
        let json = {
          wbBusinessType: '1',
          wbMode: '2',
          updwOrgid: this.formData.carrierOrgId,
          arrivePlaceTime: !isEmptyStr(this.formData.arrivePlaceTime)
            ? this.formData.arrivePlaceTime.split(':').length == '3'
              ? this.formData.arrivePlaceTime
              : this.formData.arrivePlaceTime + ':00'
            : '',
          transTrip: '',
          cartLength: parseFloat(this.formData.cartLength), //车长
          cartTonnage: parseFloat(this.formData.cartTonnage), //吨位
          freightIncr: isEmptyStr(this.formData.freightIncr)
            ? '0.00'
            : this.formData.freightIncr,
          lossFee: isEmptyStr(this.formData.lossFee)
            ? '0.00'
            : this.formData.lossFee,
        };
        let jsonData = Object.assign(this.formData, json);
        wxModifyWaybill(jsonData)
          .then(res => {
            this.$toast(res.data.reInfo);
            if (res.data.reCode === '0') {
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
                    category: this.category,
                    classify: this.classify,
                    waybillState: this.waybillState,
                  },
                });
              }, 500);
            }
          })
          .catch(err => {
            this.$toast(err.message);
          });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.business_modify_waybill {
  .card_group {
    background: #ffffff;
    width: 100%;
    margin-top: 10px;
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
        border-radius: 4px;
        color: #fff;
        &.active {
          background: #1581cf;
        }
      }
    }
  }
  .button {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background: #ffffff;
    z-index: 10;
    .van-button {
      display: inherit;
      margin: 10px auto;
      border-radius: 5px;
      width: 90%;
    }
  }
}
</style>
