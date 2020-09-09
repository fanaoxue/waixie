<template>
  <div class="webs-usually-cxt">
    <!-- <c-header>
      <x-header :left-options="{ backText: '' }">常用收款人（{{ this.payeeListLength }}）</x-header>
    </c-header>-->
    <c-header isShowTitle class="header">
      <van-nav-bar :title="title" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <page-error v-show="waitingFlag === -1"></page-error>
      <section
        v-show="waitingFlag === 1"
        class="way-bill-msg"
        v-for="(item, index, key) in payeeList"
        :key="key"
      >
        <div class="usually-msg-list">
          <div class="list-left-cxt">
            <div class="top-cxt">
              <img src="../../assets/imgs/externalassistance/shoukuanren_icon@2x.png" alt srcset />
              <span class="person-name1 person-name">{{ item.payeeName }}</span>
              <span class="identity-type" v-if="item.acctType === '1'">车队长</span>
              <span class="identity-type" v-if="item.acctType === '6'">车队钱包</span>
              <span v-show="item.acctType === '5'">
                <img
                  src="../../assets/imgs/externalassistance/qianbao_icon@2x.png"
                  width="16px"
                  alt
                  style="width: 16px;margin-left: 6px;"
                />
              </span>
            </div>
            <div class="bottom-cxt">
              <span class="person-name bottm-left">身份证：</span>
              <span class="person-name bottm-right">{{ item.payeeIdCard }}</span>
            </div>
            <div class="bottom-cxt">
              <span class="person-name bottm-right">{{ item.payeeBankName }}</span>
            </div>
            <div class="bottom-cxt">
              <span class="person-name bottm-right">{{ item.payeeBankNo }}</span>
            </div>
            <div class="bottom-cxt" v-show="item.hybWallActState == 1">
              <span class="person-name bottm-right" style="color:#D84B4C;">选择钱包收款，可获得10元现金奖励</span>
            </div>
            <div class="bottom-cxt" v-show="item.hybWallActState == 2">
              <span class="person-name bottm-right" style="color:#D84B4C;">可增加1单有效单数，领取礼品</span>
            </div>
          </div>
        </div>
        <div class="list-right-cxt">
          <div
            v-if="item.bankInfoId.length > 0"
            class="right-btn delete-btn"
            @click="deleteBtnClick(index, item.bankInfoId, item.payeeName)"
          >删除</div>
          <div style="width:15px"></div>
          <div class="right-btn sure-btn" @click="useBtnClick(item)">使用</div>
        </div>
        <div style="height:16px"></div>
      </section>
      <div style="height:20px;"></div>
    </div>
  </div>
