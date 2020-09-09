<template>
  <div class="payment_success">
    <c-header>
      <van-nav-bar title="支付成功" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <div>
          <img
            class="image"
            src="@/assets/imgs/externalassistance/zhifuchenggong_icon@2x.png"
            alt
            srcset
          />
          <!-- <span>√</span> -->
        </div>
        <div>支付成功</div>
      </div>
      <div class="footer">
        <div class="button_box">
          <van-button plain type="primary" size="large" @click="checkWaybill">查看运单</van-button>
        </div>
        <div class="button_box">
          <van-button plain type="primary" size="large" @click="gobackDeskTop">返回工作台</van-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { AppFinish, jumpIndex } from '@/assets/js/app';
export default {
  data() {
    return {};
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    // 查看运单
    checkWaybill() {
      let json = {
        selectedIndex: '0',
        waybillTopIndex: '1', // 0：自有运单 1：外协运单
        subIndex: '2',
        refreshList: ['2'],
      };
      jumpIndex(json);
    },
    // 返回工作台
    gobackDeskTop() {
      let json = {
        selectedIndex: '1',
        waybillTopIndex: '1', // 0：自有运单 1：外协运单
        subIndex: '0',
        refreshList: ['0'],
      };
      jumpIndex(json);
    },
  },
};
</script>
<style lang="less" scoped>
.payment_success {
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #fff;
    .content {
      margin: 0 auto;
      font-size: 17px;
      margin-bottom: 66px;
      margin-top: 60px;
      .image {
        width: 80px;
        height: 70px;
        margin-bottom: 18px;
      }
      div {
        position: relative;
        span {
          position: absolute;
          bottom: 16px;
          right: 2px;
          background: #28b072;
          color: #fff;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          text-align: center;
          height: 28px;
          line-height: 28px;
        }
      }
    }
    .footer {
      margin: 0 auto;
      .button_box {
        width: 175px;
        height: 45px;
        margin-bottom: 13px;
      }
    }
  }
}
</style>