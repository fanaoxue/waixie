<template>
  <div class="car_master_receive_msg">
    <c-header class="header">
      <van-nav-bar left-arrow fixed @click-left="onClickLeft" title="收款人信息"></van-nav-bar>
    </c-header>
    <div class="content sub_page_base" v-show="pageState">
      <div class="card_list" v-if="dataList.length > 0">
        <van-radio-group v-model="choose">
          <div
            class="card"
            v-for="(item,index) in dataList"
            :key="index"
            @click="chooseItem(item,index)"
          >
            <div class="card_content">
              <div class="card_left">
                <div class="driverInfo">
                  <div class="driverName">{{item.payeeName}}</div>
                  <img
                    src="../../assets/imgs/DB/qianbao_icon@2x.png"
                    alt
                    class="qianbao_icon"
                    v-show="item.acctType != 6"
                  />
                  <img src="../../assets/imgs/DB/shoukuanren_icon@2x.png" alt class="header_icon" />
                  <div class="isCarMaster" v-show="item.acctType == 6">车队钱包</div>
                </div>
                <div class="idCard">身份证：{{item.payeeIdCard}}</div>
                <div class="qianbaoType">好运宝钱包</div>
                <div class="bankNo">{{item.payeeBankNo}}</div>
              </div>
            </div>
            <van-radio :name="index" checked-color="#15499A" />
          </div>
        </van-radio-group>
      </div>
      <div class="no_data" v-else>
        <img
          src="../../assets/imgs/DB/ydzz_konghezi@2x.png"
          alt
          width="30%"
          style="margin-bottom: 30px;"
        />
        <div>暂无收款人信息~~</div>
      </div>
      <div class="footer" v-show="dataList.length != 0">
        <van-button type="default" @click="saveData" class="btn" :disabled="disabledState">保存</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { HYB_WALLET } from '../../assets/js/consts';
import { getCarMasterInfo } from '../../api/applyForPayment';
export default {
  data() {
    return {
      pageState: false, //页面展示状态
      dataList: [],
      choose: '',
      collectionFlagCfg: this.$route.query.collectionFlagCfg,
      mobileNo: '',
      payeeName: '',
      driverName: '',
      cartBadgeNo: '',
      clickData: {},
      disabledState: true,
    };
  },
  mounted() {},
  activated() {
    console.log('触发钩子');
    this.mobileNo = this.$route.query.mobileNo;
    this.payeeName = this.$route.query.payeeName;
    this.driverName = this.$route.query.driverName;
    this.cartBadgeNo = this.$route.query.cartBadgeNo;
    this.dataInit();
  },
  watch: {
    choose(val) {
      if (val == 0 || val == 1) {
        this.disabledState = false;
      } else {
        this.disabledState = true;
      }
    },
  },
  computed: {
    carTeamInfo() {
      return this.$store.state.carTeamMasterInfo.carTeamInfo;
    },
  },
  methods: {
    dataInit() {
      this.$store.commit('updateLoadingStatus', { isLoading: true });
      let json = {
        mobileNo: this.mobileNo,
        payeeName: this.payeeName,
        driverName: this.driverName,
        cartBadgeNo: this.cartBadgeNo,
        advancePayState: '1',
      };
      getCarMasterInfo(json)
        .then(res => {
          this.pageState = true;
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          if (res.data.reCode === '0') {
            if (JSON.stringify(res.data.result) != '{}') {
              this.dataList = res.data.result.payeeList;
              let obj = {};
              if (this.dataList.length == 2) {
                Object.assign(obj, this.dataList[1]);
              } else if (this.dataList.length == 1) {
                Object.assign(obj, this.dataList[0]);
              } else {
                Object.assign(obj, {});
              }
              this.choose = this.dataList.findIndex(item => {
                return item.payeeName === this.carTeamInfo.payeeName;
              });
              if (this.choose === 0) {
                this.clickData = this.dataList[0];
              } else if (this.choose === 1) {
                this.clickData = this.dataList[1];
              }
            }
          } else {
            this.$vux.toast.text(res.data.reInfo, 'middle');
          }
        })
        .catch(err => {
          this.pageState = true;
          this.$store.commit('updateLoadingStatus', { isLoading: false });
          console.log(err);
        });
    },
    chooseItem(item, index) {
      this.choose = index;
      this.clickData = item;
    },
    saveData() {
      this.$store.commit('carTeamMasterInfo/setcarTeamInfo', this.clickData);
      this.$router.go(-1);
    },
    onClickLeft() {
      this.saveData();
    },
  },
};
</script>

<style lang="less" scoped>
.car_master_receive_msg {
  width: 100%;
  background-color: #efefef;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  .card_list {
    margin: 20px 10px;
    height: auto;
    .card {
      width: 100%;
      height: auto;
      background: rgba(255, 255, 255, 1);
      border-radius: 10px;
      margin-bottom: 10px;
      padding: 10px 10px 10px 30px;
      box-sizing: border-box;
      position: relative;
      .card_content {
        .driverInfo {
          position: relative;
          line-height: 1.5em;
          .header_icon {
            position: absolute;
            top: 4px;
            left: -20px;
          }
          .isCarMaster {
            display: inline-block;
            color: #ffba00;
            font-size: 14px;
            padding: 0px 6px;
            border: 1px solid rgba(255, 186, 0, 1);
            border-radius: 10px;
          }
        }
        .idCard {
          line-height: 1.5em;
        }
        .qianbaoType {
          line-height: 1.5em;
        }
        .bankNo {
          line-height: 1.5em;
        }
        .header_icon {
          width: 16px;
          vertical-align: middle;
        }

        .driverName {
          display: inline-block;
          margin-right: 5px;
        }
        .qianbao_icon {
          width: 16px;
          vertical-align: middle;
        }
      }
      .van-radio {
        position: absolute;
        right: 25px;
        top: 50px;
      }
    }
  }
  .no_data {
    text-align: center;
    margin-top: 50px;
  }
  .footer {
    text-align: center;
    margin-top: 100px;
    .btn {
      width: 90%;
    }
    .van-button--default {
      background-color: #15499a;
      color: #ffffff;
      font-size: 16px !important;
      border-radius: 6px;
    }
    .van-button--disabled {
      opacity: 1;
      background-color: #cccccc;
    }
  }
}
</style>