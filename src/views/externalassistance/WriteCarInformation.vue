<template>
  <div class="write_car_information_container">
    <c-header>
      <van-nav-bar title="填写承运信息" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <!-- <div class="gray"></div> -->
      <div class="title">
        <span>
          <i class="iconfont icongantanhao"></i>
          为保证运输协议规范有效，请务必准确填写司机手机号和司机姓名。协议生成后不可修改！！
        </span>
      </div>
      <div class="gray"></div>
      <div class="content">
        <div class="top">
          <span class="icon">*</span>
          <span class="text">请手动填写承运信息或从</span>
          <div class="btn" @click="chooseMyFleet()">我的车队选择</div>
        </div>
        <div class="group">
          <van-cell-group>
            <van-field
              v-model="formData.mobileNo"
              label="司机手机："
              placeholder="请输入司机手机"
              type="tel"
              clearable
              required
              @blur="phoneGetName"
            />
            <van-field
              v-model="formData.driverName"
              label="司机姓名："
              placeholder="请输入司机姓名"
              clearable
              required
              :disabled="nameDisabled"
            />
            <van-field
              v-model="formData.cartBadgeNo"
              label="车牌号码："
              placeholder="请输入车牌号码"
              :right-icon="'arrow'"
              readonly
              required
              @click="carNumIpt"
            />
            <van-field
              v-model="formData.cartType"
              label="车型："
              placeholder="请选择车型"
              right-icon="arrow"
              readonly
              required
              @click="showCartTypeActions"
            />
            <van-field
              v-model="formData.cartLength"
              label="车长(米)："
              placeholder="请选择车长"
              right-icon="arrow"
              readonly
              required
              @click="showCartLength"
            />
            <van-field
              v-model="formData.cartTonnage"
              label="吨位(吨)："
              placeholder="请选择吨位"
              right-icon="arrow"
              readonly
              required
              @click="showCartTonnage"
            />
            <van-field
              v-model="formData.note"
              label="备注："
              placeholder="请输入备注"
              type="textarea"
              maxlength="64"
              rows="3"
              autosize
              show-word-limit
              clearable
            />
          </van-cell-group>
        </div>
      </div>
      <div class="footer">
        <van-button type="primary" size="large" @click="nextBtnClick" :disabled="btnState">下一步</van-button>
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import selecPopup from '@/components/selecPopup';
import bus from '@/assets/js/bus.js';
import { isEmptyStr } from '../../assets/js/utils';
import {
  queryWaybill,
  checkOrderAgain,
  driverNext,
  buildWaybillAgain,
  phoneGetName,
} from '@/api/apiBuildWaybill';
import { dateFormat } from '@/common/filters';
export default {
  name: 'write_car_information',
  data() {
    return {
      isFromH5: this.$route.query.isFromH5, //0 否 1 是
      taxWaybillId: this.$route.query.taxWaybillId,
      xid: this.$route.query.xid,
      nameDisabled: false,
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
        hybWallet: '',
        mobileNoChange: '',
        cartBadgeNoChange: '',
      },
    };
  },
  components: {
    selecPopup,
  },
  computed: {
    btnState() {
      if (
        this.formData.mobileNo.length === 11 &&
        this.formData.driverName.length > 0 &&
        this.formData.cartBadgeNo.length > 6 &&
        this.formData.cartType != '' &&
        this.formData.cartLength != '' &&
        this.formData.cartTonnage != ''
      ) {
        return false;
      } else {
        return true;
      }
    },
    ...mapGetters([
      'permission',
      'write_car_information',
      'waybill_information',
    ]),
  },
  mounted() {
    // 监听从我的车队选择的信息
    bus.$on('selectMyFleet', res => {
      this.formData = Object.assign(this.formData, res);
      this.phoneGetName();
    });
    // // 德邦外协从前面带信息，不冲突
    // if (this.permission.orgCfg718 === '49' && this.isFromH5 === '1') {
    //   this.formData = Object.assign(this.formData, this.waybill_information);
    // }
  },
  beforeDestroy() {
    //取消监听'getCheckboxStatus'事件
    bus.$off('selectMyFleet');
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    //通过司机手机号码获取注册过的司机姓名
    phoneGetName() {
      if (
        this.permission.zyCapitalCfg == '8' &&
        this.formData.mobileNo.length == 11
      ) {
        let json = {
          mobileNo: this.formData.mobileNo,
        };
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        phoneGetName(json)
          .then(res => {
            if (res.data.reCode == '0') {
              //如果带出了司机姓名则覆盖
              if (Object.keys(res.data.result).length != '0') {
                let result = res.data.result;
                this.formData.payName = result.driverName;
                //带出四要素则说明是做过实名认证的好运宝用户
                if (
                  result.alipayNo !== '' &&
                  result.driverName !== '' &&
                  !result.mobileNo == ''
                ) {
                  this.formData.alipayNo = result.alipayNo;
                  this.formData.mobileNo = result.mobileNo;
                  this.formData.driverName = result.driverName;
                  this.formData.idCard = result.idCard;
                  this.formData.payBankName = result.payBankName;
                  this.formData.payBankNo = result.payBankNo;
                  this.nameDisabled = true; //带出信息则禁用
                } else {
                  this.formData.alipayNo = '';
                  this.nameDisabled = false;
                }
              } else {
                this.formData.alipayNo = '';
                this.nameDisabled = false;
              }
            }
          })
          .catch(() => {});
      }
    },
    // 选择我的车队
    chooseMyFleet() {
      this.$router.push({
        path: '/my_fleet',
      });
    },
    validate() {
      //司机手机号验证
      let re = /^1\d{10}$/;
      if (!re.test(this.formData.mobileNo)) {
        this.$toast('司机手机号码输入错误', 'middle');
        return false;
      }

      if (
        this.formData.driverName === '先生' ||
        this.formData.driverName === '微信注册车辆' ||
        this.formData.driverName === 'M信用开通司机'
      ) {
        this.$toast(
          '司机姓名输入名称不可为：' + this.formData.driverName,
          'middle',
        );
        return false;
      }
      //司机姓名64位规则验证
      if (this.formData.driverName.length > 64) {
        this.$toast('司机姓名长度最大不可超过64位', 'middle');
        return false;
      }
      return true;
    },
    nextBtnClick() {
      if (!this.validate()) {
        return;
      }
      this._checkOrderAgain().then(res => {
        if (res.data.reCode === '0') {
          let taxWaybillNo = res.data.result.taxWaybillNo;
          if (res.data.result.state === '0') {
            this.driverNextBtn();
          } else {
            if (res.data.result.level === '0') {
              this.driverNextBtn();
            } else if (res.data.result.level === '1') {
              this.$klb.confirm.show({
                title: '提示',
                content: `当前司机已有承运中的运单（${taxWaybillNo}）是否继续建单？`,
                confirmText: '确认',
                cancelText: '取消',
                onCancel: () => {},
                onConfirm: () => {
                  this.driverNextBtn();
                },
              });
            } else {
              this.$klb.confirm.show({
                showCancelButton: false,
                title: '提示',
                content: `当前司机已有承运中的运单（${taxWaybillNo}）当前不可继续建单`,
                confirmText: '确认',
                onConfirm: () => {},
              });
            }
          }
        }
      });
    },
    _checkOrderAgain() {
      return new Promise((resolve, reject) => {
        checkOrderAgain({
          mobileNo: this.formData.mobileNo,
          cartBadgeNo: this.formData.cartBadgeNo,
          driverName: this.formData.driverName,
          startTime: this.waybill_information.startTime
            ? this.waybill_information.startTime.substr(0, 16)
            : dateFormat(new Date(), 'Y-m-d H:m'),
        })
          .then(res => {
            if (res.data.reCode === '0') {
              this.formData.hybWallet = res.data.result.hybWallet;
              resolve(res);
            } else {
              reject();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    //点击下一步的时候必须走这个方法
    driverNextBtn() {
      if (this.formData.mobileNo && this.formData.cartBadgeNo) {
        driverNext({
          mobileNo: this.formData.mobileNo,
          driverName: this.formData.driverName,
          cartBadgeNo: this.formData.cartBadgeNo,
          cartType: this.formData.cartType,
          cartLength: parseFloat(this.formData.cartLength),
          cartTonnage: parseFloat(this.formData.cartTonnage),
        })
          .then(() => {})
          .catch(() => {});
      }
      if (
        !isEmptyStr(this.write_car_information.mobileNo) &&
        this.formData.mobileNo != this.write_car_information.mobileNo
      ) {
        this.formData.mobileNoChange = '1';
      }
      if (
        !isEmptyStr(this.write_car_information.cartBadgeNo) &&
        this.formData.cartBadgeNo != this.write_car_information.cartBadgeNo
      ) {
        this.formData.cartBadgeNoChange = '1';
      }
      this.$store.dispatch(
        'buildWaybill/set_write_car_information',
        this.formData,
      );
      this.$router.push({
        path: '/should_pay_freight',
        query: {
          xid: this.xid,
          taxWaybillId: this.taxWaybillId,
          prepaymentsOilCard: this.prepaymentsOilCard,
          cartBadgeNo: this.cartBadgeNo,
          belongActSys: this.belongActSys,
          driverName: this.driverName,
          mobileNo: this.mobileNo,
          isFromH5: this.isFromH5,
        },
      });
    },
    // 输入车牌
    carNumIpt() {
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
      this.cartTypeActionsShow = true;
    },
    // 展示更多车型
    showMoreCartType() {
      this.moreCartTypeShow = true;
    },
    // 展示选择车长
    showCartLength() {
      this.cartLengthShow = true;
    },
    // 展示选择吨位
    showCartTonnage() {
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
  },
};
</script>
<style lang="less" scoped>
.write_car_information_container {
  .sub_page_base {
    background: #fff;
    .title {
      background: #fff;
      padding: 10px;
      font-size: 14px;
      line-height: 25px;
      color: #ffba00;
      display: flex;
    }
    .content {
      background: #fff;
      padding: 0 13px;
      .top {
        padding: 13px 0;
        .icon {
          color: #ffba00;
        }
        .text {
          height: 40px;
          line-height: 40px;
          color: #202020;
          font-size: 17px;
        }
        .btn {
          width: 120px;
          height: 36px;
          text-align: center;
          line-height: 36px;
          color: #ffffff;
          font-size: 16px;
          background-color: #1581cf;
          border-radius: 20px;
          display: inline-block;
        }
      }
      .group {
        // width: 93%;
        // margin-left: 3.5%;
        height: auto;
        border-left: 1px solid #d9d9d9;
        border-right: 1px solid #d9d9d9;
      }
    }
    .footer {
      background: #fff;
      position: fixed;
      bottom: 45px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
    }
  }
}
</style>
