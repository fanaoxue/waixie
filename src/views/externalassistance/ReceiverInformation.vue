<template>
  <div class="receiver_information_container">
    <c-header>
      <van-nav-bar
        title="收款人信息"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model="formData.driverName"
            label="收款人姓名："
            placeholder="请输入收款人姓名"
            clearable
            disabled
          >
            <van-button slot="button" size="small" type="warning" v-if="false"
              >常用收款人</van-button
            >
          </van-field>
          <van-field
            v-model="formData.idCard"
            label="收款人身份证："
            placeholder="请输入收款人身份证"
            clearable
            disabled
          />
          <van-field
            v-model="formData.mobileNo"
            label="手机号码："
            placeholder="请输入手机号码："
            type="tel"
            clearable
            disabled
          />
          <van-field
            v-model="formData.alipayNo"
            label="支付宝账号："
            placeholder="请选择支付宝账号"
            :right-icon="true ? '' : 'arrow'"
            disabled
          />
          <van-cell class="tips">
            <div slot="title" class="left" @click="alipayShow = true">
              <i class="iconfont iconleijijingyingshouyijieshi"></i
              >什么是支付宝账号
            </div>
            <div class="right" @click="gotoDownLoad">下载支付宝</div>
          </van-cell>
        </van-cell-group>
      </div>
      <div class="footer" v-if="false">
        <van-button type="primary" size="large">确定</van-button>
      </div>
    </div>
    <van-popup
      v-model="alipayShow"
      position="bottom"
      :style="{ height: '90%', background: 'none' }"
    >
      <div class="popup_content" @click="alipayShow = false">
        <div class="img_box">
          <img
            src="../../assets/imgs/externalassistance/zhifubao_img@2x.png"
            alt=""
          />
        </div>
        <div class="chacha_box">
          <img
            src="../../assets/imgs/externalassistance/chacha@2x.png"
            alt=""
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: 'receiver_information',
  data() {
    return {
      alipayShow: false,
      formData: {
        driverName: this.$route.query.driverName || '',
        idCard: this.$route.query.idCard || '',
        mobileNo: this.$route.query.mobileNo || '',
        alipayNo: this.$route.query.alipayNo || ''
      }
    }
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    },
    gotoDownLoad() {
      this.$router.push({ path: '/alipay_qrcode' })
    }
  }
}
</script>
<style lang="less" scoped>
.receiver_information_container {
  /deep/ .van-field__label {
    width: 120px;
    align-self: center;
  }
  /deep/ .van-button--warning {
    background: #ffba00;
    border: 1px solid #ffba00;
    font-size: 13px;
  }
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .content {
      flex: 1;
      .tips {
        .left {
          font-size: 14px;
          color: #d84b4c;
          .iconleijijingyingshouyijieshi {
            margin-right: 5px;
          }
        }
        .right {
          font-size: 14px;
          text-decoration: underline;
          color: #1581cf;
        }
      }
    }
    .footer {
      margin-bottom: 39px;
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
    }
  }
  .popup_content {
    width: 80%;
    text-align: center;
    margin: 0 auto;
    .img_box {
      width: 100%;
      height: 70%;
      img {
        width: 100%;
      }
    }
    .chacha_box {
      img {
        width: 30px;
      }
    }
  }
}
</style>
