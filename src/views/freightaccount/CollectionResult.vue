<template>
  <div class="collection_result_box">
    <c-header isShowTitle class="header">
      <van-nav-bar
        title="收款结果"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="collection_result">
        <div class="item" v-if="resultStatus === '1'">
          <img
            src="../../assets/imgs/freightaccount/shoukuanchenggong_icon@2x.png"
            class="img"
          />
          <p class="title">收款成功</p>
          <p class="tip">预计两小时内到账</p>
        </div>
        <div class="item" v-if="resultStatus === '0'">
          <img
            src="../../assets/imgs/freightaccount/shoukuanshibai_icon@2x.png"
            class="img"
          />
          <p class="title">收款失败</p>
        </div>
        <div class="normal_btn">
          <van-button plain type="primary" size="large" @click="onClickLeft">
            返回运费账户
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { AppFinish } from '@/assets/js/app'
export default {
  components: {},
  props: {},
  name: 'collection_result',
  data() {
    return {
      resultStatus: this.$route.query.result_status
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.go(-2)
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.collection_result_box {
  background: #fff;
  .collection_result {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #9f9f9f;
    .item {
      text-align: center;
      .img {
        width: 84px;
        margin-top: 60px;
        margin-bottom: 7px;
      }
      .title {
        color: #202020;
        font-size: 17px;
        padding-bottom: 12px;
      }
    }

    .normal_btn {
      margin-top: 100px;
    }
  }
}
</style>
