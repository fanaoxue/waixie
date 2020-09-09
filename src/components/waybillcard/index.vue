<template>
  <div class="waybill_card_container">
    <div class="title van-hairline--bottom">
      <div>
        <i class="iconfont icondidiandingwei"></i>
      </div>
      <div>{{ data.startPlace }}</div>
      <div>
        <i class="iconfont icondidiandaoxiang"></i>
      </div>
      <div>{{ data.endPlace }}</div>
    </div>
    <div class="content">
      <div class="item">
        <span class="label justify">运单号：</span>
        <span class="value">{{ data.taxWaybillNo }}</span>
      </div>
      <div class="item">
        <span class="label justify">应收运费：</span>
        <span class="value">{{ data.receiveFreight }}</span>
      </div>
      <div class="item">
        <span class="label justify">货物信息：</span>
        <span class="value">{{ data.goodsName }}，{{ data.goodsAmount }}</span>
      </div>
      <div class="item">
        <span class="label justify">发货方：</span>
        <span class="value">{{ data.carrierOrgName }}</span>
      </div>
      <div class="item">
        <span class="label justify">派单时间：</span>
        <span class="value">{{ data.createdTime }}</span>
      </div>
    </div>
    <div class="footer van-hairline--top">
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'waybill_card',
  props: {
    data: Object
  },
  data() {
    return {
      city1: '安徽省合肥市'
    }
  }
}
</script>

<style lang="less" scoped>
.waybill_card_container {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 5px;
  .title {
    display: flex;
    align-items: center;
    min-height: 45px;
    // line-height: 45px;
    padding: 0 10px;
    .icondidiandingwei {
      color: #ffba00;
      margin-right: 7px;
    }
    .icondidiandaoxiang {
      color: @themeColor;
      margin: 0 2px;
    }
  }
  .content {
    padding: 15px 18px;
    .item {
      display: flex;
      // margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
      .label {
        color: #797979;
        width: 100px;
        text-align: justify;
        text-align-last: justify;
      }
      .value {
        margin-left: -2px;
      }
    }
  }
  .footer {
    padding: 16px 7px;
    display: flex;
    justify-content: flex-end;
    .btn {
      font-size: 16px;
      color: #fff;
      background: @themeColor;
      width: 85px;
      height: 34px;
      line-height: 34px;
      display: inline-block;
      text-align: center;
      border-radius: 17px;
    }
  }
}
</style>
