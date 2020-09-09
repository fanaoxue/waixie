<template>
  <div class="waybill_information_container">
    <c-header>
      <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model.trim="formData.taxWaybillNo"
            label="运单号："
            placeholder="请输入运单号"
            :required="peizhiObj.waybillNoCfg == 1"
            :disabled="readOnly"
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
            :disabled="readOnly"
          />
          <van-field
            v-model="formData.endPlace"
            label="卸货地："
            placeholder="请选择卸货地"
            :right-icon="readOnly ? '' : 'arrow'"
            @click="goChooseCity(1)"
            required
            readonly
            :disabled="readOnly"
          />
          <van-field
            v-model.trim="formData.goodsName"
            label="货物名称："
            placeholder="请输入货物名称"
            :disabled="permission.orgCfg718=== '49' && isFromH5 === '1' ? false : readOnly"
            required
            clearable
          />
          <van-field
            v-model.trim="formData.goodsAmount"
            label="货物数量："
            type="number"
            placeholder="请输入货物数量"
            :disabled="permission.orgCfg718=== '49' && isFromH5 === '1' ? false : readOnly"
            required
            clearable
          >
            <div slot="right-icon">
              <van-radio-group
                v-model="formData.goodsAmountType"
                class="goods-amount-type-box"
                :disabled="permission.orgCfg718=== '49' && isFromH5 === '1'  ? false : readOnly"
              >
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
            v-if="pagetype === '1'"
            v-model="formData.supplierOrgName"
            @click="carrierStart"
            label="外协供应商："
            placeholder="请选择供应商"
            :right-icon="readOnly ? '' : 'arrow'"
            readonly
            required
          />
          <van-field
            v-if="pagetype === '1'"
            v-model.trim="formData.allFreight"
            label="运费总额："
            placeholder="请输入运费总额"
            type="number"
            :disabled="readOnly"
            required
            clearable
          >
            <div slot="right-icon">元</div>
          </van-field>
          <van-field
            v-if="pagetype === '1' && peizhiObj.loginState == '0'"
            v-model.trim="formData.drawee"
            label="受票方："
            @click="draweeStart"
            placeholder="请选择受票方"
            :right-icon="readOnly ? '' : 'arrow'"
            required
            readonly
            clearable
          />
          <van-field
            v-model.trim="formData.upUserFreight"
            label="应收运费："
            placeholder="请输入应收运费"
            type="number"
            :disabled="permission.orgCfg718=== '49' && isFromH5 === '1'  ? true : readOnly"
            v-show="pagetype == '0'"
            clearable
          />
          <van-field
            v-model="formData.startTime"
            label="起运时间："
            @click="timeStart1"
            placeholder="请选择起运时间"
            right-icon="arrow"
            v-show="pagetype != '1'"
            readonly
          />
          <van-field
            v-model="formData.arrivePlaceTime"
            label="到场时间："
            @click="timeStart2"
            placeholder="请选择到场时间"
            :right-icon="readOnly ? '' : 'arrow'"
            readonly
            v-show="permission.orgCfg718=== '49' && isFromH5 === '1'  ? false :true"
            :disabled="readOnly"
          />
          <van-field
            v-model.trim="formData.tranRequire"
            label="运输要求："
            placeholder="请填写运输要求"
            :disabled="permission.orgCfg718=== '49' && isFromH5 === '1'  ? false : readOnly"
            type="textarea"
            maxlength="60"
            rows="3"
            autosize
            show-word-limit
            clearable
          />
        </van-cell-group>
        <div class="gray"></div>
      </div>
      <div class="footer">
        <van-button
          type="primary"
          size="large"
          @click="gotoWriteCarInformation"
          :disabled="!btnDisabled"
        >{{ btnText }}</van-button>
      </div>
    </div>

    <!-- 起运时间组件 -->
    <van-popup v-model="startTimeShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        @confirm="confirmDate1"
        @cancel="startTimeShow = false"
        :formatter="formatter"
      />
    </van-popup>

    <!-- 到场时间组件 -->
    <van-popup v-model="arrivePlaceTimeShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="datetime"
        :min-date="minDate"
        @confirm="confirmDate2"
        @cancel="arrivePlaceTimeShow = false"
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
        :default-index="carrierDefaultIndex"
        show-toolbar
        :columns="carrierArray"
        @cancel="carrierShow = false"
        @confirm="onConfirmCarrier"
      />
    </van-popup>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import {
  queryWaybillBefore,
  modifyWaybillBefore,
  qeuryWaybillNo,
  getDrawee,
  getCarrier,
  checkCommonCity,
  waybillRepeat,
  deliverWaybill,
  getDebangDetail,
} from '../../api/wayBill';
import { templateDetail } from '../../api/template';
import { isEmptyStr, getTimeFormat } from '../../assets/js/utils';
import { AppFinish } from '../../assets/js/app';
export default {
  name: 'waybill_information',
  data() {
    return {
      isFromH5: this.$route.query.isFromH5, //0 否 是
      pagetype: this.$route.query.pagetype || '1', //0 派车，1 派单
      mWaybillTemplateId: this.$route.query.mWaybillTemplateId, //模板ID
      taxWaybillId: this.$route.query.taxWaybillId,
      xid: '',
      readOnly: this.$route.query.pagetype === '0',
      btnDisabled: false, // 确认派单按钮默认不可点
      title: '运单信息',
      btnText: '下一步',
      startTimeShow: false, // 起运时间
      arrivePlaceTimeShow: false, // 时间状态
      draweeShow: false, // 受票方状态
      carrierShow: false, //外协状态
      currentDate: new Date(),
      minDate: new Date(),
      draweeArray: [], // 受票方集合
      draweeObj: {},
      draweeDefaultIndex: 0,
      carrierArray: [], // 外协供应商集合
      carrierObj: {},
      carrierDefaultIndex: 0,
      formData: {
        tranRequire: '',
        note: '',
        startPlace: '',
        startPlaceCode: [],
        endPlace: '',
        endPlaceCode: [],
        goodsName: '',
        goodsAmount: '',
        goodsAmountType: '0',
        drawee: '', // 受票方名称
        taxDraweePartyId: '', //受票方ID
        supplierOrgName: '', //外协供应商名称
        supplierOrgId: '', //外协供应商ID
        taxWaybillNo: '', // 运单号
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
      },
      // 所有配置
      peizhiObj: {
        businessItems: '', // 业务项目配置
        createWaybillCfg: '', // 新建运单配置
        waybillNoCfg: '', //运单号配置
        loginState: '', //企业类型
        billCycleMode: '', //结算周期模式
        oilCardCfg: '', //油卡权限
        report003Cfg: '', //经营会计报表配置
        drawee: '', // 受票方名称
        taxDraweePartyId: '',
      },
      cityObject: {},
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'choose_city') {
        let val = vm.cityDataArray;
        console.log(val);
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
  activated() {
    this.cityObject = this.cityDataArray;
  },
  computed: {
    ...mapState({
      cityDataArray: state => state.cityData.cityDataArray,
    }),
    ...mapGetters(['permission']),
    ...mapGetters({ goodsIdList: 'goodsSupply/goodsIdList' }),
  },
  created() {
    this.pagetype == '1' ? (this.btnText = '确认派单') : '下一步';
    this.title =
      this.permission.orgCfg718 === '49' && this.isFromH5 === '1'
        ? '货源信息'
        : this.title;
  },
  mounted() {
    let date = new Date();
    this.formData.arrivePlaceTime =
      this.permission.orgCfg718 === '49' ? '' : getTimeFormat(date);
    this.formData.startTime =
      this.permission.orgCfg718 === '49' ? '' : getTimeFormat(date);
    this.$nextTick(() => {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      queryWaybillBefore({})
        .then(res => {
          if (res.data.reCode === '0') {
            this.peizhiObj = Object.assign(this.peizhiObj, res.data.result);
            if (!isEmptyStr(this.peizhiObj.drawee)) {
              this.formData.drawee = this.peizhiObj.drawee;
              this.formData.taxDraweePartyId = this.peizhiObj.taxDraweePartyId;
            }
            this.qeuryWaybillNo().then(() => {
              if (this.pagetype == '0') {
                if (
                  this.permission.orgCfg718 === '49' &&
                  this.isFromH5 === '1'
                ) {
                  // 取德邦外协选择的各种值
                  this._getDebangDetail();
                } else {
                  this.modifyWaybillBefore();
                }
              } else {
                this.templateDetail();
              }
            });
          }
        })
        .catch(err => {
          this.$toast(err.message);
        });
    });
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      if (this.pagetype === '1') {
        // 派单
        this.$router.go(-1);
      } else {
        if (this.isFromH5 === '1' && this.permission.orgCfg718 === '49') {
          this.$router.go(-1);
        } else {
          AppFinish(-1);
        }
      }
    },
    // 走3017接口查运单信息
    modifyWaybillBefore() {
      return new Promise((resolve, reject) => {
        if (!isEmptyStr(this.taxWaybillId)) {
          this.$toast.loading({
            duration: 0,
            message: '加载中',
            forbidClick: true,
          });
          modifyWaybillBefore({ taxWaybillId: this.taxWaybillId })
            .then(res => {
              if (res.data.reCode === '0') {
                resolve('1');
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
                this.xid = result.xid;
              } else {
                this.$toast(res.data.reInfo);
              }
              this.btnDisabled = true;
            })
            .catch(err => {
              this.$toast(err.message);
              reject('0');
            });
        } else {
          this.btnDisabled = true;
        }
      });
    },
    // 根据模板ID查询模板信息
    templateDetail() {
      return new Promise((resolve, reject) => {
        if (!isEmptyStr(this.mWaybillTemplateId)) {
          this.$toast.loading({
            duration: 0,
            message: '加载中',
            forbidClick: true,
          });
          templateDetail({
            mWaybillTemplateId: this.mWaybillTemplateId,
          })
            .then(res => {
              resolve('1');
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
              this.queryCarrier();
            })
            .catch(() => {
              reject('0');
            });
        } else {
          this.queryCarrier();
          resolve('1');
        }
      });
    },
    // 开通德邦外协，查询货源单信息
    _getDebangDetail() {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        getDebangDetail({ goodsId: this.goodsIdList })
          .then(res => {
            if (res.data.reCode === '0') {
              resolve('1');
              let result = res.data.result;
              Object.assign(this.formData, result);
              this.formData.startPlaceCode.push(
                result.startProvinceId,
                result.startCityId,
                result.startCountyId || '',
              );
              this.formData.endPlaceCode.push(
                result.endProvinceId,
                result.endCityId,
                result.endCountyId || '',
              );
              this.formData.startPlace = result.startCountyName
                ? result.startProvinceName +
                  ' ' +
                  result.startCityName +
                  ' ' +
                  result.startCountyName
                : result.startProvinceName + ' ' + result.startCityName;

              this.formData.endPlace = result.endCountyName
                ? result.endProvinceName +
                  ' ' +
                  result.endCityName +
                  ' ' +
                  result.endCountyName
                : result.endProvinceName + ' ' + result.endCityName;
              this.formData.upUserFreight = result.updwFreight;
              this.formData.goodsAmount = result.goodsAmount;
              this.formData.goodsAmountType = result.goodsAmountType || '0';
              this.xid = result.xid;
            } else {
              this.$toast(res.data.reInfo);
            }
            this.btnDisabled = true;
          })
          .catch(err => {
            this.$toast(err.message);
            reject('0');
          });
      });
    },
    // 根据运单号配置查询运单号
    qeuryWaybillNo() {
      return new Promise((resolve, reject) => {
        if (this.peizhiObj.waybillNoCfg != 1) {
          this.$toast.loading({
            duration: 0,
            message: '加载中',
            forbidClick: true,
          });
          qeuryWaybillNo({})
            .then(resp => {
              if (resp.data.reCode === '0') {
                let result = resp.data.result;
                if (isEmptyStr(result)) {
                  this.formData.taxWaybillNo = '';
                } else {
                  this.formData.taxWaybillNo = result;
                }
              }
              resolve('1');
            })
            .catch(() => {
              reject('0');
            });
        } else {
          resolve('1');
        }
      });
    },
    // 字段验证信息
    async verify() {
      if (this.peizhiObj.waybillNoCfg === '1') {
        if (isEmptyStr(this.formData.taxWaybillNo)) {
          this.$toast('运单号不能为空,请输入运单号！');
          return;
        }
        if (
          !isEmptyStr(this.formData.taxWaybillNo) &&
          !/^[0-9a-zA-Z_-]+$/.test(this.formData.taxWaybillNo)
        ) {
          this.$toast(
            '运单号只接受数字,字母,' + '_' + '与 ' + '-' + ',不接受特殊字符',
          );
          return;
        }
      } else {
        if (
          !isEmptyStr(this.formData.taxWaybillNo) &&
          !/^[0-9a-zA-Z_-]+$/.test(this.formData.taxWaybillNo)
        ) {
          this.$toast(
            '运单号只接受数字,字母,' + '_' + '与 ' + '-' + ',不接受特殊字符',
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
        if (Number(this.formData.goodsAmount) <= 0) {
          this.$toast('无效的货物数量！');
          return;
        }
      } else {
        this.$toast('货物数量必填！');
        return;
      }
      if (this.pagetype == '1') {
        if (this.formData.supplierOrgName == '') {
          this.$toast('外协供应商必填！');
          return;
        }
        if (this.formData.allFreight == '') {
          this.$toast('运费金额必填！');
          return;
        }
        if (this.peizhiObj.loginState == 0 && this.formData.drawee == '') {
          this.$toast('受票方必填！');
          return;
        }
      } else {
        if (this.formData.userFreight == '') {
          this.$toast('应收运费金额必填！');
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
    async gotoWriteCarInformation() {
      if (this.pagetype == '1') {
        if ((await this.verify()) == '1') {
          let json = {
            arrivePlaceTime:
              this.formData.arrivePlaceTime.split(':').length == '3'
                ? this.formData.arrivePlaceTime
                : this.formData.arrivePlaceTime + ':00',
            startTime: '',
            wbBusinessType: '1',
            wbMode: '2',
            extassistType: '1', // 通用外协
            updwOrgid: this.formData.supplierOrgId,
            note: this.formData.tranRequire,
          };
          if (this.permission.orgCfg718 === '49') {
            json.arrivePlaceTime = getTimeFormat(new Date()) + ':00';
          }
          this.formData = Object.assign(this.formData, json);
          console.log(this.formData);
          this.btnDisabled = false;
          deliverWaybill(this.formData).then(res => {
            if (res.data.reCode === '0') {
              this.$store.dispatch(
                'buildWaybill/set_waybill_information',
                this.formData,
              );
              this.$router.push({
                path: '/deliver_waybill_success',
                query: { id: this.id },
              });
            }
            this.btnDisabled = true;
          });
        }
      } else {
        //德邦外协需要验证相关信息
        if (this.permission.orgCfg718 === '49') {
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
            if (Number(this.formData.goodsAmount) <= 0) {
              this.$toast('无效的货物数量！');
              return;
            }
          } else {
            this.$toast('货物数量必填！');
            return;
          }
        }
        this.$store.dispatch(
          'buildWaybill/set_waybill_information',
          this.formData,
        );
        this.$router.push({
          path: '/write_car_information',
          query: {
            taxWaybillId: this.taxWaybillId,
            xid: this.xid,
            isFromH5: this.isFromH5,
          },
        });
      }
    },
    // 起运时间点击事件
    timeStart1() {
      this.startTimeShow = true;
    },
    // 到场时间点击事件
    timeStart2() {
      if (this.readOnly) {
        return;
      }
      this.arrivePlaceTimeShow = true;
    },
    // 选定起运时间
    confirmDate1(value) {
      this.startTimeShow = false;
      this.formData.startTime = getTimeFormat(value, 's');
    },
    // 选定到场时间
    confirmDate2(value) {
      this.arrivePlaceTimeShow = false;
      this.formData.arrivePlaceTime = getTimeFormat(value, 's');
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
    draweeStart() {
      if (this.readOnly) {
        return;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getDrawee({}).then(res => {
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
          }else{
            this.$toast(res.data.reInfo);
          }
        }
        this.draweeShow = true;
      }).catch(() => {});
    },
    // 受票方确定
    onConfirmDrawee(picker, value) {
      this.draweeShow = false;
      this.formData.drawee = picker;
      this.formData.taxDraweePartyId = this.draweeObj[value].taxDraweePartyId;
    },
    queryCarrier() {
      this.$toast.loading({
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
            // 如果是派单时，只有一个供应商，就取第一个
            if (
              isEmptyStr(this.formData.supplierOrgName) &&
              this.carrierObj.length == '1'
            ) {
              this.formData.supplierOrgName = this.carrierArray[0];
              this.formData.supplierOrgId = this.carrierObj[0].supplierOrgId;
            }
          }
          this.btnDisabled = true;
        })
        .catch(() => {});
    },
    // 外协供应商点击
    carrierStart() {
      if (this.readOnly) {
        return;
      }
      // 定位
      if (this.formData.supplierOrgName) {
        this.carrierArray.forEach((item, index) => {
          if (this.formData.supplierOrgName === item) {
            this.carrierDefaultIndex = index;
          }
        });
      }
      this.carrierShow = true;
    },
    // 外协供应商确定
    onConfirmCarrier(picker, value) {
      this.carrierShow = false;
      this.formData.supplierOrgName = picker;
      this.formData.supplierOrgId = this.carrierObj[value].supplierOrgId;
    },
    goChooseCity(type) {
      if (this.readOnly) {
        return;
      }
      this.$router.push({ path: '/choose_city', query: { type: type } });
    },
  },
};
</script>
<style lang="less" scoped>
.waybill_information_container {
  background: #ffffff;
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    // .content {
    //   flex: 1;
    // }
    .footer {
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
      // margin-bottom: 28px;
      margin-top: 50px;
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
    // 趟次样式
    .tangci {
      display: flex;
      .van-radio {
        margin-left: 10px;
        .input-sty {
          -webkit-appearance: none;
          width: 5em;
          margin-left: 2em;
          border-radius: 3px;
          text-indent: 2px;
          border: 0;
          font-size: 16px;
          background: #f6f6f6;
          border: 1px solid #dfdfdf;
          height: 1.5em;
          outline: none;
        }
      }
    }
  }
}
</style>
