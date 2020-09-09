<template>
  <div class="application_for_payment">
    <c-header isShowTitle class="header">
      <van-nav-bar title="申请支付" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="card_group">
        <van-cell-group>
          <van-field v-model="formData.carrierOrgName" label="外协供应商：" disabled />
          <van-field v-model="formData.paidMoney" label="待付运费：" disabled />
          <van-field v-model="formData.paidMoney" label="支付金额：" disabled />
          <van-field v-model="formData.subAccountName" label="收款账户：" disabled />
          <van-field v-model="formData.subAccountNo" label="收款账号：" disabled />
        </van-cell-group>
      </div>
      <div class="button">
        <van-button type="primary" size="large" @click="applicationForPayment">确认申请</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { AppFinish, jumpIndex } from '@/assets/js/app.js'
import {
  sureApplyPay,
  applyDataInit,
  queryForPaymentMsg,
  computedPayServerNum
} from '../../api/applyForPayment.js'

export default {
  name: 'ApplicationForPayment',
  data() {
    return {
      msg: '申请支付',
      taxWaybillId: this.$route.query.taxWaybillId,
      waybillState: this.$route.query.waybillState,
      formData: {
        carrierOrgName: '',
        paidMoney: '',
        paidMoney: '',
        subAccountName: '',
        subAccountNo: '',
        totalMoney: ''
      },
      peizhi: {}
    }
  },
  mounted() {
    this.dataInit()
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1)
    },
    dataInit() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      queryForPaymentMsg({ taxWaybillId: this.taxWaybillId })
        .then(res => {
          if (res.data.reCode === '0') {
            let result = res.data.result
            Object.assign(this.formData, result)
            let eapfList = [
              {
                taxWaybillId: this.taxWaybillId,
                paymentType: '0',
                payeeAmount: this.formData.paidMoney
              }
            ]
            computedPayServerNum({ eapfList: eapfList })
              .then(response => {
                if (response.data.reCode === '0') {
                  this.formData.totalMoney = response.data.result.totalMoney
                }
              })
              .catch(err => {
                this.$toast(err.message)
              })
          } else {
            this.$toast(res.data.reInfo)
          }
        })
        .catch(err => {})
    },
    // 确认申请
    applicationForPayment() {
      let that = this
      this.$klb.confirm.show({
        title: '支付单信息确认',
        confirmText: '确认申请',
        cancelText: '取消',
        content: `
          <div style="color:#FFBA00;">支付运费金额：${this.formData.totalMoney}元</div>
          <div>外协供应商：${this.formData.carrierOrgName}</div>
        `,
        onConfirm: () => {
          that.applyForPayment()
        },
        onCancel: () => {}
      })
    },
    //申请支付接口
    applyForPayment() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      let jsonData = Object.assign(this.formData, {
        payeeName: this.formData.subAccountName,
        payeeBankName: this.formData.bankName,
        payeeProvince: this.formData.bankProvince,
        payeeCity: this.formData.bankCity,
        payeeBankNo: this.formData.subAccountNo,
        payeeAmount: this.formData.paidMoney,
        type: 1
      })
      sureApplyPay(jsonData)
        .then(res => {
          if (res.data.reCode === '0') {
            this.$toast('申请支付成功！')
            setTimeout(() => {
              let json = {
                selectedIndex: '0',
                subIndex: this.waybillState,
                waybillTopIndex: '1',
                refreshList: ['1', '2', '3']
              }
              jumpIndex(json)
              this.onClickLeft()
            }, 500)
          } else {
            this.$toast(res.data.reInfo)
          }
        })
        .catch(err => {
          this.$toast(err.message)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.application_for_payment {
  /deep/.van-field__control:disabled {
    color: #202020;
    -webkit-text-fill-color: #202020;
    background-color: transparent;
    opacity: 1;
  }
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
  }
  .button {
    position: absolute;
    left: 0px;
    bottom: 0px;
    width: 100%;
    z-index: 10;
    .van-button {
      display: inherit;
      margin: 10px auto 60px;
      border-radius: 5px;
      width: 90%;
    }
  }
}
</style>
