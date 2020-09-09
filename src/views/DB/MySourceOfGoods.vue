<template>
  <div class="MySourceOfGoods">
    <c-header>
      <!-- <van-nav-bar
        title="我的订单"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar> -->
      <van-search
          v-model="condition"
          placeholder="车型/金额/货物名称/发货方/地址"
          @focus="onFocus()"
          background="#15499A"
        >
          <template #left>
            <div class="goback" @click="onClickLeft">
              <img src="../../assets/imgs/DB/fanhui_icon@2x.png" alt height="100%"/>
            </div>
          </template>
          <template #left-icon>
            <i class="iconfont iconsousuo"></i>
          </template>
        </van-search>
    </c-header>
    <div class="collected_warpper">
      <van-tabs
        v-model="active"
        @click="tabsClick"
        color="#15499A"
        title-active-color="#15499A"
        title-inactive-color="#121212"
        line-width="44"
        line-height="2"
      >
        <van-tab
          title="待报价"
          :badge="Number(dbjCount) === 0 ? '' : dbjCount"
        ></van-tab>
        <van-tab title="待确认"></van-tab>
        <van-tab
          title="待派车"
          :badge="Number(dpcCount) === 0 ? '' : dpcCount"
        ></van-tab>
        <van-tab title="已结束"></van-tab>
      </van-tabs>
      <div class="collected_list_warpper">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model="isUpLoading"
            :finished="upFinished"
            :immediate-check="false"
            :finished-text="finishedText"
            :offset="offset"
            @load="onLoadList"
          >
            <van-checkbox-group v-model="checkedList">
              <div class="common_list" v-if="active === 0">
                <WaitQuotationCard
                  v-for="(item, index) in dataList"
                  :key="index"
                  :item="item"
                  :time-diff="timeDiff"
                  @goQuotation="goQuotation"
                ></WaitQuotationCard>
              </div>
              <div class="common_list" v-if="active === 1">
                <WaitConfirmCard
                  v-for="(item, index) in dataList"
                  :key="index"
                  :item="item"
                  @goEditQuotation="goEditQuotation"
                ></WaitConfirmCard>
              </div>
              <div class="common_list" v-if="active === 2">
                <WaitCarCard
                  v-for="(item, index) in dataList"
                  :key="index"
                  :item="item"
                  @showDetail="showDetail"
                  @goWaybillInformation="goWaybillInformation"
                  @supplyWaybill="supplyWaybill"
                ></WaitCarCard>
              </div>
              <div class="common_list" v-if="active === 3">
                <OverCard
                  v-for="(item, index) in dataList"
                  :key="index"
                  :item="item"
                  @showDetail="showDetail"
                ></OverCard>
              </div>
              <div class="nodata" v-if="dataList.length === 0 && firstLoaded">
                暂无相关数据~
              </div>
            </van-checkbox-group>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="footer" v-if="active === 2 && dataList.length !== 0">
        <div class="text_box">
          <div>
            已选:
            <span>{{ checkedList.length }}</span
            >单
          </div>
          <div>
            应收金额
            <span>{{ checkedMoney }}</span
            >元
          </div>
        </div>
        <div class="btn_box">
          <van-button
            class="btn"
            :class="
              Number(checkedList.length) === 0 ? 'btn_disabled' : 'btn_primary'
            "
            size="small"
            type="primary"
            @click="supplySelectWaybill"
            >关联运单</van-button
          >
          <van-button
            class="btn"
            :class="
              Number(checkedList.length) === 0 ? 'btn_disabled' : 'btn_primary'
            "
            size="small"
            type="primary"
            @click="goWaybillInformation('1')"
            >去派车</van-button
          >
        </div>
      </div>
    </div>
    <Confirm
      v-model="confirmShow"
      :show-confirm-button="false"
      :show-cancel-button="false"
      @on-confirm="onConfirm"
      @on-cancel="onCancel"
      @on-close="onCancel"
      title="已关联运单信息"
    >
      <div class="confirm_container">
        <div class="title">
          <div class="location">
            <i class="iconfont icondidiandingwei"></i>
          </div>
          <div class="location_text">
            <span>{{ confirmData.startPlace }}</span>
            <i class="iconfont icondidiandaoxiang"></i>
            <span>{{ confirmData.endPlace }}</span>
          </div>
        </div>
        <div class="item">
          <div class="label"><span class="text">运单号</span>：</div>
          <div class="value">{{ confirmData.taxWaybillNo }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">车牌号码</span>：</div>
          <div class="value">{{ confirmData.cartBadgeNo }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">司机信息</span>：</div>
          <div class="value">{{ confirmData.driverInfo }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">货物信息</span>：</div>
          <div class="value">{{ confirmData.goodsInfo }}</div>
        </div>
        <div class="item item_money">
          <div class="label"><span class="text">应付运费</span>：</div>
          <div class="value">{{ confirmData.freight }}元</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">关联时间</span>：</div>
          <div class="value">{{ confirmData.relationTime }}</div>
        </div>
      </div>
    </Confirm>
  </div>
</template>

<script>
import bus from '@/assets/js/bus.js';
import WaitQuotationCard from './components/WaitQuotationCard';
import WaitConfirmCard from './components/WaitConfirmCard';
import WaitCarCard from './components/WaitCarCard';
import OverCard from './components/OverCard';
import Confirm from '@/common/components/confirm/confirm';
import {
  getMySourceOfGoodsList,
  getSupplyDetails,
  goQuotationStatistics,
} from '@/api/DB.js';
import { AppFinish, setNativeHead } from '@/assets/js/app';
export default {
  name: 'MySourceOfGoods',
  components: {
    WaitQuotationCard,
    WaitConfirmCard,
    WaitCarCard,
    OverCard,
    Confirm,
  },
  data() {
    return {
      confirmShow: false,
      confirmData: {},
      checkedAll: false,
      checkedList: [], // 收款集合
      dataList: [],
      timeDiff: '0',
      firstLoaded: false,
      refreshing: false,
      isUpLoading: false, // 上拉加载
      upFinished: true, // 上拉加载完毕
      offset: 10, // 滚动条与底部距离小于 offset 时触发load事件
      pageIdx: '1',
      pageSize: '15',
      condition: '',
      active: Number(this.$route.query.active) || 0,
      dbjCount: '',
      dpcCount: '',
    };
  },
  computed: {
    checkedMoney() {
      if (this.checkedList.length > 0) {
        return this.checkedList
          .reduce(function(sum, currentValue) {
            return sum + Number(currentValue.freight);
          }, 0)
          .toFixed(2);
      } else {
        return 0;
      }
    },
    sendAble() {
      return this.checkedList.length !== 0;
    },
    finishedText() {
      return this.dataList.length > 0 ? '没有更多了~' : '';
    },
  },
  watch: {
    checkedList(newVal, oldVal) {
      if (newVal.length > oldVal.length && oldVal.length > 0) {
        if (oldVal.length === 10) {
          this.$toast('最多选择10条！');
          this.checkedList = oldVal;
        } else if (
          !this.comparisonDataType(newVal[newVal.length - 1], oldVal[0])
        ) {
          this.$toast('您选择的订单类型不一致！请重新选择。');
          this.checkedList = oldVal;
        } else if (!this.comparisonData(newVal[newVal.length - 1], oldVal[0])) {
          this.$toast('您选择的订单信息不一致！请重新选择。');
          this.checkedList = oldVal;
        }
      }
    },
    // active: {
    //   handler() {
    //     this.onRefresh();
    //   },
    //   immediate: false,
    // },
  },
  beforeRouteEnter(to, from, next) {
    if (
      from.name === 'dispatching_cars_success' ||
      from.name === 'SupplySuccess'
    ) {
      next(vm => {
        vm.init();
      });
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (
      to.name === 'dispatching_cars_success' ||
      to.name === 'SupplySuccess' ||
      to.name === 'QuotationSuccess'
    ) {
      this.onClickLeft();
    }
    next();
  },
  beforeCreate() {
    setNativeHead({
      isShow: '0',
    });
  },
  mounted() {
    this.onBus();
    this.init();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    // 导航栏点击搜索
    onFocus(){
      this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
        'SearchGoodsResult',
      ]);
      this.$nextTick(() => {
        this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
          'SearchGoodsResult',
        ]);
        this.$router.push('./SearchGoodsResult')
      });
    },
    // 注册bus
    onBus() {
      bus.$on('onRefresh', res => {
        console.log('onRefresh');
        this.active = res.active;
        this.init();
      });
      this.$once('hook:beforeDestroy', () => {
        console.log('offRefresh');
        bus.$off('onRefresh');
      });
    },
    tabsClick() {
      this.onRefresh();
    },
    // 下拉刷新
    onRefresh() {
      this.pageIdx = '1';
      this.pageSize = '15';
      this.dataList = [];
      // 清除已选择
      this.checkedList = [];
      this.checkedAll = false;
      this.upFinished = true;
      this.firstLoaded = false;
      this.$_goQuotationStatistics().then(() => {
        this.$_getMySourceOfGoodsList().then(() => {
          this.firstLoaded = true;
          this.refreshing = false;
          this.isUpLoading = false;
        });
      });
    },
    // 上拉加载请求方法
    onLoadList() {
      this.pageIdx++;
      this.$_getMySourceOfGoodsList().then(() => {
        this.isUpLoading = false;
      });
    },
    // 初始化
    init() {
      this.onRefresh();
    },
    // 获取统计
    $_goQuotationStatistics() {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        goQuotationStatistics({})
          .then(res => {
            loading.clear();
            if (res.data.reCode === '0') {
              this.dbjCount = res.data.result.dbjCount || '';
              this.dpcCount = res.data.result.dpcCount || '';
              resolve();
            } else {
              this.$toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            loading.clear();
            reject();
          });
      });
    },
    // 获取列表
    $_getMySourceOfGoodsList() {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        getMySourceOfGoodsList({
          condition: this.condition,
          state: this.active.toString(),
          pageIdx: this.pageIdx,
          pageSize: this.pageSize,
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === '0') {
              this.timeDiff = res.data.result.timeDiff || '0';
              let list = res.data.result.list || [];
              list.length > 0 ? this.dataList.push(...list) : '';
              if (list.length < 15) {
                this.upFinished = true;
              } else {
                this.upFinished = false;
              }
              resolve();
            } else {
              this.$toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            loading.clear();
            reject();
          });
      });
    },
    // 详情
    $_getSupplyDetails(goodsId) {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        getSupplyDetails({
          goodsId,
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === '0') {
              const result = res.data.result || {};
              this.confirmData = result;
              resolve();
            } else {
              this.$toast(res.data.reInfo);
              reject();
            }
          })
          .catch(() => {
            loading.clear();
            reject();
          });
      });
    },
    // 去报价
    goQuotation(item) {
      this.$router.push({
        path: '/Quotation',
        query: { goodsId: item.goodsId },
      });
    },
    // 去修改报价
    goEditQuotation(item) {
      this.$router.push({
        path: '/Quotation',
        query: { goodsId: item.goodsId, isEdit: '1' },
      });
    },
    // 去派车
    goWaybillInformation(type, item) {
      if (type === '1' && !this.sendAble) {
        return;
      }
      let list = type === '0' ? [item] : this.checkedList;
      this.$store.commit('goodsSupply/SET_GOODS_SUPPLY', list);
      // 进入下一页的实际再加上缓存
      // 清空收款信息
      let receiveInfo = {
        acctType: '',
        alipayNo: '',
        cityId: '',
        jiedanState: '1',
        payBankName: '',
        payBankNo: '',
        payIdCard: '',
        payMobileNo: '',
        payName: '',
        payType: '',
        payTypeStr: '',
        provinceId: '',
        reciveBankAdress: '',
      };
      this.$store.commit(
        'buildWaybill/UPDATE_WRITE_RECEIVE_INFORMATION',
        receiveInfo,
      );
      this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
        'waybill_information',
        'write_car_information',
        'should_pay_freight',
        'write_receive_information',
      ]);
      this.$nextTick(() => {
        this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
          'waybill_information',
          'write_car_information',
          'should_pay_freight',
          'write_receive_information',
        ]);
        this.$router.push({
          path: '/waybill_information',
          query: { pagetype: '0', isFromH5: '1' },
        });
      });
    },
    // 展示详情
    showDetail(item) {
      // this.confirmShow = true;
      // this.confirmData = item;
      this.$_getSupplyDetails(item.goodsId).then(() => {
        this.confirmShow = true;
      });
    },
    onConfirm() {
      this.confirmShow = false;
    },
    onCancel() {
      this.confirmShow = false;
    },
    supplyWaybill(item) {
      this.$store.commit('goodsSupply/SET_GOODS_SUPPLY', [item]);
      this.$router.push({
        path: '/WaybillLink',
      });
    },
    supplySelectWaybill() {
      if (this.checkedList.length > 0) {
        this.$store.commit('goodsSupply/SET_GOODS_SUPPLY', this.checkedList);
        this.$router.push({
          path: '/WaybillLink',
        });
      }
    },
    comparisonDataType(newData, oldData) {
      // 类型
      if (newData.goodsType !== oldData.goodsType) {
        return false;
      }
      return true;
    },
    comparisonData(newData, oldData) {
      // 起始地、目的地、货物名称、司机手机号、姓名、车牌号、发货方、货值
      if (newData.loadingPlace !== oldData.loadingPlace) {
        return false;
      }
      if (newData.unloadingPlace !== oldData.unloadingPlace) {
        return false;
      }
      // if (newData.goodsName !== oldData.goodsName) {
      //   return false;
      // }
      // if (newData.mobileNo !== oldData.mobileNo) {
      //   return false;
      // }
      // if (newData.driverName !== oldData.driverName) {
      //   return false;
      // }
      // if (newData.cartBadgeNo !== oldData.cartBadgeNo) {
      //   return false;
      // }
      if (newData.carrierOrgId !== oldData.carrierOrgId) {
        return false;
      }
      if (newData.goodsCost !== oldData.goodsCost) {
        return false;
      }
      if (oldData.bidWinState === '2') {
        if (newData.cartType !== oldData.cartType) {
          return false;
        }
        if (newData.cartLength !== oldData.cartLength) {
          return false;
        }
      }
      return true;
    },
  },
};
</script>

