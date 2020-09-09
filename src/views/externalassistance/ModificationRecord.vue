<template>
  <div class="modification_record_container">
    <c-header>
      <van-nav-bar title="修改记录" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="way-bill-msg" v-for="(item, val) in resultMsg" v-bind:key="val">
        <div class="way-order-num1">
          <div class="pay-msg-list">
            <span class="msg-left yellow">修改项目：</span>
            <span class="msg-right dark">{{ item.modifyItem }}</span>
          </div>
          <div class="pay-msg-list">
            <span class="msg-left yellow">修&nbsp;改&nbsp;前&nbsp;：</span>
            <span class="msg-right dark">{{ item.modifyBefore }}</span>
          </div>
          <div class="pay-msg-list">
            <span class="msg-left yellow">修&nbsp;改&nbsp;后&nbsp;：</span>
            <span class="msg-right dark">{{ item.modifyAfter }}</span>
          </div>
          <div class="pay-msg-list dotted">
            <span class="msg-left dash">修改时间：</span>
            <span class="msg-right dark">{{ item.modifiedTime }}</span>
          </div>
          <div class="pay-msg-list">
            <span class="msg-left dash">修&nbsp;改&nbsp;人&nbsp;：</span>
            <span class="msg-right">{{ item.modifyRealName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { modifyRecord } from '../../api/wayBill'
import { AppFinish } from '@/assets/js/app.js'
export default {
  name: 'modification_record',
  data() {
    return {
      taxWaybillId: this.$route.query.taxWaybillId,
      // flag: '1',
      resultMsg: []
    }
  },
  mounted() {
    this.dataInit()
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.go(-1)
    },
    // 初始化
    dataInit() {
      const toastloading = this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      let json = {
        taxWaybillId: this.taxWaybillId
      }
      modifyRecord(json) //修改记录查询
        .then(res => {
          toastloading.clear()
          if (res.data.reCode === '0') {
            this.resultMsg = res.data.result
          } else {
            this.$toast(res.data.reInfo)
          }
        })
        .catch(err => {
          toastloading.clear()
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.modification_record_container {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0rem;
  min-height: 100%;
  height: auto;
  .content {
    margin: 5rem auto;
    text-align: center;
  }
  .way-bill-msg {
    width: 95%;
    text-align: start;
    height: auto;
    background-color: #ffffff;
    border-radius: 10px;
    margin: 1rem auto;
    .way-order-num1 {
      min-height: 36px;
      height: auto;
      margin: 0 12px;
      font-size: 15px;
      .pay-msg-list {
        display: flex;
        align-items: center;
        min-height: 36px;
        height: auto;
        // line-height: 36px;
        .msg-left {
          min-width: 5em;
          text-align: right;
        }
        .msg-right {
          margin-left: -4px;
        }
      }
      .yellow {
        color: #ffba00;
      }
      .dark {
        color: #202020;
      }
      .dotted {
        border-top: 1px dotted #dfdfdf;
      }
    }
  }
  .dash {
    color: #797979;
  }
}
</style>
