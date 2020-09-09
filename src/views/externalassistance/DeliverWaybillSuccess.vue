<template>
  <div class="deliver_waybill_success">
    <c-header isShowTitle class="header">
      <van-nav-bar title="派单成功" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="success_note">
        <img :src="successLogo" alt height="55px" />
        <p>指派成功！</p>
      </div>
      <div class="success_button">
        <van-button plain type="primary" @click="goOnDeliverWaybill">继续派单</van-button>
        <van-button plain type="primary" @click="checkWaybill">查看运单</van-button>
        <van-button plain type="primary" @click="addToTemplate" :disabled="disabled">添加到常用模板</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { jumpIndex, AppFinish } from '@/assets/js/app.js'
import { addTemplate } from '../../api/template.js'
export default {
  name: 'DeliverWaybillSuccess',
  data() {
    return {
      msg: '派单成功',
      disabled: false,
      successLogo: require('../../assets/imgs/jiandancheng_icon@2x.png')
    }
  },
  computed: {
    ...mapGetters(['waybill_information'])
  },
  mounted() {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      // AppFinish(-1)
      this.$router.go(-2)
    },
    // 继续派单
    goOnDeliverWaybill() {
      // this.$router.replace({
      //   path: '/deliver_waybill'
      // })
      try {
        MtaH5.clickStat('wx_goon_deliverwaybill')
      } catch (error) {
        console.log(JSON.stringify(error))
      }
      this.$router.go(-2)
    },
    // 查看运单
    checkWaybill() {
      try {
        MtaH5.clickStat('wx_checkwaybill_q')
      } catch (error) {
        console.log(JSON.stringify(error))
      }
      let json = {
        selectedIndex: '0',
        waybillTopIndex: '1', // 0：自有运单 1：外协运单
        subIndex: '0',
        refreshList: ['0']
      }
      jumpIndex(json)
    },
    // 添加模板
    addToTemplate() {
      try {
        MtaH5.clickStat('wx_addtemplate')
      } catch (error) {
        console.log(JSON.stringify(error))
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      let json = {
        source: '2',
        isAll: '0',
        templateType: '1'
      }
      let JsonData = Object.assign(this.waybill_information, json)
      addTemplate(JsonData)
        .then(res => {
          if (res.data.reCode == '0') {
            this.$toast('添加模板成功！')
            this.disabled = true
          } else {
            this.$toast(res.data.reInfo)
          }
        })
        .catch(err => {})
    }
  }
}
</script>
<style lang="less" scoped>
.deliver_waybill_success {
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