</template>
<script>
import { AppFinish } from '@/assets/js/app.js';
import {
  deletePayPerson,
  getRecPayHistory,
  beforeSureApplyPay,
} from '../../api/applyForPayment.js';
import pageError from '../../components/pageError';
export default {
  components: {
    pageError,
  },
  data() {
    return {
      waitingFlag: 0,
      payeeList: [],
      payeeListLength: 0,
      hybWalletCfg: this.$route.query.hybWalletCfg, // 好运宝钱包配置
      taxWaybillId: this.$route.query.taxWaybillId,
      autoShowWalletCfg: this.$route.query.autoShowWalletCfg,
      mobileNo: this.$route.query.mobileNo,
      payeeName: this.$route.query.payeeName,
      cartBadgeNo: this.$route.query.cartBadgeNo,
    };
  },
  computed: {
    title: function() {
      return '常用收款人' + '(' + this.payeeListLength + ')';
    },
  },
  created() {},
  mounted() {
    this.dataInit();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      window.history.go(-1);
    },
    dataInit() {
      let json = {
        taxWaybillId: this.taxWaybillId,
        mobileNo: this.mobileNo,
        payeeName: this.payeeName,
        iResType: 0,
        entType: '1',
        hybWalletCfg: this.hybWalletCfg,
        autoShowWalletCfg: this.autoShowWalletCfg,
        driverName: this.payeeName,
        cartBadgeNo: this.cartBadgeNo,
      };
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getRecPayHistory(json)
        .then(res => {
          if (res.data.reCode === '0') {
            if (res.data.result.payeeList.length === 0) {
              this.waitingFlag = -1;
            } else {
              this.payeeList = res.data.result.payeeList;
              this.payeeListLength = this.payeeList.length;
              this.waitingFlag = 1;
              document.title = `常用收款人（${this.payeeListLength}）`;
            }
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(error => {
          this.$toast(error.message);
        });
    },
    deleteBtnClick(index, bankInfoId, name) {
      //删除按钮操作
      this.$klb.confirm.show({
        title: '提示',
        content: `<divs style='color:#202020'>确认删除收款人<span style='color:#FFBA00'>${name}</span>？</div>`,
        confirmText: '确认',
        cancelText: '取消',
        onConfirm: () => {
          deletePayPerson({ bankInfoId: bankInfoId })
            .then(res => {
              if (res.data.reCode === '0') {
                this.payeeList.splice(index, 1);
                this.payeeListLength = this.payeeList.length;
                document.title = `常用收款人（${this.payeeListLength}）`;
              } else {
                this.$toast(res.data.reInfo);
              }
            })
            .catch(error => {
              this.$toast('保存异常，请稍后再试~~~');
              this.$toast(error.message);
            });
        },
      });
    },
    _beforeSureApplyPay(payeeBankName) {
      return new Promise((resolve, reject) => {
        let payeeName = this.payeeName;
        if (
          this.payeeList[this.payeeListLength - 1].payeeBankName ===
            '好运宝钱包' &&
          payeeBankName === '好运宝钱包'
        ) {
          this.$toast.loading({
            duration: 0,
            message: '加载中',
            forbidClick: true,
          });
          beforeSureApplyPay({ payeeName })
            .then(res => {
              if (res.data.reCode === '0') {
                if (res.data.result.samePayCount === '0') {
                  this.$klb.confirm.show({
                    title: '提示',
                    content: `本次运费确认付给<span style='color:#D84B4C;'>司机${payeeName}</span>么？若不是，请重新选择！`,
                    confirmText: '确定',
                    cancelText: '取消',
                    onConfirm: () => {
                      resolve();
                    },
                    OnCancel: () => {
                      reject();
                    },
                    onClose: () => {
                      reject();
                    },
                  });
                } else {
                  resolve();
                }
              } else {
                this.$toast(res.data.reInfo);
                reject();
              }
            })
            .catch(error => {
              reject();
            });
        } else {
          resolve();
        }
      });
    },
    useBtnClick(res) {
      this._beforeSureApplyPay(res.payeeBankName)
        .then(response => {
          // 点击使用按钮逻辑
          let updateOpions = {
            payMoney: this.$store.state.applyPayMsg.applyPayMsg.payMoney,
            cardNum: res.payeeIdCard,
            personName: res.payeeName,
            bankNum: res.payeeBankNo,
            bankName: res.payeeBankName,
            bankAdress: res.payeeProvince + ' ' + res.payeeCityName,
            payeeProvinceId: res.payeeProvinceId,
            payeeCityId: res.payeeCityId,
            alipayNo: res.alipayNo, //支付宝账号
            payType: this.$store.state.applyPayMsg.applyPayMsg.payType, //收款人类型
            changeState: this.$store.state.applyPayMsg.applyPayMsg.changeState,
            wsMerchantId: res.wsMerchantId, // 网商商户号
            walletPay: res.acctType, // 是否是钱包收款
          };
          this.$store.commit('updateApplyPayMsg', updateOpions);
          this.$router.go(-1);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.webs-usually-cxt {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  text-align: center;
  height: auto;
  .way-bill-msg {
    width: 94%;
    text-align: start;
    min-height: 56px;
    height: auto;
    background-color: #ffffff;
    display: inline-block;
    margin-top: 20px;
    border-radius: 10px;
    .usually-msg-list {
      min-height: 56px;
      padding: 4px 7px;
      height: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .list-left-cxt {
        display: flex;
        flex: 1;
        flex-direction: column;
        .person-name1 {
          padding-left: 0px;
        }
        .person-name {
          font-size: 15px;
          color: #202020;
        }
        .identity-type {
          color: #ffba00;
          font-size: 14px;
          padding: 2px 4px;
          border: 1px solid rgba(255, 186, 0, 1);
          border-radius: 10px;
        }
        .top-cxt {
          height: 36px;
          line-height: 36px;
          img {
            width: 15px;
            height: 15px;
            vertical-align: middle;
          }
        }
        .bottom-cxt {
          padding-left: 20px;
          display: flex;
          align-items: center;
          min-height: 16px;
          height: auto;
          flex-wrap: wrap;
          .bottm-right {
            flex: 1;
            word-break: break-word;
          }
        }
      }
    }
    .list-right-cxt {
      padding-right: 16px;
      display: flex;
      justify-content: flex-end;
      .right-btn {
        width: 60px;
        height: 22px;
        line-height: 24px;
        border: 1px solid rgba(21, 129, 207, 1);
        border-radius: 25px;
        text-align: center;
      }
      .delete-btn {
        color: #1581cf;
      }
      .sure-btn {
        color: #fff;
        background-color: #1581cf;
      }
    }
  }
}
</style>
