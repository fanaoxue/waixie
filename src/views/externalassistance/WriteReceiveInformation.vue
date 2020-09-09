<template>
  <div class="write_receive_information">
    <c-header isShowTitle class="header">
      <van-nav-bar
        title="填写收款信息"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model="formData.payTypeStr"
            label="收款人类型："
            placeholder="请选择收款人类型"
            right-icon="arrow"
            readonly
            @click="showPayTypeActions"
            v-show="
              permission.zyCapitalCfg !== '8' && permission.hybWalletCfg !== '8'
            "
          />
          <van-field
            v-model.trim="formData.payName"
            label="收款人姓名："
            placeholder="请输入收款人姓名"
            clearable
            :disabled="formData.payType === '1' && cantIptFlag"
          >
            <div slot="right-icon" @click="historyBtnClick()">
              <img
                class="history_img_style"
                src="@/assets/imgs/externalassistance/history.png"
                alt
              />
            </div>
          </van-field>
          <van-field
            v-model.trim="formData.payIdCard"
            maxlength="18"
            label="身份证号："
            placeholder="请输入身份证号码"
            clearable
            :disabled="cantIptFlag"
          />
          <van-field
            v-model.trim="formData.payBankNo"
            label="银行卡号："
            placeholder="请输入银行卡号"
            type="number"
            clearable
            @blur="checkBankName"
            :disabled="cantIptFlag"
          />
          <van-field
            v-model.trim="formData.payBankName"
            label="收款银行："
            placeholder="请选择收款银行"
            :right-icon="cantIptFlag ? '' : 'arrow'"
            readonly
            @click="showSelectBankPicker"
            :disabled="cantIptFlag"
          />
          <van-field
            v-model.trim="formData.payMobileNo"
            label="联系手机号："
            placeholder="请输入银行卡绑定的手机"
            type="tel"
            maxlength="11"
            clearable
            :disabled="cantIptFlag"
          />
          <van-field
            v-model="formData.reciveBankAdress"
            label="开户行地址："
            placeholder="请选择开户行地址"
            :right-icon="cantIptFlag ? '' : 'arrow'"
            readonly
            @click="showSelectCityPicker"
            :disabled="cantIptFlag"
          />
          <!-- 此字段只对于开通了自保理的企业的快路宝账号,且此笔运单是本人收款时,显示"支付宝账号字段"(支付宝账号为必填项) -->
          <div
            v-show="
              permission.zyCapitalCfg !== '8' &&
                zblState == 1 &&
                formData.payType === '1'
            "
          >
            <!-- 自保理需求 -->
            <van-radio-group v-model="formData.jiedanState">
              <van-cell-group>
                <van-cell
                  title="支付宝账号："
                  clickable
                  required
                  @click="changeType"
                >
                  <van-radio name="0" disabled>
                    <span>接单手机号</span>
                  </van-radio>
                </van-cell>
              </van-cell-group>
            </van-radio-group>
            <van-field
              v-model.trim="formData.alipayNo"
              placeholder="非接单手机号，请输入支付宝账号"
            ></van-field>
          </div>
        </van-cell-group>
      </div>
      <div class="gray"></div>
      <div class="button">
        <van-button type="primary" size="large" @click="suerBtnClick"
          >确定</van-button
        >
      </div>
    </div>
    <!-- 选择收款银行 -->
    <van-popup v-model="selectBankPickerShow" position="bottom">
      <van-picker
        :default-index="bankDefaultIndex"
        show-toolbar
        :columns="bankList"
        value-key="bankName"
        @cancel="selectBankPickerShow = false"
        @confirm="onConfirmSelectBank"
      />
    </van-popup>
    <!-- 城市选择器 -->
    <van-popup v-model="selectCityPickerShow" position="bottom">
      <cityPicker
        v-if="true"
        @onConfirm="onConfirmCityPicker"
        @onCancel="selectCityPickerShow = false"
      ></cityPicker>
    </van-popup>
    <!-- 选择收款人类型 -->
    <van-action-sheet
      v-model="payTypeActionsShow"
      close-on-click-action
      :actions="payTypeActions"
      @select="onSelectPayType"
    />
    <!-- 收款记录查询列表  popup-->
    <van-popup
      v-model="show14"
      position="bottom"
      @open="reciveHistoryAjax()"
      class="popup"
    >
      <div class="header">
        <div class="title">选择收款信息</div>
        <div class="right" @click="rightBtnClick()">手动输入</div>
      </div>
      <div
        v-show="!show14Waiting"
        style="width:100%;text-align:center;padding:16px 0px;"
      >
        <van-loading type="spinner" />
        <div style="color:#454545;height:32px;line-height:32px;">
          数据加载中...
        </div>
      </div>
      <div v-show="show14Waiting" class="recive-history-cxt">
        <div class="recive-title-style">
          当前共有
          <span>{{ reciveHistoryList.length }}条</span>支付记录
        </div>
        <div
          class="recive-list-cxt"
          @click="reciveHistoryFlag = index"
          v-for="(item, index) in reciveHistoryList"
          :key="index"
          :class="{ 'recive-list-cxt-active': reciveHistoryFlag === index }"
        >
          <div class="list-item-cxt">
            <div class="left">收款人姓名：</div>
            <div class="right">{{ item.payeeName }}</div>
            <div class="right" v-show="item.acctType == '5'">
              <i class="iconfont iconhaoyunbaoqianbao"></i>
            </div>
          </div>
          <div class="list-item-cxt">
            <div class="left">收 款 银 行：</div>
            <div class="right">{{ item.payeeBankName }}</div>
          </div>
          <div class="list-item-cxt">
            <div class="left">开户行地址：</div>
            <div class="right">
              {{ item.payeeProvince }} {{ item.payeeCityName }}
            </div>
          </div>
          <div class="list-item-cxt">
            <div class="left">银 行 卡 号：</div>
            <div class="right">{{ item.payeeBankNo }}</div>
          </div>
          <div
            class="use-btn-style"
            v-show="reciveHistoryFlag === index"
            @click="historyBtnUse(item)"
          >
            使用
          </div>
        </div>
        <div style="height:32px;"></div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { getBankList, getRecPayHistory } from '@/api/apiBuildWaybill';
