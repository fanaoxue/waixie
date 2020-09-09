<template>
  <div class="choose_oil_card_container">
    <c-header>
      <van-nav-bar title="选择油卡" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>

    <div class="sub_page_base" v-show="pageShow">
      <div class="default" v-show="cardList.length == 0 && !this.showyouka">
        <img src="@/assets/imgs/externalassistance/wuyoukajilu_icon@2x.png" alt width="100" />
        <p>该车辆当前无油卡支付记录！</p>
        <p>请去新增油卡~~</p>
      </div>
      <div v-show="cardList.length == 0 && this.showyouka">
        <div class="title-warn">*提醒司机在“好运宝-个人中心-我的油卡”查看使用油卡</div>
        <div class="card-box">
          <div class="card card3">
            <div class="left">
              <div>
                <img
                  class="luge-icon"
                  src="@/assets/imgs/externalassistance/lugelogo_img@2x.png"
                  alt
                />
                电子油卡
              </div>
            </div>
            <div class="right">
              <van-button class="btn" type="primary" @click.native="useCardConfirm1()">使用</van-button>
            </div>
          </div>
        </div>
      </div>
      <div v-show="cardList.length != 0">
        <div class="title-warn">*提醒司机在“好运宝-个人中心-我的油卡”查看使用油卡</div>
        <div class="card-box" v-show="showyouka">
          <div class="card card3">
            <div class="left">
              <div>
                <img
                  class="luge-icon"
                  src="@/assets/imgs/externalassistance/lugelogo_img@2x.png"
                  alt
                />
                电子油卡
              </div>
            </div>
            <div class="right">
              <van-button class="btn" type="primary" @click.native="useCardConfirm1()">使用</van-button>
            </div>
          </div>
        </div>
        <div class="card-box">
          <div
            class="card"
            v-for="(item, val) in cardList"
            :key="val"
            :class="
              item.oilBigType == '4'
                ? 'card3'
                : item.oilBgType == '2'
                ? 'card1'
                : 'card2'
            "
          >
            <div class="left">
              <span v-show="item.isSelfOrg == '0'">
                <img
                  src="@/assets/imgs/externalassistance/benqiye_img@2x.png"
                  alt
                  style="width: 50px;position: absolute;left: -10px;top: -19px;"
                />
                <p
                  style="position: absolute;top: -16px;left: -7px;font-size: 12px;letter-spacing: 2px;"
                >本企业</p>
              </span>
              <div>
                <img
                  class="luge-icon"
                  v-if="item.oilBigType == '4'"
                  src="@/assets/imgs/externalassistance/lugelogo_img@2x.png"
                  alt
                />
                {{ item.oilTypeName }}
              </div>
              <div class="cardNum">{{ item.oilCardNo }}</div>
            </div>
            <div class="right">
              <van-button class="btn" type="primary" @click.native="useCardConfirm(item)">使用</van-button>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <van-button type="primary" @click.native="newAddCard()" size="large">绑定油卡</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { selectOilCard, openElectronicOilCard } from '@/api/apiOilCard.js';
