<template>
  <div class="settlement_activity_container">
    <c-header>
      <van-nav-bar
        title="结算保障"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="container">
        <div class="title-container">
          <img src="../../assets/imgs/activity/wenzi@2x.png" alt="" />
        </div>
        <div class="content-container">
          <div class="content-box">
            <div class="title"></div>
            <div class="content">
              <div class="item">
                <div class="circle">
                  <img
                    src="../../assets/imgs/activity/yunli_icon@2x.png"
                    alt=""
                  />
                </div>
                <div class="text">稳定运力</div>
              </div>
              <div class="item">
                <div class="circle">
                  <img
                    src="../../assets/imgs/activity/biaozhun_icon@2x.png"
                    alt=""
                  />
                </div>
                <div class="text">运费<br />结算标准</div>
              </div>
              <div class="item">
                <div class="circle">
                  <img
                    src="../../assets/imgs/activity/chegnben_icon@2x.png"
                    alt=""
                  />
                </div>
                <div class="text">降低<br />采购成本</div>
              </div>
            </div>
          </div>
          <div class="footer-box">
            <div class="lianzi">
              <img
                src="../../assets/imgs/activity/lianzi_img@2x.png"
                alt=""
              /><img
                src="../../assets/imgs/activity/lianzi_img@2x.png"
                alt=""
              />
            </div>
            <div class="content">
              <div class="item">
                <div class="title">
                  <div class="line"></div>
                  结算保标准
                </div>
                <ul class="detail">
                  <li>
                    <div>运费账期</div>
                    <div class="blue">7天</div>
                  </li>
                  <li>
                    <div>预付油卡</div>
                    <div class="blue">路歌支付</div>
                  </li>
                  <li>
                    <div>到付金额</div>
                    <div class="blue">路歌支付</div>
                  </li>
                </ul>
              </div>
              <div class="item">
                <div class="title">
                  <div class="line"></div>
                  结算保要求
                </div>
                <div class="detail">
                  司机上传回单，企业及时(48h内)与货主确认后审核回单。
                </div>
              </div>
              <div class="item">
                <div class="title">
                  <div class="line"></div>
                  结算保明细
                </div>
                <div class="detail">
                  1、审核回单后，即代表司机完成运输，平台7天后自动付款到司机好运宝钱包。<br />
                  2、审核回单后，平台为诚信优质司机，提供提前支取服务，司机急需用钱，可在7天内提前支取，司机需支付0.3%的服务费(1000元扣除3元)。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settlement_activity',
  data() {
    return {}
  },
  created() {},
  mounted() {
    // this.$store.commit("updateLoadingStatus", { isLoading: false });
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
.settlement_activity_container {
  width: 100%;
  height: 100%;
  @media screen and (max-width: 320px) {
    font-size: 10px;
    line-height: 140%;
  }
  .sub_page_base {
    display: flex;
    flex-direction: column;
  }
  .container {
    width: 100vw;
    flex: 1;
    // height: 100vh;
    // height: calc(~'100vh - 46px');
    // width: 100%;
    // height: 100%;
    // position: fixed;
    background-image: url(../../assets/imgs/activity/bg@2x.png);
    background-repeat: no-repeat;
    overflow: hidden;
    background-size: 100% 100%;
    // background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: none;
    .title-container {
      min-height: 90px;
      width: 100%;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 75px;
        width: 190px;
        @media screen and (max-width: 320px) {
          height: 37px;
          width: 95px;
        }
      }
    }
    .content-container {
    }
    .content-box {
      background-image: url(../../assets/imgs/activity/youshibg_bg@2x.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 189px;
      @media screen and (max-width: 320px) {
        height: 150px;
        font-size: 12px;
      }
      .title {
        background-image: url(../../assets/imgs/activity/title_bg@2x.png);
        background-repeat: no-repeat;
        overflow: hidden;
        background-size: 100% 100%;
        height: 46px;
        width: 231px;
        position: relative;
        top: -10px;
        margin: 0 auto;
      }
      .content {
        padding: 0 20px;
        display: flex;
        justify-content: space-around;
        .item {
          display: flex;
          flex-direction: column;
          @media screen and (max-width: 320px) {
            font-size: 12px;
          }
          .circle {
            width: 54px;
            height: 54px;
            background: rgba(66, 99, 231, 0.1);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: 26px;
            }
          }
          .text {
            margin-top: 5px;
            font-size: 14px;
            font-family: Source Han Sans SC;
            font-weight: 400;
            color: rgba(55, 103, 231, 1);
            text-align: center;
          }
        }
      }
    }
    .footer-box {
      background-image: url(../../assets/imgs/activity/jiesuan_bg@2x.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      height: 315px;
      @media screen and (max-width: 320px) {
        height: 250px;
      }
      .lianzi {
        position: relative;
        top: -15px;
        display: flex;
        justify-content: space-between;
        padding: 0 60px;
        img {
          height: 32px;
          width: 7px;
        }
      }
      .content {
        padding: 0 30px;
        .item {
          font-size: 13px;
          font-family: Source Han Sans SC;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          .title {
            font-weight: bold;
            color: rgba(55, 103, 231, 1);
            .line {
              display: inline-block;
              width: 4px;
              height: 12px;
              background: rgba(255, 176, 27, 1);
              border-radius: 4px;
              margin-right: 5px;
            }
          }
          ul {
            display: flex;
            justify-content: space-around;
            align-items: center;
            list-style: none;
            text-align: center;
            .blue {
              font-size: 16px;
              font-weight: bold;
              color: rgba(55, 103, 231, 1);
            }
          }
          .detail {
            margin-left: 13px;
          }
        }
      }
    }
  }
}
</style>
