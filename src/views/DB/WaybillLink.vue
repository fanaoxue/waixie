<template>
  <div class="WaybillLink">
    <c-header>
      <van-nav-bar
        title="可关联运单"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="collected_warpper">
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
              <div class="common_list">
                <card
                  v-for="(item, index) in dataList"
                  :key="index"
                  :item="item"
                  @showDetail="showDetail"
                  @showSubmitDetail="showSubmitDetail"
                ></card>
              </div>
            </van-checkbox-group>
            <div class="nodata" v-if="dataList.length === 0">
              暂无相关数据~
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <!-- <div class="footer" v-if="dataList.length !== 0">
        <div class="text_box">
          <div>
            已选：<span>{{ checkedList.length }}</span
            >单
          </div>
          <div>
            本次关联金额<span>{{ checkedList.length }}</span
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
            @click="goAdvancePayment('1')"
            >确认关联</van-button
          >
        </div>
      </div> -->
    </div>
    <Confirm
      v-model="confirmShow"
      :show-confirm-button="false"
      :show-cancel-button="false"
      @on-confirm="onConfirm"
      @on-cancel="onCancel"
      @on-close="onCancel"
      title="已关联订单信息"
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
          <div class="label"><span class="text">订单号</span>：</div>
          <div class="value">{{ confirmData.goodsNo }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">发货方</span>：</div>
          <div class="value">{{ confirmData.carrierOrgName }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">货物信息</span>：</div>
          <div class="value">{{ confirmData.goodsInfo }}</div>
        </div>
        <div class="item item_money">
          <div class="label"><span class="text">应收运费</span>：</div>
          <div class="value">{{ confirmData.freight }}元</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">派单时间</span>：</div>
          <div class="value">{{ confirmData.goodsTime }}</div>
        </div>
      </div>
    </Confirm>
    <Confirm
      v-model="submitConfirmShow"
      @on-confirm="onSubmitConfirm"
      @on-cancel="onSubmitCancel"
      @on-close="onSubmitCancel"
      title="关联订单信息"
    >
      <div class="confirm_container">
        <div class="title">
          <div class="location">
            <i class="iconfont icondidiandingwei"></i>
          </div>
          <div class="location_text">
            <span>{{ submitConfirmData.loadingPlace }}</span>
            <i class="iconfont icondidiandaoxiang"></i>
            <span>{{ submitConfirmData.unloadingPlace }}</span>
          </div>
        </div>
        <div class="item">
          <div class="label"><span class="text">订单号</span>：</div>
          <div class="value">{{ submitConfirmData.goodsNoStr }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">发货方</span>：</div>
          <div class="value">{{ submitConfirmData.carrierOrgName }}</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">货物信息</span>：</div>
          <div class="value">
            {{ submitConfirmData.goodsName }},{{ submitConfirmData.goodsAmount
            }}{{ submitConfirmData.goodsAmountType }}
          </div>
        </div>
        <div class="item item_money">
          <div class="label"><span class="text">应收运费</span>：</div>
          <div class="value">{{ money }}元</div>
        </div>
        <div class="item">
          <div class="label"><span class="text">派单时间</span>：</div>
          <div class="value">{{ submitConfirmData.createdTimeStr }}</div>
        </div>
        <div class="tips">
          <i class="iconfont icongantanhao"></i>确认关联成功后不可变更！
        </div>
      </div>
    </Confirm>
  </div>
</template>

<script>
import { pushCarInfo } from '@/api/externalassistanceapi';
import Card from './components/WaybillCard';
import Confirm from '@/common/components/confirm/confirm';
import { mapGetters } from 'vuex';
import {
  getWaybillLinkList,
  getSupplyDetails,
  submitSupply,
} from '@/api/DB.js';
export default {
  name: 'WaybillLink',
  components: {
    Card,
    Confirm,
  },
  data() {
    return {
      relState: '',
      submitConfirmShow: false,
      confirmShow: false,
      confirmData: {},
      checkedAll: false,
      checkedList: [], // 收款集合
      dataList: [],
      refreshing: false,
      isUpLoading: false, // 上拉加载
      upFinished: true, // 上拉加载完毕
      offset: 10, // 滚动条与底部距离小于 offset 时触发load事件
      pageIdx: '1',
      pageSize: '15',
    };
  },
  computed: {
    money() {
      // 20200730 zhanghui 段段要求应收运费不要保价费
      // if (this.relState === '1') {
      //   return Number(this.submitConfirmData.freightStr).toFixed(2);
      // }
      // return (
      //   Number(this.submitConfirmData.freightStr) +
      //   Number(this.submitConfirmData.insFee)
      // ).toFixed(2);
      if (this.relState === '0' && this.submitConfirmData.goodsType === '0') {
        // 未关联 && 货源单
        return (
          Number(this.submitConfirmData.freightStr) +
          Number(this.submitConfirmData.insFee)
        ).toFixed(2);
      } else {
        return (Number(this.submitConfirmData.freightStr)).toFixed(2);
      }
    },
    sendAble() {
      return this.checkedList.length !== 0;
    },
    finishedText() {
      return this.dataList.length > 0 ? '没有更多了~' : '';
    },
    ...mapGetters({
      goodsId: 'goodsSupply/goodsId',
      goodsIdList: 'goodsSupply/goodsIdList',
      submitConfirmData: 'goodsSupply/supplyData',
    }),
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'MySourceOfGoods' || from.name === 'SearchGoodsResult') {
      next(vm => {
        vm.init();
      });
    } else {
      next();
    }
  },
  mounted() {
    // this.init();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    // 下拉刷新
    onRefresh() {
      this.pageIdx = '1';
      this.pageSize = '15';
      this.dataList = [];
      // 清除已选择
      this.checkedList = [];
      this.checkedAll = false;
      this.$_getWaybillLinkList().then(() => {
        this.refreshing = false;
        this.isUpLoading = false;
      });
    },
    // 上拉加载请求方法
    onLoadList() {
      this.pageIdx++;
      this.$_getWaybillLinkList().then(() => {
        this.isUpLoading = false;
      });
    },
    // 初始化
    init() {
      this.onRefresh();
    },
    // 获取列表
    $_getWaybillLinkList() {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        getWaybillLinkList({
          goodsId: this.goodsId,
          pageIdx: this.pageIdx,
          pageSize: this.pageSize,
        })
          .then(res => {
            if (res.data.reCode === '0') {
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
            reject();
          })
          .finally(() => {
            loading.clear();
          });
      });
    },
    // 详情
    $_getSupplyDetails(taxWaybillId) {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        getSupplyDetails({
          taxWaybillId,
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
    // 提交确认关联
    $_submitSupply(taxWaybillId) {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        submitSupply({
          taxWaybillId,
          goodsId: this.goodsIdList,
          type: '2',
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === '0') {
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
    $_pushCarInfo() {
      pushCarInfo({ taxWaybillId: this.taxWaybillId, goodsId: this.goodsIdList});
    },
    showDetail(item) {
      // this.confirmShow = true;
      // this.confirmData = item;
      this.$_getSupplyDetails(item.taxWaybillId).then(() => {
        this.confirmShow = true;
      });
    },
    onConfirm() {
      this.confirmShow = false;
    },
    onCancel() {
      this.confirmShow = false;
    },
    showSubmitDetail(item) {
      this.submitConfirmShow = true;
      const { taxWaybillId, relState } = item;
      this.taxWaybillId = taxWaybillId;
      this.relState = relState;
    },
    onSubmitConfirm() {
      this.submitConfirmShow = false;
      this.$_submitSupply(this.taxWaybillId).then(() => {
        this.$_pushCarInfo();
        this.$router.push({ path: '/SupplySuccess' });
      });
    },
    onSubmitCancel() {
      this.submitConfirmShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.WaybillLink {
  height: 100%;
  background: #ededed;
  /deep/.van-search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
  }
  /deep/ .van-list {
    padding: 0 10px;
    padding-top: 70px;
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
  .collected_warpper {
    flex-direction: column;
    box-sizing: border-box;
    background: #ededed;
    .collected_list_warpper {
      height: 100%;
      .nodata {
        color: #797979;
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
  }
  .confirm_container {
    width: 100%;
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
        word-break: break-all;
      }
    }
    .item_money {
      color: #ffba00;
      .label {
        color: #ffba00;
      }
    }
    .tips {
      text-align: center;
      font-size: 15px;
      color: #ff3333;
      margin-top: 24px;
      margin-bottom: 4px;
      .icongantanhao {
        font-size: 14px;
        margin-right: 5px;
      }
    }
  }
}
</style>