import { zblState } from '@/api/wayBill';
import {
  getBankName,
  getIdCard,
  gateCheckOfCardNum,
} from '@/api/applyForPayment';
import cityPicker from '@/common/components/cityPicker';
import { idCardReg, mobileNoReg } from '@/utils/consts.js';
import bus from '@/assets/js/bus.js';
export default {
  name: 'write_receive_information',
  data() {
    return {
      payTypeActionsShow: false,
      selectBankPickerShow: false,
      selectCityPickerShow: false,
      bankDefaultIndex: 0,
      show14: false,
      taxWaybillId: this.$route.query.taxWaybillId,
      mobileNo: this.$route.query.mobileNo,
      driverName: this.$route.query.driverName,
      alipayNo: this.$route.query.alipayNo,
      payTypeActions: [
        { name: '本人收款', value: '1' },
        { name: '非本人收款', value: '0' },
      ],
      formData: {
        acctType: '', // 1：车队长 5：钱包收款(禁止输入)
        reciveBankAdress: '', //收款人银行地址
        jiedanState: '1',
        payTypeStr: '',

        // reciveType: '-1',
        payType: '', // 页面本人非本人
        payName: '', //收款人姓名
        payIdCard: '', //收款人身份证号
        payBankNo: '', //收款人银行卡号
        payMobileNo: '', //收款人手机号
        payBankName: '', //收款人银行名称
        provinceId: '', // 开户行省份id
        cityId: '', // 开户行城市id
        province: '',
        cityName: '',
        alipayNo: '', //支付宝账号
      },
      bankList: [],
      reciveHistoryFlag: -1,
      reciveHistoryList: [],
      cantIptFlag: false,
      show14Waiting: false,
      zblState: '', //自保理状态   0-未授信  1-已授信
    };
  },
  components: {
    cityPicker,
  },
  computed: {
    ...mapGetters(['permission', 'write_receive_information']),
  },
  mounted() {
    this.getZblStateMethod();
  },
  activated() {
    this.taxWaybillId = this.$route.query.taxWaybillId;
    this.mobileNo = this.$route.query.mobileNo;
    this.driverName = this.$route.query.driverName;
    this.alipayNo = this.$route.query.alipayNo;
    this.formData = Object.assign({}, this.write_receive_information);
    if (!this.formData.province) {
      this.formData.reciveBankAdress = '';
    } else {
      this.formData.reciveBankAdress =
        this.formData.province + ' ' + this.formData.cityName;
    }
    if (!this.formData.payBankNo) {
      this.formData.payTypeStr = '';
    } else {
      if (this.formData.payType == '1') {
        this.formData.payTypeStr = '本人收款';
      } else {
        this.formData.payTypeStr = '非本人收款';
      }
    }
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.go(-1);
    },
    suerBtnClick() {
      if (
        this.permission.zyCapitalCfg !== '8' &&
        this.permission.hybWalletCfg !== '8'
      ) {
        if (!this.formData.payType) {
          this.$toast('请选择收款人类型~');
          return false;
        }
      }
      if (!this.formData.payName) {
        this.$toast('请输入收款人姓名~');
        return false;
      }
      if (!idCardReg.test(this.formData.payIdCard)) {
        this.$toast('请输入正确的收款人身份证号码~');
        return false;
      }
      if (!this.formData.payBankNo) {
        this.$toast('银行卡号不能为空~');
        return false;
      }
      if (!this.formData.payBankName) {
        this.$toast('请选择银行名称~');
        return false;
      }
      if (!mobileNoReg.test(this.formData.payMobileNo)) {
        this.$toast('请输入正确的联系手机号~');
        return false;
      }
      if (!this.formData.reciveBankAdress) {
        this.$toast('请选择开户行地址~');
        return false;
      }
      if (
        this.permission.zyCapitalCfg !== '8' &&
        this.zblState == 1 &&
        this.formData.payType === '1' &&
        this.formData.alipayNo == ''
      ) {
        this.$toast('支付宝账号必填');
        return false;
      }
      this.gateCheckOfCardNumAjax();
    },
    gateCheckOfCardNumAjax() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      gateCheckOfCardNum({
        name: this.formData.payName,
        idCard: this.formData.payIdCard,
      })
        .then(res => {
          //5015
          if (res.data.reCode === '0') {
            if (this.formData.reciveBankAdress) {
              this.formData.province = this.formData.reciveBankAdress.split(
                ' ',
              )[0];
              this.formData.cityName = this.formData.reciveBankAdress.split(
                ' ',
              )[1];
            }
            this.$store.dispatch(
              'buildWaybill/set_write_receive_information',
              this.formData,
            );
            bus.$emit('selectWriteReceiveInformation', this.formData);
            this.$router.go(-1);
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(() => {
          this.$toast('保存异常，请稍后再试~~~');
        });
    },
    // 3004自保理状态查询接口
    getZblStateMethod() {
      this.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true,
      });
      return new Promise((resolve, reject) => {
        zblState({})
          .then(resp => {
            if (resp.data.reCode == '0') {
              this.zblState = resp.data.result.zblState; //自保理状态
              if (this.formData.payType == '1' && this.zblState == '1') {
                // 本人收款&&开通自保理
                this.formData.alipayNo = this.alipayNo; //支付宝账号
              } else {
                this.formData.alipayNo = '';
              }
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
    //输入银行卡号查询银行名称
    checkBankName() {
      if (this.formData.payBankNo.length > 12) {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        getBankName({ bankCardNo: this.formData.payBankNo })
          .then(res => {
            if (res.data.reCode === '0') {
              this.formData.payBankName = res.data.result;
            } else {
              this.formData.payBankName = '';
            }
          })
          .catch(err => {
            this.$toast(err.message);
          });
      }
    },
    //查询所有银行
    bankListAjax() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      return new Promise((resolve, reject) => {
        getBankList({})
          .then(res => {
            if (res.data.reCode === '0') {
              let bankList_temp = res.data.result.data.map(item => {
                return item.bankName;
              });
              this.bankList = bankList_temp;
            }
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    reciveHistoryAjax() {
      getRecPayHistory({
        taxWaybillId: '',
        mobileNo: this.mobileNo,
        payeeName: this.formData.payName,
        iResType: 1,
        entType: '0',
        hybWalletCfg: this.permission.hybWalletCfg,
        driverName: this.driverName,
      })
        .then(res => {
          if (res.data.reCode === '0') {
            this.show14Waiting = true;
            this.reciveHistoryList = res.data.result.payeeList;
          }
        })
        .catch(() => {});
    },
    historyBtnClick() {
      if (this.permission.zyCapitalCfg == '8') {
        if (this.formData.payName === '') {
          this.$toast('请输入收款人姓名查询', 'middle');
          return false;
        }
      } else {
        if (this.formData.payName === '') {
          this.$toast('请选择收款类型和输入姓名查询', 'middle');
          return false;
        }
      }
      this.show14 = true;
    },
    historyBtnUse(item) {
      this.show14 = false;
      if (item.acctType == '5') {
        // 1：车队长 5：钱包收款
        // 静止手动输入
        this.formData.acctType = '5';
        this.cantIptFlag = true;
      } else {
        this.cantIptFlag = false;
        this.formData.acctType = '';
      }
      this.formData.payName = item.payeeName;
      this.formData.payIdCard = item.payeeIdCard;
      this.formData.payMobileNo = item.mobileNo;
      this.formData.payBankName = item.payeeBankName;
      this.formData.payBankNo = item.payeeBankNo;
      this.formData.provinceId = item.payeeProvinceId;
      this.formData.cityId = item.payeeCityId;
      this.formData.reciveBankAdress =
        item.payeeProvince + ' ' + item.payeeCityName;

      this.formData.alipayNo = item.alipayNo; //点击图标写到支付宝账号
    },
    clearMsg() {
      if (this.permission.hybWalletCfg == '8') {
        this.formData.payName = '';
      }
      this.formData.payIdCard = '';
      this.formData.payMobileNo = '';
      this.formData.payBankName = '';
      this.formData.payBankNo = '';
      this.formData.provinceId = '';
      this.formData.cityId = '';
      this.formData.reciveBankAdress = '';
      this.formData.alipayNo = '';
    },
    rightBtnClick() {
      this.clearMsg();
      this.cantIptFlag = false;
      this.show14 = false;
    },
    showSelectBankPicker() {
      if (this.cantIptFlag) {
        return;
      }
      // 点击的时候获取所有银行列表
      this.bankListAjax().then(()=>{
        // 等待定位结果再显示
        if (this.getBankNameIndex()) {
          this.selectBankPickerShow = true;
        }
      });
    },
    // 定位
    getBankNameIndex() {
      return new Promise((resolve, reject) => {
        if (this.formData.payBankName) {
          this.bankList.forEach((item, index) => {
            if (this.formData.payBankName === item) {
              this.bankDefaultIndex = index;
            }
          });
        }
        resolve(1);
      });
    },
    onConfirmSelectBank(item) {
      this.formData.payBankName = item;
      this.selectBankPickerShow = false;
    },
    showSelectCityPicker() {
      if (this.cantIptFlag) {
        return;
      }
      this.selectCityPickerShow = true;
    },
    onConfirmCityPicker({ text, code }) {
      this.selectCityPickerShow = false;

      this.formData.reciveBankAdress = text;
      this.formData.provinceId = code[0];
      this.formData.cityId = code[1];

      console.log(code);
    },
    onSelectPayType(item) {
      this.formData.payType = item.value;
      this.formData.payTypeStr = item.name;
      this.clearMsg();
      this.cantIptFlag = false;
      if (item.value === '1') {
        this.formData.payName = this.driverName;
        //如果选择了本人收款，则去带出身份证号码
        if (this.zblState != '1') {
          this.formData.alipayNo = '';
        }
        this.chooseOneself();
      } else {
        this.formData.payName = '';
        this.formData.alipayNo = '';
        this.formData.jiedanState = '1';
      }
    },
    //如果选择了本人收款，则去带出身份证号码
    chooseOneself() {
      let json = {
        driverMobileNo: this.mobileNo,
        driverName: this.driverName,
      };
      getIdCard(json)
        .then(res => {
          if (res.data.reCode === '0') {
            //对象不为空时，传值
            let b = JSON.stringify(res.data.result) != '{}';
            if (b == true) {
              this.formData.payIdCard = res.data.result.idCard;
            } else {
              //置空接单手机号
              this.formData.alipayNo = '';
            }
          } else {
            this.$toast(res.data.reInfo, 'middle');
          }
        })
        .catch(() => {});
    },
    showPayTypeActions() {
      this.payTypeActionsShow = true;
    },
    changeType() {
      if (this.formData.jiedanState === '0') {
        this.formData.jiedanState = '1';
        this.formData.alipayNo = '';
      } else {
        this.formData.jiedanState = '0';
        this.formData.alipayNo = this.mobileNo;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.write_receive_information {
  background: #ffffff;

  /deep/ .van-radio__icon--disabled .van-icon {
    background-color: #fff;
    border-color: #c8c9cc;
  }
  /deep/ .van-radio__icon--checked .van-icon {
    color: #fff;
    background-color: #1989fa;
    border-color: #1989fa;
  }
  /deep/ .van-radio__label--disabled {
    color: #000;
  }
  .content {
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
    .history_img_style {
      width: 24px;
      height: 24px;
      vertical-align: middle;
    }
  }
  .button {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    .van-button {
      display: inherit;
      margin: 10px auto 60px;
      border-radius: 5px;
      width: 90%;
    }
  }
  .popup {
    max-height: 80%;
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      background-color: #fbf9fe;
      text-align: center;
      .title {
        flex: 1;
      }
      .right {
        color: #1581cf;
        padding-right: 15px;
      }
    }
  }
  .recive-history-cxt {
    padding: 12px;
    padding: 12px;
    max-height: 300px;
    overflow: auto;
    .recive-title-style {
      color: #202020;
      span {
        color: #1581cf;
      }
    }
    .recive-list-cxt {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      justify-content: spaspace-around;
      position: relative;
      padding: 13px;
      min-height: 48px;
      height: auto;
      background-color: #f6f6f6;
      border: 1px solid #dfdfdf;
      font-size: 15px;
      .use-btn-style {
        position: absolute;
        width: 60px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        background-color: #2196f3;
        color: #fff;
        border-radius: 5px;
        right: 20px;
        top: 40px;
      }
      .list-item-cxt {
        display: flex;
        justify-content: flex-start;
        .left {
          color: #454545;
        }
        .right {
          color: #202020;
        }
        .iconfont {
          color: #eb5e3b;
        }
      }
    }
    .recive-list-cxt-active {
      background-color: #e0effb;
      border: 1px solid #3699ff;
    }
  }
}
</style>
