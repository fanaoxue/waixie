<template>
  <div class="SearchGoodsResult">
    <c-header>
      <form action="/">
        <van-search
          v-model.trim="condition"
          show-action
          placeholder="车型/金额/货物名称/发货方/地址"
          @search="onSearch"
          @cancel="onCancel"
          background="#15499A"
          ref="inputs"
        >
          <template #left-icon>
            <i class="iconfont iconsousuo"></i>
          </template>
        </van-search>
      </form>
    </c-header>
    <div class="content sub_page_base">
      <!-- 没有搜索展示历史记录 -->
      <div class="search-no-data" v-show="recordState && historyArr.length > 0">
        <div class="no-data-title">
          <div class="top-left">最近搜索：</div>
          <div class="top-right" @click="deleteHistoryData()">
            <img src="../../assets/imgs/DB/shanchu_icon@2x.png" alt />
          </div>
        </div>
        <ul class="line-top">
          <li v-for="(item,index) in historyArr" :key="index" @click="listClick(item)">
            <div class="search-val">{{item}}</div>
            <div class="right-icon">
              <img src="../../assets/imgs/DB/jiantouxuanzhong_icon@2x.png" alt v-if="index === 0" />
              <img src="../../assets/imgs/DB/jiantoumoren_icon@2x.png" alt v-else />
            </div>
          </li>
        </ul>
      </div>

      <!-- 展示搜索结果 -->
      <div class="search-result">
        <van-list
          v-model="isUpLoading"
          :finished="upFinished"
          :immediate-check="false"
          :finished-text="finishedText"
          :offset="offset"
          @load="onLoadList"
        >
          <div class="common_list" v-for="(item, index) in dataList" :key="index">
            <WaitQuotationCard
              v-show="item.state == 0"
              :item="item"
              :time-diff="timeDiff"
              @goQuotation="goQuotation"
            ></WaitQuotationCard>

            <WaitConfirmCard
              v-show="item.state == 1"
              :item="item"
              @goEditQuotation="goEditQuotation"
            ></WaitConfirmCard>

            <WaitCarCard
              v-show="item.state == 2"
              :item="item"
              :showType="false"
              @showDetail="showDetail"
              @goWaybillInformation="goWaybillInformation"
              @supplyWaybill="supplyWaybill"
            ></WaitCarCard>

            <OverCard v-show="item.state == 3" :item="item" @showDetail="showDetail"></OverCard>
          </div>
        </van-list>

        <div class="nodata" v-show="dataList.length === 0 && !recordState">
          <img src="../../assets/imgs/ydzz_konghezi@2x.png" alt width="90px" />
          <div class="nodata-text">暂无相关数据~</div>
        </div>
      </div>
    </div>

    <!-- 弹框 -->
    <Confirm
      v-model="confirmShow"
      :show-confirm-button="false"
      :show-cancel-button="false"
      @on-confirm="!confirmShow"
      @on-cancel="!confirmShow"
      @on-close="!confirmShow"
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
          <div class="label">
            <span class="text">运单号</span>：
          </div>
          <div class="value">{{ confirmData.taxWaybillNo }}</div>
        </div>
        <div class="item">
          <div class="label">
            <span class="text">车牌号码</span>：
          </div>
          <div class="value">{{ confirmData.cartBadgeNo }}</div>
        </div>
        <div class="item">
          <div class="label">
            <span class="text">司机信息</span>：
          </div>
          <div class="value">{{ confirmData.driverInfo }}</div>
        </div>
        <div class="item">
          <div class="label">
            <span class="text">货物信息</span>：
          </div>
          <div class="value">{{ confirmData.goodsInfo }}</div>
        </div>
        <div class="item item_money">
          <div class="label">
            <span class="text">应付运费</span>：
          </div>
          <div class="value">{{ confirmData.freight }}元</div>
        </div>
        <div class="item">
          <div class="label">
            <span class="text">关联时间</span>：
          </div>
          <div class="value">{{ confirmData.relationTime }}</div>
        </div>
      </div>
    </Confirm>
  </div>
</template>

