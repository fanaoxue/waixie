<template>
  <div class="payment_detail_container">
    <c-header>
      <van-nav-bar title="支付明细" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="way-pay-num">
        此笔运单共有
        <span>{{ payList.length }}笔</span>支付明细
      </div>
      <section class="way-bill-msg">
        <div class="way-msg-title">运费信息</div>
        <div class="way-order-num">
          <span class="msg-left">运 单 号 ：</span>
          <span class="msg-right">{{ freightMsg.taxWaybillNo }}</span>
        </div>
        <div class="way-pay-list">
          <div
            class="list-item"
            :gutter="2"
            placement="top"
            v-for="(item, index, key) in freightMsg.freightInfo"
            :key="key"
          >
            <div slot="content" class="popover-demo-content">
              <span class="msg-left">{{ item.name }}：</span>
              <span class="msg-right">{{ item.value }}元</span>
            </div>
            <!-- <div class="list-item1">
              <span class="msg-left">{{ item.name }}：</span>
              <span class="msg-right">{{ item.value }}元</span>
            </div>-->
          </div>
        </div>
        <div style="height:8px;"></div>
      </section>

      <section class="way-bill-msg" v-for="(item, index, key) in payList" :key="key">
        <div class="way-msg-title">
          <span>支付信息</span>
          <div class="show-or-hide" @click="wayPayShowContor(index)">
            <span v-show="showControl[index] === 1">收起</span>
            <span v-show="showControl[index] === 0">展开</span>
            <!-- <img
            class="img-icon"
            :class="{
              shouQi: showControl[index] === 1,
              zhanKai: showControl[index] === 0
            }"
            height="7"
            src="../../assets/imgs/wbs/shouqi_icon@2x.png"
            alt=""
            />-->
          </div>
        </div>
        <div class="way-order-num1 borde-none">
          <div class="pay-msg-list" v-if="item.payState === '2'">
            <span class="msg-left">付款时间：</span>
            <span class="msg-right">{{ item.paySucTime }}</span>
          </div>
          <div
            class="pay-msg-list"
            v-if="
              item.payState === '3' ||
                item.payState === '5' ||
                item.payState === '7'
            "
          >
            <span class="msg-left">申请时间：</span>
            <span class="msg-right">{{ item.createdTime }}</span>
          </div>
          <div class="pay-msg-list">
            <span class="msg-left">支付金额：</span>
            <span class="msg-right">{{ item.payActualMoney }}元</span>
          </div>
          <div class="pay-msg-list" v-show="item.isOilPay == '0'">
            <span class="msg-left">应付总额：</span>
            <span class="msg-right">{{ item.payableFreight }}元</span>
          </div>
          <div class="pay-msg-list" v-show="item.isOilPay == '0'">
            <span class="msg-left">预充金额：</span>
            <span class="msg-right">{{ item.deductibleAmount }}元</span>
          </div>
          <div class="pay-msg-list" v-show="item.insFee != ''">
            <span class="msg-left">{{baojiaName}}：</span>
            <span class="msg-right">{{ item.insFee }}元</span>
          </div>
          <div class="pay-msg-list">
            <span class="msg-left">收款人姓名：</span>
            <span class="msg-right">{{ item.realName }}</span>
          </div>
        </div>
        <transition name="mybox">
          <div class="slide" :class="{ animate: showControl[index] === 1 }">
            <div class="way-order-num1 way-order-num2">
              <div class="pay-msg-list">
                <span class="msg-left">银 行 名 称：</span>
                <span class="msg-right">{{ item.bankName }}</span>
              </div>
              <div class="pay-msg-list">
                <span class="msg-left">收 款 卡 号：</span>
                <span class="msg-right">{{ item.bankCardNo }}</span>
              </div>
              <div class="pay-msg-list">
                <span class="msg-left">支付单号：</span>
                <span class="msg-right">{{ item.serialNumber }}</span>
              </div>
              <div class="pay-msg-list">
                <span class="msg-left">支付状态：</span>
                <span class="msg-right" v-if="item.payState === '-1'">系统处理中</span>
                <span class="msg-right" v-if="item.payState === '0'">未支付</span>
                <span class="msg-right" v-if="item.payState === '1'">已申请</span>
                <span class="msg-right" v-if="item.payState === '2'">已支付</span>
                <span class="msg-right" v-if="item.payState === '3'">预申请</span>
                <span class="msg-right" v-if="item.payState === '5'">核实中</span>
                <span class="msg-right" v-if="item.payState === '7'">业务审核</span>
                <span class="msg-right" v-if="item.payState === '8'">风控数据模型未审核</span>
              </div>
            </div>

            <div class="way-order-num1 borde-none">
              <div class="pay-msg-list">
                <span class="msg-left">申 请 人 ：</span>
                <span class="msg-right">{{ item.applyName }}</span>
              </div>
              <div class="pay-msg-list">
                <span class="msg-left">付 款 人 ：</span>
                <span class="msg-right">{{ item.paidName }}</span>
              </div>
              <div class="pay-msg-list" v-if="item.payState === '2'">
                <span class="msg-left">申请时间：</span>
                <span class="msg-right">{{ item.createdTime }}</span>
              </div>
              <div
                class="pay-msg-list"
                v-if="
                  item.payState === '3' ||
                    item.payState === '5' ||
                    item.payState === '7'
                "
              >
                <span class="msg-left">付款时间：</span>
                <span class="msg-right">{{ item.paySucTime }}</span>
              </div>
              <div class="pay-msg-list">
                <span class="msg-left">到账时间：</span>
                <span class="msg-right">{{ item.arriveTime }}</span>
              </div>
            </div>
          </div>
        </transition>
      </section>
      <div style="height:24px;"></div>
    </div>
  </div>