<style lang="less" scoped>
.MySourceOfGoods {
  height: 100%;
  background: #ededed;
  /deep/.van-search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 6px 12px;
    z-index: 100;
    .goback{
      width: 20px;
      height: 20px;
      margin: 0px 10px;
    }
    .van-field__left-icon {
      padding-right: 4px;
      img {
        width: 14px;
      }
    }
    .van-search__action {
      color: #ffffff;
      font-size: 16px;
      background-color: #15499a;
    }
  }
  /deep/ .van-tabs {
    position: fixed;
    width: 100%;
    top: 46px;
    z-index: 1;
    .van-tabs__wrap {
      height: 50px;
      .van-tab {
        font-weight: 400;
        font-size: 16px;
      }
      .van-tab--active {
        font-weight: 800;
      }
    }
  }
  // /deep/.van-search {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   z-index: 1;
  //   width: 100%;
  //   .van-field__value {
  //     font-size: 14px;
  //   }
  // }
  /deep/ .van-list {
    padding: 0 10px;
    padding-top: 110px;
    padding-bottom: 60px;
    min-height: 100vh;
    box-sizing: border-box;
  }
  .search_left {
    color: #fff;
    font-size: 20px;
    padding-right: 10px;
  }
  .search_right {
    color: #fff;
    font-size: 16px;
  }
  .iconsousuo {
    font-size: 20px;
    color: #15499a;
  }
  .collected_warpper {
    flex-direction: column;
    box-sizing: border-box;
    background: #ededed;
    .collected_list_warpper {
      height: 100%;
      .nodata {
        color: #797979;
        text-align: center;
        padding: 200px 0;
        height: 100%;
      }
      .common_list {
        background: #ededed;
      }
    }
  }
  .footer {
    height: 70px;
    padding: 0 14px;
    background: #ffffff;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .left {
      display: flex;
      margin-right: 21px;
      span {
        margin-left: 6px;
      }
      .img-icon {
        width: 16px;
        height: 16px;
      }
    }
    .text_box {
      font-size: 15px;
      line-height: 24px;
      font-weight: 400;
      color: rgba(49, 50, 51, 1);
      span {
        color: #ffba00;
      }
    }
    .btn_box {
      flex: 1;
      text-align: right;
      .btn {
        margin-left: 12px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        width: 85px;
        height: 34px;
        background: #15499a;
        border-radius: 17px;
        line-height: normal;
      }
      .btn_primary {
        background: #15499a;
        border-color: #15499a;
      }
      .btn_disabled {
        background: #bcbcbc;
        border-color: #bcbcbc;
      }
    }
  }
  .nodata {
    text-align: center;
    padding: 200px 0;
    height: 100%;
    color: #797979;
  }
  .confirm_container {
    margin-bottom: 5px;
    .title {
      display: flex;
      color: #121212;
      padding: 4px 0;
      .location {
        width: 11px;
        height: 17px;
        display: flex;
        justify-content: center;
        align-items: center;
        .icondidiandingwei {
          color: #ffba00;
          margin-bottom: 1px;
        }
      }
      .location_text {
        margin-left: 4px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        color: #121212;
        .icondidiandaoxiang {
          color: @themeColor;
          margin: 0 2px 1px;
        }
      }
    }
    .item {
      display: flex;
      font-size: 14px;
      width: 100%;
      margin-top: 15px;
      .label {
        color: #797979;
        .text {
          width: 70px;
          text-align: justify;
          text-align-last: justify;
          display: inline-block;
          &::after {
            display: inline-block;
            overflow: hidden;
            width: 100%;
            height: 0;
          }
        }
      }
      .value {
        flex: 1;
      }
    }
    .item_money {
      color: #ffba00;
      .label {
        color: #ffba00;
      }
    }
  }
}
</style>
