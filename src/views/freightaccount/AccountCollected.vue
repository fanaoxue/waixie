<template>
  <div class="account_collected_box">
    <c-header isShowTitle class="header">
      <van-nav-bar left-arrow fixed @click-left="onClickLeft">
        <div slot="title" v-if="active !== ''">
          <van-tabs
            v-model="active"
            background="transparent"
            color="#ffba00"
            title-active-color="#ffba00"
            title-inactive-color="#fff"
            :border="false"
            line-width="44"
            line-height="2"
            @change="changeNav"
          >
            <van-tab title="可收"></van-tab>
            <van-tab title="不可收"></van-tab>
            <van-tab title="已收"></van-tab>
          </van-tabs>
        </div>
        <div slot="title" v-else>提前收款</div>
      </van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <income-fixed
        :active="active"
        :totalAmount="totalAmount"
        :totalCount="totalCount"
        @comfirmDatePicker="handleComfirm"
        @cancelDatePicker="handleCancel"
      ></income-fixed>
      <div class="collected_warpper">
        <div
          class="collected_list_warpper"
          :class="{
            active_tab1: (active === 0 || active === '') && isApply !== '1'
          }"
        >
          <van-list
            v-model="isUpLoading"
            :finished="upFinished"
            :immediate-check="false"
            :offset="offset"
            finished-text="没有更多了"
            @load="onLoadList"
            v-if="gatheringList.length > 0"
          >
            <common-list
              :showChecked="showChecked"
              :active="active"
              :receiveList="receiveList"
              :listData="gatheringList"
              @common-checked="handleChencked"
            ></common-list>
          </van-list>
          <div class="nodata flex_center" v-if="gatheringList.length === 0">暂无相关数据~</div>
        </div>
        <div class="footer" v-show="(active === 0 || active === '') && isApply !== '1'">
          <div class="fixed_btn" @click="queryReceivables" :class="{ disabled: !sendAble }">
            <van-button type="primary" size="large">提前收款</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IncomeFixed from './common/IncomeFixed';
import CommonList from './common/CommonList';
import { delArrNum } from '@/assets/js/utils';
import { getCollectedList, getNotCollectedList } from '@/api/freightaccount';
export default {
  components: { IncomeFixed, CommonList },
  props: {},
  name: 'account_collected',
  data() {
    return {
      active:
        this.$route.query.active !== '' ? Number(this.$route.query.active) : '', // 初始导航下标
      isApply: this.$route.query.is_apply, // 是否可提前收款
      showChecked: false,
      totalAmount: '',
      totalCount: '',
      queryTime: '',
      receiveList: [], // 收款集合
      subAccountNo: '',
      gatheringList: [],
      pageIdx: 1, // 当页
      pageSize: 15,
      isUpLoading: false, // 上拉加载
      upFinished: false, // 上拉加载完毕
      offset: 10, // 滚动条与底部距离小于 offset 时触发load事件
    };
  },
  computed: {
    sendAble() {
      return this.receiveList.length !== 0;
    },
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    // 日期搜索
    handleComfirm(val) {
      this.queryTime = val;
      console.log('日期更改搜索数据');
      this.initSearch(1);
    },
    // 取消 -- 全部
    handleCancel(val) {
      this.queryTime = val;
      console.log('全部搜索数据');
      this.initSearch(1);
    },
    // 重置搜索条件
    initSearch(type) {
      this.totalAmount = '0.00';
      this.totalCount = '0';
      this.receiveList = [];
      this.gatheringList = [];
      this.pageIdx = 1;
      this.upFinished = false;
      this.init(type);
    },
    // 切换导航
    changeNav(index) {
      this.active = index;
      this.queryTime = '';
      this.receiveList = [];
      this.isUpLoading = false;
      this.upFinished = false;
      if ((this.active === 0 || this.active === '') && this.isApply !== '1') {
        this.showChecked = true;
      } else {
        this.showChecked = false;
      }
      console.log(index, '切换导航刷新');
      this.initSearch(1);
    },
    // 上拉加载请求方法
    onLoadList() {
      this.pageIdx++;
      console.log('上拉加载init加载数据');
      this.init();
    },
    // 获取不可收列表
    getUnableList(type) {
      console.log('获取不可收列表');
      if (type === 1) {
        // 初始化页面显示toast弹窗
        this.$toast.loading({
          message: '加载中...',
        });
      }
      getNotCollectedList({
        queryTime: this.queryTime,
        pageIdx: this.pageIdx,
        pageSize: this.pageSize,
      })
        .then(res => {
          if (res.data.reCode === '0') {
            this.handleDate(res);
          }
        })
        .finally(() => {
          this.isUpLoading = false;
        });
    },
    // 获取可收或是已收列表
    getAbleList(type) {
      let parma = {
        queryTime: this.queryTime,
        pageIdx: this.pageIdx,
        type: this.active === 2 ? '1' : '0',
        pageSize: this.pageSize,
      };
      if (type === 1) {
        // 初始化页面显示toast弹窗
        this.$toast.loading({
          message: '加载中...',
        });
      }
      getCollectedList(parma)
        .then(res => {
          if (res.data.reCode === '0') {
            this.handleDate(res);
          }
        })
        .catch(() => {
          console.log('获取资源异常');
        })
        .finally(() => {
          this.isUpLoading = false;
        });
    },
    // 处理数据
    handleDate(res) {
      const resResult = res.data.result;
      this.totalAmount = resResult.totalAmount;
      this.totalCount = resResult.totalCount;
      if (
        resResult.gatheringList == null ||
        resResult.gatheringList.length === 0
      ) {
        // 没有数据 禁止了上拉加载 - 加载结束
        this.upFinished = true;
        return;
      }
      console.log(resResult.gatheringList.length, this.pageSize);
      if (resResult.gatheringList.length < this.pageSize) {
        // 最后不足一页，也禁止上拉
        this.upFinished = true;
      }
      // 处理数据
      if (this.pageIdx === 1) {
        this.gatheringList = resResult.gatheringList;
      } else {
        this.gatheringList = this.gatheringList.concat(resResult.gatheringList);
      }
    },
    // 初始化
    init(type) {
      if (this.active === 1) {
        this.getUnableList(type); // 不可收
      } else {
        this.getAbleList(type);
      }
    },
    // 可收 - 提前收款 勾选
    handleChencked(json) {
      // console.log(json, this.receiveList)
      if (this.receiveList.indexOf(json.item.taxPosInfoId) === -1) {
        this.receiveList = this.receiveList.concat(json.item.taxPosInfoId);
      } else {
        delArrNum(this.receiveList, json.item.taxPosInfoId);
      }
      if (this.receiveList.length === 1) {
        this.subAccountNo = this.gatheringList[json.index].bankCardNo;
      }
      // console.log('勾选', json.item.taxPosInfoId, this.receiveList)
    },
    // 提前收款
    queryReceivables() {
      if (!this.sendAble) {
        return;
      }
      // 处理传参格式化
      let receiveArry = [];
      for (var i = 0; i < this.receiveList.length; i++) {
        receiveArry.push({
          taxPosInfoId: this.receiveList[i],
        });
      }
      let json = {
        receiveList: receiveArry,
        subAccountNo: this.subAccountNo,
      };
      localStorage.setItem('receiveListData', JSON.stringify(json));
      this.$router.push('/apply_advance_payment');
    },
  },
  mounted() {
    localStorage.removeItem('receiveListData');
    if ((this.active === 0 || this.active === '') && this.isApply !== '1') {
      this.showChecked = true;
    }
    this.initSearch(1);
  },
};
</script>

