<template>
  <div class="QuotationSuccess">
    <c-header class="header">
      <van-nav-bar left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="success_note">
        <img :src="successLogo" alt height="55px" />
        <p>报价成功！</p>
      </div>
      <div class="success_button">
        <van-button plain type="primary" @click="goMySourceOfGoods"
          >继续报价</van-button
        >
        <van-button plain type="primary" @click="goMySourceOfGoodsForQuotation"
          >查看我的报价</van-button
        >
      </div>
    </div>
  </div>
</template>
<script>
// import { AppFinish } from '@/assets/js/app.js';
import bus from '@/assets/js/bus.js';
export default {
  name: 'QuotationSuccess',
  data() {
    return {
      successLogo: require('@/assets/imgs/DB/jiandancheng_icon@2x.png'),
    };
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    if (to.name === 'Quotation') {
      this.onClickLeft();
    }
    next();
  },
  mounted() {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.goHome();
    },
    // 返回主页
    goHome() {
      bus.$emit('onRefresh', { active: 0 });
      this.$router.push({
        path: '/MySourceOfGoods',
      });
    },
    // 继续关联
    goMySourceOfGoods() {
      this.goHome();
    },
    // 查看我的报价
    goMySourceOfGoodsForQuotation() {
      bus.$emit('onRefresh', { active: 1 });
      this.$router.push({
        path: '/MySourceOfGoods',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.QuotationSuccess {
  background: #ffffff;
  height: 100%;
  width: 100%;
  .success_note {
    text-align: center;
    display: inline-block;
    width: 100%;
    margin: 50px auto;
    img {
      margin-bottom: 10px;
    }
    p {
      color: #202020;
    }
  }
  .success_button {
    display: flex;
    flex-direction: column;
    .van-button {
      width: 175px;
      height: 50px;
      margin: 8px auto;
      border-radius: 5px;
    }
  }
}
</style>
