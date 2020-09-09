<template>
  <div class="ad_server_detailed_box">
    <c-header isShowTitle class="header">
      <van-nav-bar
        title="外协金融"
        left-arrow
        fixed
        :border="false"
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="server_detailed_box">
        <img
          src="../../assets/imgs/freightaccount/bg_img@2x.png"
          class="bg_img"
        />
        <div class="advantage flex_center">
          <img
            src="../../assets/imgs/freightaccount/youshi_img@2x.png"
            class="youshi_img"
          />
          <div class="two_advant">
            <div class="advant flex_center">
              <img
                src="../../assets/imgs/freightaccount/shijian_icon@2x.png"
                class="advant_img"
              />
              <p class="title">运费到账时间保障</p>
            </div>
            <div class="advant flex_center">
              <img
                src="../../assets/imgs/freightaccount/yunfei_icon@2x.png"
                class="advant_img"
              />
              <p class="title">账期内提前收运费</p>
            </div>
          </div>
          <div class="vertical_line">
            <div class="line flex_center"><span class="line_span"></span></div>
            <div class="line flex_center"><span class="line_span"></span></div>
          </div>
          <div class="server_standard">
            <img
              src="../../assets/imgs/freightaccount/biaoti_img@2x.png"
              class="standard_img"
            />
            <div class="standard first">
              <span class="standard_title">1</span
              >货主确认回单后，账期后运费即到账。
            </div>
            <div class="standard">
              <span class="standard_title">2</span
              >货主确认回单后，账期内可提前收取运费。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  name: 'ad_server_detailed',
  data() {
    return {}
  },
  watch: {},
  computed: {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="less" scoped>
.ad_server_detailed_box {
  background: #2859da;
  .server_detailed_box {
    position: relative;
    height: calc(~'100vh - 45px');
    overflow: hidden;
    .bg_img {
      width: 100%;
      // height: 100%;
      overflow: hidden;
      border: none;
    }
    .advantage {
      position: absolute;
      top: 220px;
      padding: 0 12px;
      width: calc(~'100% - 24px');
      display: flex;
      flex-direction: column;
      .youshi_img {
        width: 178px;
        position: absolute;
        top: -6%;
        left: 50%;
        transform: translateX(-50%);
      }
      .two_advant {
        width: calc(~'100% - 50px');
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        display: flex;
        font-size: 16px;
        color: #202020;
        padding: 35px 15px 22px 15px;
        .advant {
          flex: 1;
          flex-direction: column;
          position: relative;
          &:first-child {
            &::after {
              content: '';
              width: 1px;
              height: 20px;
              border-left: 1px dashed #dfe1e4;
              position: absolute;
              right: -2px;
              top: 10px;
            }
          }
          .advant_img {
            width: 44px;
            margin-bottom: 12px;
          }
        }
      }
      .vertical_line {
        width: 100%;
        display: flex;
        height: 19px;
        .line {
          flex: 1;
          .line_span {
            display: inline-block;
            width: 3px;
            height: 19px;
            background: rgba(255, 255, 255, 0.9);
          }
        }
      }
      .server_standard {
        width: calc(~'100% - 50px');
        background: rgba(255, 255, 255, 0.9);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        color: #313233;
        padding: 19px 13px 24px 13px;
        .standard_img {
          width: 207px;
          margin: 0 auto;
          margin-bottom: 21px;
        }
        .standard {
          display: flex;
          line-height: 20px;
          &.first {
            margin-bottom: 17px;
          }
          .standard_title {
            width: 18px;
            height: 18px;
            line-height: normal;
            font-size: 14px;
            color: #eaeffb;
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 0 auto;
            border-radius: 50%;
            overflow: hidden;
            background: #2859da;
            text-align: center;
            margin-right: 6px;
            vertical-align: middle;
            // position: relative;
            // top: 2px;
          }
        }
      }
    }
  }
}
</style>
