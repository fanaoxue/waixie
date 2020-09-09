<template>
  <div class="card_container">
    <div class="title_box van-hairline--bottom">
      <!-- <div class="checkbox">
        <van-checkbox
          :name="item"
          checked-color="#15499A"
          icon-size="17px"
        ></van-checkbox>
      </div> -->
      <div class="location">
        <i class="iconfont icondidiandingwei"></i>
      </div>
      <div class="location_text">
        <span>{{ item.startPlace }}</span>
        <i class="iconfont icondidiandaoxiang"></i>
        <span>{{ item.endPlace }}</span>
      </div>
      <div class="right">
        <div class="item_type">
          <span v-if="item.relState === '1'" class="binding">已关联</span>
          <span v-else class="unbinding">未关联</span>
        </div>
      </div>
    </div>
    <div class="content" @click="$emit('goWaybillDetail', item)">
      <div class="item">
        <div class="label"><span class="text">运单号</span>：</div>
        <div class="value">{{ item.taxWaybillNo }}</div>
      </div>
      <div class="item">
        <div class="label"><span class="text">车牌号码</span>：</div>
        <div class="value">{{ item.cartBadgeNo }}</div>
      </div>
      <div class="item">
        <div class="label"><span class="text">司机信息</span>：</div>
        <div class="value">{{ item.driverName }},{{ item.mobileNo }}</div>
      </div>
      <div class="item">
        <div class="label"><span class="text">货物信息</span>：</div>
        <div class="value">
          {{ item.goodsName }},{{ item.goodsAmount }}{{ item.goodsAmountType }}
        </div>
      </div>
      <div class="item">
        <div class="label"><span class="text">应付运费</span>：</div>
        <div class="value">{{ item.userFreight }}元</div>
      </div>
      <div class="item">
        <div class="label"><span class="text">建单时间</span>：</div>
        <div class="value">
          {{ item.createdTime }}
          <span
            v-if="item.relState === '1'"
            class="detail"
            @click="$emit('showDetail', item)"
            >关联详情>></span
          >
        </div>
      </div>
    </div>
    <div class="btn_box van-hairline--top">
      <van-button
        type="primary"
        class="btn"
        size="small"
        @click="$emit('showSubmitDetail', item)"
        >确认关联</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  name: 'WaybillCard',
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.card_container {
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  box-sizing: content-box;
  padding-left: 12px;
  padding-right: 10px;
  .checkbox {
    margin-right: 12px;
  }
  .title_box {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    // height: 42px;
    padding: 15px 0;
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
      // font-family: PingFang SC;
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
    .right {
      white-space: nowrap;
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #121212;
      .item_type {
        font-size: 15px;
        .unbinding {
          color: #ff3333;
        }
        .binding {
          color: #1b5dc7;
        }
      }
    }
  }
  .content {
    padding: 15px 0px;
    padding-left: 15px;
    padding-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    .item {
      display: flex;
      margin-bottom: 15px;
      .label {
        color: #797979;
        .text {
          width: 64px;
          height: 17px;
          line-height: 17px;
          vertical-align: top;
          text-align: justify;
          text-align-last: justify;
          display: inline-block;
          &::after {
            content: '';
            display: inline-block;
            overflow: hidden;
            width: 100%;
            height: 0;
          }
        }
      }
      .value {
        color: #202020;
        flex: 1;
        // font-family: PingFang SC;
        font-weight: 400;
        font-size: 15px;
        .detail {
          float: right;
          font-size: 14px;
          color: #15499a;
        }
      }
    }
  }
  .btn_box {
    padding: 15px 0px;
    display: flex;
    justify-content: flex-end;
    .btn {
      margin-left: 16px;
      font-size: 15px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      width: 85px;
      height: 34px;
      background: rgba(21, 73, 154, 1);
      border-radius: 17px;
      line-height: normal;
    }
  }
}
</style>
