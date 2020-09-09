<template>
  <div class="apply_advance_payment_box">
    <c-header isShowTitle class="header">
      <van-nav-bar title="提前收款" left-arrow fixed :border="false" @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="apply_advance_box">
        <img src="../../assets/imgs/freightaccount/shoukuanbg_img@2x.png" class="img" />
        <div class="advance_txt">
          <img src="../../assets/imgs/freightaccount/yundan_img@2x.png" class="img2" />
          <span class="tip" @click="handleServer">了解服务详情 >></span>
        </div>
      </div>
      <div class="apply_warpper">
        <div class="list">
          <span class="title justify">提前收款运单：</span>
          {{ receiveInfo.waybillNum }}笔
        </div>
        <div class="list">
          <span class="title justify">可收款金额：</span>
          {{
          receiveInfo.reveiveAmount | formatNumber(receiveInfo.reveiveAmount)
          }}
        </div>
        <div class="list">
          <span class="title justify">服务费：</span>
          {{ receiveInfo.serviceFee | formatNumber(receiveInfo.serviceFee) }}元
        </div>
        <div class="list">
          <span class="title justify">实际到账金额：</span>
          {{
          receiveInfo.actualAmount | formatNumber(receiveInfo.actualAmount)
          }}元
        </div>
        <div class="list">
          <span class="title justify">收款账户：</span>
          {{ receiveInfo.subAccountNo }}
        </div>
      </div>
      <div class="apply_tip">
        <i class="iconfont icongongyingshang-shijian"></i>
        {{ receiveInfo.tipsInfo }}
      </div>
      <div class="pub_fixed_btn" @click="sureReceives">
        <van-button type="primary" size="large">确认收款</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { applyReceivables, getReceivablesCalc } from '@/api/freightaccount'
export default {
  components: {},
  props: {},
  name: 'apply_advance_payment',
  data() {
    return {
      receiveList: '',
      subAccountNo: '',
      receiveInfo: {}
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      // localStorage.removeItem('receiveListData')
      this.$router.back()
    },
    // 了解服务详情
    handleServer() {
      this.$router.push('/ad_server_detailed')
    },
    // 初始化
    init() {
      this.$toast.loading({
        message: '加载中...'
      })
      getReceivablesCalc({
        receiveList: this.receiveList,
        subAccountNo: this.subAccountNo
      }).then(res => {
        if (res.data.reCode === '0') {
          this.receiveInfo = res.data.result
        }
      })
    },
    // 确认提前收款
    sureReceives() {
      try {
        MtaH5.clickStat('wx_surereceives')
      } catch (error) {
        console.log(JSON.stringify(error))
      }
      this.$toast.loading({
        message: '加载中...'
      })
      applyReceivables({
        receiveList: this.receiveList
      }).then(res => {
        if (res.data.reCode === '0') {
          this.$router.replace('/collection_result?result_status=1') // 收款成功
        } else {
          this.$router.replace('/collection_result?result_status=0') // 收款失败
        }
        localStorage.removeItem('receiveListData')
      })
    }
  },
  created() {},
  mounted() {
    if (JSON.parse(localStorage.getItem('receiveListData'))) {
      const receiveListData = JSON.parse(
        localStorage.getItem('receiveListData')
      )
      this.receiveList = receiveListData.receiveList
      this.subAccountNo = receiveListData.subAccountNo
      this.init()
    }
  }
}
</script>
<style lang="less" scoped>
.apply_advance_payment_box {
  .apply_advance_box {
    background: @themeColor;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px 10px 0 10px;
    position: relative;
    .img {
      width: 100%;
      height: 65px;
    }
    .advance_txt {
      display: flex;
      position: absolute;
      top: 50%;
      width: calc(~'100% - 44px');
      padding: 0 12px;
      .img2 {
        width: 197px;
        max-height: 18px;
        flex: 1;
      }
      .tip {
        line-height: 24px;
        color: #fff;
        text-decoration: underline;
        flex: 1;
        text-align: right;
      }
    }
  }
  .apply_warpper {
    margin: 0 10px;
    padding: 0px 12px;
    background: #fff;
    color: #202020;
    font-size: 15px;
    // margin-bottom: 163px;
    border: 1px solid #dfdfdf;
    border-top: none;
    .list {
      padding: 17px 0px;
      display: flex;
      border-bottom: 1px dashed #dfdfdf;
      &:last-child {
        border-bottom: none;
      }
      .title {
        flex: 0 0 auto;
        color: #797979;
        // margin-right: 5px;
        width: 108px;
        height: 15px;
      }
    }
  }
  .apply_tip {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    color: #797979;
    padding-top: 20px;
    .icongongyingshang-shijian {
      color: #ffba00;
      margin-right: 5px;
    }
  }
  .pub_fixed_btn {
    bottom: 60px;
    width: 100%;
  }
}
</style>
