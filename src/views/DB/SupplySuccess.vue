<template>
  <div class="SupplySuccess">
    <c-header class="header">
      <van-nav-bar left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="success_note">
        <img :src="successLogo" alt height="55px" />
        <p>关联运单成功</p>
      </div>
      <div class="success_button">
        <van-button plain type="primary" @click="goMySourceOfGoods"
          >继续关联</van-button
        >
        <van-button plain type="primary" @click="goHome">返回主页</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { AppFinish } from '@/assets/js/app.js';
export default {
  name: 'SupplySuccess',
  data() {
    return {
      successLogo: require('@/assets/imgs/DB/guanlianyundanchenggong_icon@2x.png'),
    };
  },
  // eslint-disable-next-line no-unused-vars
  beforeRouteLeave(to, from, next) {
    if (to.name === 'WaybillLink') {
      this.onClickLeft();
    }
    next();
  },
  mounted() {
    this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', ['WaybillLink']);
    this.$nextTick(() => {
      this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', ['WaybillLink']);
    });
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.goHome();
    },
    // 返回主页
    goHome() {
      AppFinish(-3);
    },
    // 继续关联
    goMySourceOfGoods() {
      this.$router.push({
        path: '/MySourceOfGoods',
        query: {
          active: 2,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.SupplySuccess {
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
