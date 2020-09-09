<template>
  <div class="add_oil_card_container">
    <c-header>
      <van-nav-bar title="绑定油卡" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="search_ipt_cxt">
        <div class="search_ipt_style">
          <i class="iconfont iconsousuo"></i>
          <van-field title placeholder="请输入卡号后四位" v-model="condition"></van-field>
        </div>
        <div class="search-control-btn" @click="searchBtn()">搜索</div>
      </div>
      <div class="gray"></div>
      <div class="default" v-show="arrayList.length == 0">
        <img :src="srcStatic" alt width="100" />
        <p>当前企业无可用油卡记录！</p>
        <p>请联系快路宝客服开卡</p>
      </div>
      <div class="card" v-show="!(arrayList.length == 0 && searchList.length == 0)">
        <span
          v-show="
            arrayList.length != 0 && searchList.length == 0 && noInfo == false
          "
        >
          <div
            v-for="(item, val) in arrayList"
            :key="val"
            class="card-box"
            :class="
              item.oilBgType == '2' || item.oilBgType == '3' ? 'card2' : 'card1'
            "
          >
            <div class="left">
              <div>{{ item.oilTypeName }}</div>
              <div class="cardNum">{{ item.oilCardNo }}</div>
              <p class="money">
                ￥
                <span>{{ item.preOilBalance }}</span>余额
              </p>
              <div v-show="item.isBind == '0'" class="info">
                <div>车牌号码：{{ item.driverCarNo }}</div>
                <div>司机姓名：{{ item.driverName }}</div>
                <a @click="phoneCall(item.oilMobile)" class="phone-call">
                  电话号码：{{ item.oilMobile
                  }}
                  <img
                    v-show="item.oilMobile"
                    src="../../assets/imgs/externalassistance/dianhua_icon@2x.png"
                  />
                </a>
              </div>
            </div>
            <div class="right">
              <van-button
                type="primary"
                :mini="true"
                @click.native="
                  bindCardConfirm(val, item.oilTypeName, item.oilCardNo, item)
                "
              >绑定</van-button>
            </div>
            <img :src="[item.isBind == '-1' ? src1 : src2]" alt class="img" />
          </div>
        </span>
        <span v-show="searchList.length != 0">
          <div
            v-for="(item, val) in searchList"
            :key="val"
            class="card-box"
            :class="
              item.oilBgType == '2' || item.oilBgType == '3' ? 'card2' : 'card1'
            "
          >
            <div class="left">
              <div>{{ item.oilTypeName }}</div>
              <div class="cardNum">{{ item.oilCardNo }}</div>
              <p class="money">
                ￥
                <span>{{ item.preOilBalance }}</span>余额
              </p>
              <div v-show="item.isBind == '0'">
                <div>车牌号码：{{ item.driverCarNo }}</div>
                <div>司机姓名：{{ item.driverName }}</div>
                <a @click="phoneCall(item.oilMobile)" class="phone-call">
                  电话号码：{{ item.oilMobile
                  }}
                  <img
                    v-show="item.oilMobile"
                    src="../../assets/imgs/externalassistance/dianhua_icon@2x.png"
                  />
                </a>
              </div>
            </div>
            <div class="right">
              <van-button
                type="primary"
                :mini="true"
                @click.native="
                  bindCardConfirm(val, item.oilTypeName, item.oilCardNo, item)
                "
              >绑定</van-button>
            </div>
            <img :src="[item.isBind == '-1' ? src1 : src2]" alt class="img" />
          </div>
        </span>
        <span v-show="noInfo == true">
          <div class="default">
            <img :src="srcStatic" alt width="100" />
            <p>未搜索到匹配的油卡</p>
          </div>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import { newAddOilCard, bindOilCard } from '@/api/apiOilCard';