<style lang="less" scoped>
.account_collected_box {
  overflow: hidden;
  height: 100%;
  /deep/ .van-nav-bar {
    .van-nav-bar__right {
      display: none;
    }
    .van-nav-bar__title {
      max-width: 100%;
      width: 100%;
      margin-left: 40px;
      overflow: inherit;
      .van-tabs__wrap {
        position: relative;
        top: 3px;
        .van-tabs__nav--line {
          padding-bottom: 0;
        }
        .van-tabs__line {
          bottom: 2px;
        }
        .van-tab {
          font-weight: 400;
        }
        .van-tab--active {
          font-weight: 800;
        }
      }
    }
  }
  .top_fixed {
    width: 100%;
    position: fixed;
    z-index: 100;
    background: #efefef;
    .bgefef {
      width: calc(~'100% - 44px');
      margin: 20px 10px 17px 10px;
      padding: 15px 12px;
      overflow: hidden;
      background: #fff;
      border-radius: 5px;
      display: flex;
      color: #454545;
      font-size: 15px;
      min-height: 70px;
    }
    .top_left {
      flex: 1;
      .jine {
        padding-top: 12px;
        color: @themeColor;
        font-size: 21px;
        font-weight: bold;
      }
    }
    .top_right {
      .iconquanbuanniuxiala {
        padding-left: 7px;
        color: @themeColor;
      }
    }
  }
  .collected_warpper {
    padding-top: 120px;
    .collected_list_warpper {
      margin: 0 12px 10px 12px;
      height: calc(~'100vh - 166px');
      // background: blue;
      overflow: hidden;
      overflow-y: auto;
      &.active_tab1 {
        height: calc(~'100vh - 303px');
      }
      .nodata {
        height: 100%;
        color: #797979;
      }
    }
  }
  .footer {
    height: 137px;
    // background: #efefef;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .fixed_btn {
      width: 100%;
      padding: 0 25px;
      &.disabled {
        /deep/ .van-button--primary {
          background: #bfbfbf;
          border: 1px solid #bfbfbf;
        }
      }
    }
  }
}
</style>
