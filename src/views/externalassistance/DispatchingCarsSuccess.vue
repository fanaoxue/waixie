<template>
  <div class="dispatching_cars_success_container">
    <c-header>
      <van-nav-bar title="派车成功" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="content">
        <img
          class="image"
          src="@/assets/imgs/externalassistance/jiandancheng_icon@2x.png"
          alt
          srcset
        />
        <div>派车已成功</div>
        <div
          class="debangPaiche"
          v-show="permission.orgCfg718 === '49' && isFromH5 === '1'"
        >您已分配此订单给车辆：{{write_car_information.cartBadgeNo}}</div>
      </div>
      <div class="footer">
        <div class="button_box">
          <van-button plain type="primary" size="large" @click="goonDeliverCars">继续派车</van-button>
        </div>
        <div class="button_box">
          <van-button plain type="primary" size="large" @click="checkWaybill">查看运单</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AppFinish, jumpIndex } from '@/assets/js/app';
import { finishCallBack } from '@/assets/js/app';
import { pushCarInfo } from '../../api/externalassistanceapi';
export default {
  name: 'dispatching_cars_success',
  data() {
    return {
      isFromH5: this.$route.query.isFromH5, //0 否 1 是
      taxWaybillId: this.$route.query.taxWaybillId, // 派车成功的运单ID
    };
  },
  computed: {
    ...mapGetters(['permission', 'write_car_information']),
  },
  mounted() {
    // if (this.permission.orgCfg718 === '49') {
    //   this.dataInit();
    // }
  },
  methods: {
    dataInit() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      pushCarInfo({ taxWaybillId: this.taxWaybillId })
        .then(res => {})
        .catch(err => {});
    },
    // 导航左侧点击
    onClickLeft() {
      this.goonDeliverCars();
    },
    // 继续派车
    goonDeliverCars() {
      if (this.isFromH5 === '1') {
        try {
          MtaH5.clickStat('wx_goon_dispatching_cars_q');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        if (this.permission.orgCfg718 === '49') {
          this.$router.push({ path: '/MySourceOfGoods' });
        } else {
          finishCallBack({
            methodName: 'javascript:AppJSApi_finishCallBack()',
          });
        }
      } else {
        try {
          MtaH5.clickStat('wx_goon_dispatching_cars_w');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        let json = {
          selectedIndex: '0',
          waybillTopIndex: '', // 0：自有运单 1：外协运单
          subIndex: '0',
          refreshList: ['0'],
        };
        jumpIndex(json);
      }
    },
    // 查看运单
    checkWaybill() {
      try {
        MtaH5.clickStat('wx_checkwaybill_w');
      } catch (error) {
        console.log(JSON.stringify(error));
      }
      let json = {
        selectedIndex: '0',
        waybillTopIndex: '', // 0：自有运单 1：外协运单
        subIndex: '1',
        refreshList: ['0', '1'],
      };
      jumpIndex(json);
    },
  },
};
</script>
<style lang="less" scoped>
.dispatching_cars_success_container {
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: #fff;
    width: 100vw;
    .content {
      text-align: center;
      font-size: 17px;
      margin-bottom: 66px;
      margin-top: 60px;
      .image {
        // display: inline-block;
        // margin: 0 auto;
        width: 84px;
        height: 60px;
        margin-bottom: 18px;
      }
      .debangPaiche {
        margin-top: 20px;
      }
    }
    .footer {
      box-sizing: border-box;
      .button_box {
        margin: 0 auto;
        width: 175px;
        height: 45px;
        margin-bottom: 13px;
      }
    }
  }
}
</style>