</template>

<script>
import { waybillPayMsg } from '../../api/applyForPayment';
import { AppFinish } from '@/assets/js/app.js';
export default {
  name: 'payment_detail',
  data() {
    return {
      taxWaybillId: this.$route.query.taxWaybillId,
      showControl: [],
      freightMsg: {
        taxWaybillNo: '',
        freightInfo: [],
        taxServerPer: '',
      },
      payList: [],
      baojiaName: '保价费',
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.dataInit();
    });
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
      waybillPayMsg({ taxWaybillId: this.taxWaybillId })
        .then(res => {
          if (res.data.reCode === '0') {
            let len = res.data.result.payList;
            this.baojiaName = res.data.result.insFeeName
              ? res.data.result.insFeeName
              : this.baojiaName;
            if (len.length > 0) {
              len.forEach((element, index) => {
                if (index === 0) {
                  if (len.length > 1) {
                    this.showControl.push(0);
                  } else {
                    this.showControl.push(1);
                  }
                } else {
                  this.showControl.push(0);
                }
              });
            }
            this.freightMsg = res.data.result.freightMsg;
            this.payList = res.data.result.payList;
          }
        })
        .catch(err => {
          this.$toast(err.message);
        });
    },
    wayPayShowContor(type) {
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
.payment_detail_container {
  width: 100%;
  text-align: center;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .way-pay-num {
    height: 56px;
    line-height: 56px;
    font-size: 15px;
    padding: 0 12px;
    text-align: start;
    background-color: #ffffff;
    color: #202020;
    span {
      color: #ffba00;
    }
  }
  .way-bill-msg {
    width: 94%;
    text-align: start;
    min-height: 56px;
    height: auto;
    background-color: #ffffff;
    display: inline-block;
    margin-top: 20px;
    border-radius: 10px;
    .way-msg-title {
      font-size: 17px;
      color: #121212;
      height: 46px;
      line-height: 46px;
      padding: 0 12px;
      font-weight: bold;
      border-bottom: 1px solid #cfcfcf;
      .show-or-hide {
        // display: inline-block;
        float: right;
        color: #1581cf;
        font-size: 14px;
        font-weight: normal;
        .img-icon {
          width: 11px;
          transition: transform 0.3s, -webkit-transform 0.3s;
        }
        .shouQi {
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-45deg);
        }
        .zhanKai {
          transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0) rotate(-225deg);
        }
      }
    }
    .way-order-num {
      min-height: 44px;
      height: auto;
      display: flex;
      align-items: center;
      margin: 0 12px;
      border-bottom: 1px solid #dfdfdf;
      font-size: 15px;
    }
    .way-pay-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      font-size: 15px;
      padding: 0 12px;
      margin-top: 8px;
      .list-item {
        width: 50%;
      }
      .list-item1 {
        height: 32px;
        line-height: 32px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      div:nth-child(2n) {
        text-align: end;
      }
    }
    .way-order-num1 {
      min-height: 36px;
      height: auto;
      margin: 0 12px;
      border-bottom: 1px solid #dfdfdf;
      font-size: 15px;
      .pay-msg-list {
        display: flex;
        align-items: center;
        min-height: 36px;
        height: auto;
        // line-height: 36px;
      }
    }
    .way-order-num1 {
      border-top: 1px solid #dfdfdf;
    }
    .borde-none {
      border: none;
    }
  }
  .msg-left {
    color: #797979;
  }
  .msg-right {
    flex: 1;
    word-break: break-word;
    color: #202020;
    margin-left: -3px;
  }
  .slide {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s cubic-bezier(0, 1, 0, 1) -0.1s;
  }
  .animate {
    max-height: 9999px;
    // overflow: auto;
    transition: max-height 1s cubic-bezier(0, 1, 0, 1) -0.1s;
    transition-delay: 0s;
  }
}
.popover-demo-content {
  padding: 5px 0px;
}
</style>
