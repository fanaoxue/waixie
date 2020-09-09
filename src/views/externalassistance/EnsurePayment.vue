<template>
  <div class="ensure_payment">
    <c-header isShowTitle class="header">
      <van-nav-bar title="确认支付" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base" v-show="pageShow">
      <div class="top_cell">
        <p>
          本次共支付运费
          <span
            class="receive_color bold_style"
            v-if="insFeeState === '0'"
          >{{(parseFloat(this.payMoney) + parseFloat(this.insFee)).toFixed(2)}}</span>
          <span class="receive_color" v-else>{{parseFloat(this.payMoney).toFixed(2)}}</span>元
          <span v-show="insFeeState === '0'">(保价费{{parseFloat(this.insFee)}}元)</span>，收款人
          <span class="receive_color">{{this.personName}}</span>
        </p>
      </div>
      <van-radio-group v-model="checked" :max="1" v-show="dataList.length != 0">
        <div class="box_cell van-hairline--bottom" v-for="(item,index) in dataList" :key="index">
          <van-radio
            shape="square"
            :name="index"
            checked-color="#15499A"
            :disabled="compareVal(payMoney, item.lastMoney) || item.isAvailable === '0'"
          >
            <div class="content">
              <div
                class="bankname"
                :class="checked === index ? 'blue bold_style':''"
              >{{item.subAccountBank}}</div>
              <div
                class="money"
                :class="{'gray_color':compareVal(payMoney, item.lastMoney) || item.isAvailable === '0','blue':checked === index}"
              >
                <span>
                  可用额度：
                  <span class="last_money">{{item.lastMoney}}</span>
                </span>
                <span v-show="compareVal(payMoney, item.lastMoney)">(余额不足)</span>
              </div>
            </div>
            <div
              class="tips"
              :class="{'yellow_color':item.isAvailable === '1','red_color':item.isAvailable === '0',}"
            >{{item.tipMsg}}</div>
          </van-radio>
        </div>
      </van-radio-group>
      <div class="footer" style="height:135px;"></div>
      <div class="button">
        <van-button type="primary" size="large" @click="ensureToPay" :disabled="disabledState">确认支付</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  queryWaybillAccount,
  ensureForPayment,
} from '../../api/applyForPayment';
export default {
  data() {
    return {
      payMoney: this.$route.query.payMoney,
      insFee: this.$route.query.insFee, // 保费
      insFeeState: this.$route.query.insFeeState, // 保价费展示配置
      personName: this.$route.query.personName,
      paymentCode: this.$route.query.paymentCode,
      serialNumberList: this.$route.query.serialNumber,
      walletPay: this.$route.query.walletPay, //是否是钱包收款
      subType: '',
      pageShow: false,
      disabledState: true,
      checked: [],
      dataList: [],
      payWay: '0', // 默认自有资金支付
    };
  },
  watch: {
    checked(val) {
      if (val.length === 0) {
        this.disabledState = true;
      } else {
        this.disabledState = false;
        this.dataList.forEach((item, index) => {
          if (val === index) {
            this.subType = item.subType || '';
          }
          if (item.isAvailable == '1') {
            this.payWay = '1';
          } else {
            this.payWay = '0';
          }
        });
      }
    },
  },
  mounted() {
    this.dataInit();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      window.history.go(-1);
    },
    // 数据初始化
    dataInit() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      let json = {
        taxWaybillId: this.$route.query.taxWaybillId,
        // insFee: parseFloat(this.insFee),
        freight: parseFloat(this.payMoney).toFixed(2),
        serialNumberList: [this.serialNumberList],
      };
      queryWaybillAccount(json)
        .then(res => {
          let result = res.data.result;
          if (res.data.reCode === '0' && result.list.length != 0) {
            this.dataList = result.list;
          } else {
            this.$toast(res.data.reInfo);
          }
          this.pageShow = true;
        })
        .catch(err => {
          this.pageShow = true;
        });
    },
    // 确认支付
    ensureToPay() {
      let json = {
        paymentCode: this.paymentCode,
        serialNumberList: [this.serialNumberList],
        payWay: this.payWay, // 支付方式
        subType: this.subType,
        verifyCode: '',
      };
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      ensureForPayment(json)
        .then(res => {
          if (res.data.reCode === '0') {
            // 走接口
            this.$router.push({
              path: '/payment_success',
              query: {},
            });
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(err => {});
    },
    // 比较两个值大小
    compareVal(a, b) {
      if (Number(a) - Number(b) > 0) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.ensure_payment {
  background: #efefef;
  .sub_page_base {
    .top_cell {
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      box-sizing: border-box;
      width: 95%;
      padding: 15px;
      color: #121212;
      font-size: 4.267vw;
      line-height: 6.4vw;
      background-color: #fff;
      margin: 10px auto;
      .receive_color {
        color: #ffba00;
      }
      .bold_style {
        font-weight: bold;
      }
    }
    .box_cell {
      position: relative;
      box-sizing: border-box;
      width: 95%;
      padding: 15px;
      padding-right: 0;
      overflow: hidden;
      color: #121212;
      font-size: 4.267vw;
      line-height: 6.4vw;
      background-color: #fff;
      margin: 0px auto;
      /deep/.van-radio__icon--checked .van-icon {
        border-radius: 4px;
      }
      /deep/.van-radio__icon .van-icon {
        border-radius: 4px;
      }
      /deep/.van-radio {
        align-items: normal;
      }
      .content {
        width: 300px;
        display: flex;
        display: -webkit-box;
        display: -webkit-flex;
        .blue {
          color: #15499a !important;
        }
        .bold_style {
          font-weight: bold;
        }
        .bankname {
          display: inline-block;
          width: 49%;
        }
        .money {
          display: inline-block;
          width: 49%;
          font-size: 14px;
          color: #202020;
          word-break: break-all;
          .last_money {
            margin-left: -8px;
          }
        }
        /deep/.gray_color {
          color: #9f9f9f;
        }
      }
      .tips {
        font-size: 14px;
        margin-top: 4px;
      }
      .yellow_color {
        color: #ffba00;
      }
      .red_color {
        color: #d84b4c;
      }
    }

    .button {
      height: 36.533vw;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0px 10px;
      background-color: #efefef;
      .van-button--disabled {
        opacity: 1;
        background: #aaaaaa;
        border: 1px solid rgba(188, 188, 188, 1);
      }
    }
  }
}
</style>