<script>
import { setNativeHead } from '@/assets/js/app';
import WaitQuotationCard from './components/WaitQuotationCard';
import WaitConfirmCard from './components/WaitConfirmCard';
import WaitCarCard from './components/WaitCarCard';
import OverCard from './components/OverCard';
import Confirm from '@/common/components/confirm/confirm';
import { searchGoodsResultApi, getSupplyDetails } from '../../api/DB';
export default {
  name: 'SearchGoodsResult',
  components: {
    WaitQuotationCard,
    WaitConfirmCard,
    WaitCarCard,
    OverCard,
    Confirm,
  },
  data() {
    return {
      recordState: true,
      condition: '',
      pageIdx: '1',
      timeDiff: '0',
      historyArr: [], //历史记录数据
      dataList: [], // 搜索结果数据
      isUpLoading: false, // 上拉加载
      upFinished: true, // 上拉加载完毕
      offset: 10, // 滚动条与底部距离小于 offset 时触发load事件
      // 弹框
      confirmShow: false,
      confirmData: {},
    };
  },
  beforeCreate() {
    setNativeHead({
      isShow: '0',
    });
  },
  computed: {
    finishedText() {
      return this.dataList.length > 0 ? '没有更多了~' : '';
    },

  },
  created() {
    this.changfocus()
  },
  mounted() {
    this.historyArr = JSON.parse(localStorage.getItem('storeArr')) || [];
  },
  methods: {
    changfocus() {
      this.$nextTick(() => {
        //正确写法
        var ref = this.$refs.inputs;
        ref.querySelector("input").focus()
      });
    },
    onSearch(val) {
      this.dataList = [];
      this.pageIdx = '1';
      this.$_searchGoodsResultApi(val).then(res => {
        // 搜索记录去重
        if (this.historyArr.length > 0) {
          let commonVal = this.historyArr.some(item => item == val);
          if (commonVal) {
            return;
          }
        }
        if (this.historyArr.length === 5) {
          this.historyArr.pop();
        }
        this.historyArr.unshift(val);
        localStorage.setItem('storeArr', JSON.stringify(this.historyArr));
      });
    },
    $_searchGoodsResultApi(val) {
      return new Promise((resolve, reject) => {
        if (!val) {
          this.$toast('请输入搜索内容！');
          return;
        }
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        searchGoodsResultApi({ condition: val, pageIdx: this.pageIdx })
          .then(res => {
            if (res.data.reCode === '0') {
              this.timeDiff = res.data.result.timeDiff || '0';
              let list = res.data.result.list || [];
              list.length > 0 ? this.dataList.push(...list) : '';
              if (list.length < 15) {
                this.upFinished = true;
              } else {
                this.upFinished = false;
              }
              this.recordState = false;
              resolve();
            } else {
              this.recordState = false;
              this.$toast(res.data.reInfo);
              reject();
            }
          })
          .catch(err => {
            this.$toast(err.message);
            reject();
          });
      });
    },
    // 上拉加载
    onLoadList() {
      console.log('上拉');
      this.pageIdx++;
      this.$_searchGoodsResultApi(this.condition).then(res => {
        this.isUpLoading = false;
      });
    },
    // 历史记录点击事件
    listClick(item) {
      this.condition = item;
      this.onSearch(item);
    },
    onCancel() {
      this.$router.go(-1);
    },
    // 删除历史记录
    deleteHistoryData() {
      this.$klb.confirm.show({
        title: '提示',
        confirmText: '确定',
        cancelText: '取消',
        content: '确定清除当前记录？',
        onConfirm: () => {
          localStorage.clear();
          this.historyArr = [];
        },
        onCancel: () => {},
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
    // 展示详情
    showDetail(item) {
      this.$_getSupplyDetails(item.goodsId).then(() => {
        this.confirmShow = true;
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
    supplyWaybill(item) {
      this.$store.commit('goodsSupply/SET_GOODS_SUPPLY', [item]);
      this.$router.push({
        path: '/WaybillLink',
      });
    },
  },
};
</script>

<style lang="less" scoped>
.SearchGoodsResult {
  /deep/.van-search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 6px 12px;
    z-index: 100;
    .van-field__left-icon {
      padding-right: 4px;
      .iconsousuo {
        font-size: 20px;
        color: #15499a;
      }
    }
    .van-search__action {
      color: #ffffff;
      font-size: 16px;
      background-color: #15499a;
    }
  }
  .content {
    height: 100vh;
    .search-no-data {
      background: #ffffff;
      margin: 15px 10px;
      padding: 10px;
      border-radius: 4px;
      .no-data-title {
        display: flex;
        justify-content: space-between;
        .top-left {
          font-weight: bold;
        }
        .top-right {
          img {
            width: 15px;
          }
        }
      }
      .line-top {
        border-top: 1px dashed #dfdfdf;
        margin-top: 10px;
        padding-top: 10px;
        li {
          font-size: 15px;
          display: flex;
          justify-content: space-between;
          padding: 8px 0px;
          &:first-child {
            .search-val {
              color: #15499a;
            }
          }
        }
        .right-icon {
          img {
            width: 8px;
          }
        }
      }
    }
    .search-result {
      margin: 15px 10px;
      border-radius: 4px;
      .common_list {
        background: #ededed;
      }
      .nodata {
        color: #797979;
        text-align: center;
        padding: 200px 0;
        height: 100%;
        img {
          width: 90px;
        }
        .nodata-text {
          margin-top: 18px;
        }
      }
    }
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