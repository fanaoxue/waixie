<template>
  <div class="card_container">
    <div class="title_box van-hairline--bottom">
      <div class="location">
        <i class="iconfont icondidiandingwei"></i>
      </div>
      <div class="location_text">
        <span>{{ item.loadingPlace }}</span>
        <i class="iconfont icondidiandaoxiang"></i>
        <span>{{ item.unloadingPlace }}</span>
      </div>
      <div class="right">
        <div class="item_type">
          <span class="binding">待确认</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="item">
        <div class="label"><span class="text">订单号</span>：</div>
        <div class="value">{{ item.goodsNo }}</div>
      </div>
      <div class="item">
        <div class="label"><span class="text">车辆要求</span>：</div>
        <div class="value">
          {{ item.cartType ? `${item.cartType}、` : ''
          }}{{ item.cartLength ? `${item.cartLength}米` : '' }}
        </div>
      </div>
      <div class="item">
        <div class="label"><span class="text">货物信息</span>：</div>
        <div class="value">
          {{ item.goodsName ? `${item.goodsName},` : '' }}{{ item.goodsAmount
          }}{{ item.goodsAmountType }}
        </div>
      </div>
      <div class="item">
        <div class="label"><span class="text">发货方</span>：</div>
        <div class="value">{{ item.carrierOrgName }}</div>
      </div>
      <div class="item">
        <div class="label"><span class="text">询价时间</span>：</div>
        <div class="value">
          {{ item.createdTime }}
        </div>
      </div>
      <div class="item">
        <div class="label"><span class="text">报价金额</span>：</div>
        <div class="value">{{ item.freight }}元</div>
      </div>
    </div>
    <div class="btn_box van-hairline--top" v-if="item.mdOfferFlag === '1'">
      <van-button
        type="primary"
        class="btn"
        size="small"
        @click="$emit('goEditQuotation', item)"
        >修改报价</van-button
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'PendingQuotationCard',
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="less" scoped>
.card_container {
  border: 1px solid #fff;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  box-sizing: border-box;
  // padding-left: 12px;
  // padding-right: 10px;
  .checkbox {
    margin-right: 12px;
  }
  .title_box {
    display: flex;
    // justify-content: space-between;
    align-items: center;
    // height: 42px;
    padding: 15px 10px 15px 12px;
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
        .binding {
          color: #ffba00;
        }
      }
    }
  }
  .content {
    padding: 15px 10px 15px 12px;
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
        word-break: break-all;
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
    padding: 15px 10px 15px 12px;
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