import bus from '@/assets/js/bus.js';
import { AppGotoTell } from '@/assets/js/app.js';
export default {
  name: 'add_oil_card',
  data() {
    return {
      condition: '', //搜索内容
      belongActSys: this.$route.query.belongActSys, //路由传来的所属账户体系
      prepaymentsOilCard: this.$route.query.prepaymentsOilCard, //预付油卡金额
      cartBadgeNo: this.$route.query.cartBadgeNo, //车牌号
      driverName: this.$route.query.driverName, //司机姓名
      mobileNo: this.$route.query.mobileNo, //司机手机号
      arrayList: [],
      searchList: [], //搜索的集合
      oilName: '', //弹框的卡名字
      cardNo: '', //弹框的卡号
      noInfo: false,

      index: '', //点击绑定的索引

      srcStatic: require('@/assets/imgs/externalassistance/youkajilu_icon@2x.png'), //没有油卡的背景图
      src1: require('@/assets/imgs/externalassistance/weibangding_img@2x.png'), //未绑定的图片
      src2: require('@/assets/imgs/externalassistance/yibangding_img@2x.png'), //已绑定的图片
      chooseOilCardItem: {}, //已经选择的油卡
    };
  },
  watch: {
    condition() {
      if (this.condition == '') {
        this.searchList = [];
        this.noInfo = false;
      }
    },
  },
  mounted() {
    this.dataInit();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    phoneCall(oilMobile) {
      if (oilMobile) {
        // eslint-disable-next-line no-undef
        AppGotoTell(oilMobile);
      }
    },
    //页面数据初始化
    dataInit() {
      //新增油卡接口--16002
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      newAddOilCard({
        prepaymentsOilCard: this.prepaymentsOilCard,
        cartBadgeNo: this.cartBadgeNo,
        belongActSys: this.belongActSys,
      })
        .then(res => {
          if (res.data.reCode === '0') {
            this.arrayList = res.data.result.list;
          } else {
            this.$vux.alert.show({
              title: '提示',
              buttonText: '知道了',
              content: res.data.reInfo,
            });
          }
        })
        .catch(() => {});
    },
    bindCardConfirm(index, item1, item2, item) {
      if (item.isBind == '0') {
        this.$klb.confirm.show({
          title: '确认绑定',
          content: `<div style="text-align:left;"><p style='color:#454545;line-height:150%;'><span style="font-weight:bold;">${item1}</span></br>卡号：${item2}</p><p style='color:#454545;line-height:150%;font-family:PingFang-SC-Medium;color:rgba(255,186,0,1);margin-top:4px;'>确认解除之前与"${item.driverName}，${item.driverCarNo}"的绑定关系？</p></div>`,
          confirmText: '确认',
          cancelText: '取消',
          onConfirm: () => {
            this.bindCard(index, item1, item2, item);
          },
          onCancel: () => {},
        });
      } else {
        this.bindCard(index, item1, item2, item);
      }
    },
    //绑定油卡
    bindCard(index, item1, item2, item) {
      this.index = index;
      this.oilName = item1;
      this.cardNo = item2;
      this.chooseOilCardItem = item;
      this.onConfirm(this.index);
    },
    //搜索功能--最少后四位才能查询
    searchBtn() {
      let reg = /^[0-9]+$/;
      if (this.condition != '' && !reg.test(this.condition)) {
        this.$toast('请输入数字', 'middle');
        return false;
      }
      if (this.condition.length < 4) {
        this.$toast('请输入卡号最少后四位', 'middle');
        return false;
      } else {
        let sousuoweihao;
        let arr = [];
        for (let key in this.arrayList) {
          let cardNo = this.arrayList[key].oilCardNo;
          sousuoweihao = cardNo.substring(
            cardNo.length - this.condition.length,
          );
          if (sousuoweihao == this.condition) {
            //有的时候，返回对应的key值
            arr.push(this.arrayList[key]);
          }
        }
        this.searchList = [];
        this.searchList = arr;

        if (this.searchList.length == 0) {
          this.noInfo = true;
        } else {
          this.noInfo = false;
        }
      }
    },
    //取消按钮
    onCancel() {
      //取消则关闭弹框
      this.show = false;
    },
    //确定按钮
    onConfirm(val) {
      let oilCardNo = this.arrayList[val].oilCardNo;
      if (this.searchList.length != 0) {
        oilCardNo = this.searchList[val].oilCardNo;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      //调用绑定接口,调用接口成功直接返回结算信息页面
      bindOilCard({
        oilCardNo: oilCardNo,
        cartBadgeNo: this.cartBadgeNo,
        driverName: this.driverName,
        mobileNo: this.mobileNo,
      })
        .then(res => {
          if (res.data.reCode === '0') {
            setTimeout(() => {
              this.usebtn(oilCardNo);
            }, 1500);
          }
        })
        .catch(() => {});
    },
    usebtn(oilCardNo) {
      bus.$emit('selectOilCard', { oilCardNo });
      this.$router.go(-2);
    },
    //有一个筛选功能
  },
};
</script>

<style lang="less">
.add_oil_card_container {
  overflow-x: hidden;
  width: 100%;
  background-color: #fff;
  position: absolute;
  top: 0px;
  // min-height: 100%;
  height: auto;
  .van-cell {
    padding: 0;
  }
  .default {
    // margin: 10px auto 0;
    background: #fff;
    text-align: center;
    p {
      color: #797979;
    }
    img {
      margin-top: 40px;
    }
  }
  .card {
    background: #fff;
    padding-top: 1px;
    margin-top: 10px;
    padding-bottom: 10px;
    .card-box {
      width: 95%;
      margin: 10px auto 0;
      padding: 10px 0;
      background-size: 100% 100%;
      position: relative;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .info {
        font-size: 14px;
        font-family: PingFang-SC-Bold;
        color: rgba(32, 32, 32, 1);
      }
      .left {
        width: 70%;
        color: #fff;
        line-height: 1.5em;
        .money {
          color: #202020;
          span {
            font-size: 18px;
            font-weight: bold;
            margin-right: 5px;
          }
        }
        .phone-call {
          color: #202020;
          display: flex;
          align-items: center;
          img {
            height: 1rem;
            margin-left: 10px;
          }
        }
      }
      .right {
        align-self: flex-end;
        .weui-btn {
          line-height: 30px;
          background: #1e66b4;
          color: #fff;
        }
      }
      .img {
        position: absolute;
        right: 0px;
        top: 0;
        width: 65px;
      }
    }
  }
  .search_ipt_cxt {
    background: #fff;
    display: flex;
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding: 12px;
    .search_ipt_style {
      display: flex;
      align-items: center;
      width: 80%;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #bfbfbf;
      /deep/ .van-cell__value {
        margin-left: 0px !important;
      }
      .iconsousuo {
        color: #15499a;
        margin-left: 5px;
        font-size: 24px;
      }
      input::-webkit-input-placeholder {
        color: #9f9f9f;
        font-size: 14px;
      }
    }
    .search-control-btn {
      padding-left: 12px;
      color: #15499a;
    }
  }
  .card1 {
    background: url('../../assets/imgs/externalassistance/shihuaka_img@2x.png')
      no-repeat center center;
  }
  .card2 {
    background: url('../../assets/imgs/externalassistance/shiyouka_img@2x.png')
      no-repeat center center;
  }
  /deep/.van-button {
    width: 68px;
    height: 28px;
  }
}
</style>