import bus from '@/assets/js/bus.js';
export default {
  name: 'choose_oil_card',
  data() {
    return {
      pageShow: false,
      belongActSys: this.$route.query.belongActSys, //路由传来的所属账户体系
      prepaymentsOilCard: this.$route.query.prepaymentsOilCard, //预付油卡金额
      cartBadgeNo: this.$route.query.cartBadgeNo,
      driverName: this.$route.query.driverName,
      mobileNo: this.$route.query.mobileNo,
      cardList: [], //卡列表
      chooseOilCardItem: {}, //已选择油卡
      showyouka: false, //是否显示默认油卡
    };
  },
  computed: {},
  created() {},
  mounted() {
    //进入选择油卡页面接口--3050
    this.dataInit();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    //初始化数据
    dataInit() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      selectOilCard({
        belongActSys: this.belongActSys,
        cartBadgeNo: this.cartBadgeNo,
        driverMobileNo: this.mobileNo,
      })
        .then(res => {
          if (res.data.reCode === '0') {
            this.cardList = res.data.result.list;
            //显示的规则是 必须在白名单内
            // if (res.data.result.isOilWhite == '1') {
            if (this.cardList.length != '0') {
              let arr = [];
              this.cardList.forEach(e => {
                arr.push(e.oilBigType); //[2,2,2,4....]
              });
              if (arr.indexOf('4') > -1) {
                //存在 油卡
                this.showyouka = false;
              } else {
                //不存在 油卡
                this.showyouka = true;
              }
            } else {
              //展示没有卡号的电子油卡
              this.showyouka = true;
            }
            // }
          }
          this.pageShow = true;
        })
        .catch(() => {
          this.$toast('网络异常，请稍后再试~~~');
          this.pageShow = true;
        });
    },
    //绑定油卡
    newAddCard() {
      this.$router.push({
        path: '/add_oil_card',
        query: {
          prepaymentsOilCard: this.prepaymentsOilCard,
          cartBadgeNo: this.cartBadgeNo,
          belongActSys: this.belongActSys,
          driverName: this.driverName,
          mobileNo: this.mobileNo,
        },
      });
    },
    useCardConfirm(item) {
      // 电子油卡，且未使用过
      if (item.isUseEleOil === '0' && item.oilBigType === '4') {
        this.$klb.confirm.show({
          // eslint-disable-next-line quotes
          title: `确认使用`,
          // eslint-disable-next-line quotes
          content: `<p style='text-align:left;font-size:16px;font-family:PingFang-SC-Bold;font-weight:bold;color:rgba(69,69,69,1);'>路歌电子油卡</p><p style='text-align:left;font-size:16px;font-family:PingFang-SC-Medium;font-weight:500;color:rgba(255,186,0,1);'>请提醒司机去指定站点加油!</p>`,
          confirmText: '确认',
          cancelText: '取消',
          onConfirm: () => {
            this.useCard(item);
          },
          onCancel: () => {},
        });
      } else {
        this.useCard(item);
      }
    },
    //没有油卡的时候,走16006接口去开通油卡,再使用默认空的油卡
    useCardConfirm1() {
      if (this.driverName == '' || this.driverName == undefined) {
        this.$toast('司机姓名不能为空！', 'middle');
        return;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      openElectronicOilCard({
        driverMobileNo: this.mobileNo,
        driverName: this.driverName,
      })
        .then(res => {
          if (res.data.reCode == '0') {
            this.chooseOilCardItem = {
              oilBigType: '4',
              oilCardNo: res.data.result.oilCardNo,
            };
            this.useCard(this.chooseOilCardItem);
          } else {
            this.$klb.confirm.show({
              // eslint-disable-next-line quotes
              title: `确认使用`,
              // eslint-disable-next-line quotes
              content: `<p style='text-align:center;font-size:16px;font-family:PingFang-SC-Medium;font-weight:500;color:rgba(255,186,0,1);'>网络异常，请再次使用!</p>`,
              confirmText: '确认',
              cancelText: '取消',
              onConfirm: () => {
                this.useCardConfirm1();
              },
              onCancel: () => {},
            });
          }
        })
        .catch(() => {
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          this.$toast('网络异常，请稍后再试~~~', 'middle');
        });
    },
    //使用油卡-携带卡号
    useCard(item) {
      bus.$emit('selectOilCard', item);
      this.chooseOilCardItem = item;
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.choose_oil_card_container {
  .sub_page_base {
    background: #fff;
    padding-bottom: 80px;
    .title-warn {
      width: 95%;
      margin: 1rem auto;
      font-size: 14px;
      color: rgba(255, 51, 51, 1);
    }
    .default {
      margin: 100px auto 0px;
      width: 66%;
      text-align: center;
      p {
        color: #797979;
      }
    }
    .card1 {
      width: 95%;
      height: 6.4375rem;
      margin: 10px auto;
      background: url('../../assets/imgs/externalassistance/shiyouka_img@2x.png')
        no-repeat center center;
      background-size: 100% 100%;
      position: relative;
      .left {
        width: 70%;
        float: left;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 10px;
        margin-top: -25px;
        .cardNum {
          margin-top: 10px;
        }
      }
      .right {
        .money {
          display: inline-block;
          position: absolute;
          top: 15%;
          width: 40%;
          right: 0;
          text-align: center;
          color: #202020;
          span {
            font-size: 18px;
            font-weight: bold;
            margin-right: 5px;
          }
        }
        .btn {
          width: 25%;
          height: 30px;
          line-height: 30px;
          float: right;
          background: #1e66b4;
          color: #fff;
          position: absolute;
          top: 50%;
          right: 10px;
        }
      }
    }
    .card2 {
      width: 95%;
      height: 6.4375rem;
      margin: 10px auto;
      background: url('../../assets/imgs/externalassistance/shihuaka_img@2x.png')
        no-repeat center center;
      background-size: 100% 100%;
      position: relative;
      .left {
        width: 70%;
        float: left;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 10px;
        margin-top: -25px;
        .cardNum {
          margin-top: 10px;
        }
      }
      .right {
        .money {
          display: inline-block;
          position: absolute;
          top: 15%;
          width: 40%;
          right: 0;
          text-align: center;
          color: #202020;
          span {
            font-size: 18px;
            font-weight: bold;
            margin-right: 5px;
          }
        }
        .btn {
          width: 25%;
          height: 30px;
          line-height: 30px;
          float: right;
          background: #1e66b4;
          color: #fff;
          position: absolute;
          top: 50%;
          right: 10px;
        }
      }
    }
    .card3 {
      width: 95%;
      height: 6.4375rem;
      margin: 10px auto;
      background: url('../../assets/imgs/externalassistance/chaiyouka_img@2x.png')
        no-repeat center center;
      background-size: 100% 100%;
      position: relative;
      .luge-icon {
        height: 1rem;
        vertical-align: middle;
        margin-right: 0.5rem;
      }
      .left {
        width: 70%;
        float: left;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 10px;
        margin-top: -25px;
        .cardNum {
          margin-top: 10px;
        }
      }
      .right {
        .money {
          display: inline-block;
          position: absolute;
          top: 15%;
          width: 40%;
          right: 0;
          text-align: center;
          color: #202020;
          span {
            font-size: 18px;
            font-weight: bold;
            margin-right: 5px;
          }
        }
        .btn {
          width: 25%;
          height: 30px;
          line-height: 30px;
          float: right;
          background: #1e66b4;
          color: #fff;
          position: absolute;
          top: 50%;
          right: 10px;
        }
      }
    }
    .card-box .card:first-child {
      margin-top: 0;
    }
    .footer {
      background: #fff;
      position: fixed;
      bottom: 0px;
      // margin-bottom: 39px;
      // height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 10px 25px;
    }
  }
}
</style>
