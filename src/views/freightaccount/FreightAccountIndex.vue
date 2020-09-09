<template>
  <div class="freight_account_index_box">
    <c-header isShowTitle class="header">
      <van-nav-bar title="运费账户" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base account_index">
      <span v-if="JSON.stringify(info) != '{}'">
        <!-- 外协金融 -->
        <div class="foreign_warpper" v-if="JSON.stringify(info.wx) != '{}'">
          <div class="foreign_top">
            <div class="col16">
              <img :src="info.wx.wxIcon" class="icongongyinglianjinrong" alt />
              <span>{{info.wx.wxName}}</span>
            </div>
            <div class="col8" @click="handleCollected('')">
              <van-button type="primary" size="small" :class="{ disabled: isApply === '1' }">提前收款</van-button>
            </div>
          </div>
          <div class="foreign_center">
            <p class="foreign_center_top">
              <span>￥</span>
              {{ info.wx.earningsAmount | formatNumber(info.wx.earningsAmount) }}
            </p>
            <div class="foreign_center_center">累计经营收益</div>
            <div class="foreign_center_bottom">
              <div class="bottom_left">
                应收总额:
                {{
                info.wx.incomeAmountTotal | formatNumber(info.wx.incomeAmountTotal)
                }}
              </div>
              <div class="bottom_right">
                应付总额:
                {{
                info.wx.expendAmountTotal | formatNumber(info.wx.expendAmountTotal)
                }}
              </div>
            </div>
          </div>
          <div class="foreign_footer flex_center" v-if="isApply !== '1'">
            <div class="foreign_tab_item" @click="handleCollected(0)">
              <div class="top">
                <span class="yuan">￥</span>
                <span>{{info.wx.ableIncome | formatNumber(info.wx.ableIncome)}}</span>
              </div>
              <div class="bottom">
                当前可收&nbsp;
                <van-icon name="arrow" />
              </div>
            </div>
            <div class="foreign_tab_item" @click="handleCollected(1)">
              <div class="top">
                <span class="yuan">￥</span>
                <span>{{ info.wx.unableIncome | formatNumber(info.wx.unableIncome) }}</span>
              </div>
              <div class="bottom">
                当前不可收&nbsp;
                <van-icon name="arrow" />
              </div>
            </div>
            <div class="foreign_tab_item" @click="handleCollected(2)">
              <div class="top">
                <span class="yuan">￥</span>
                <span>{{ info.wx.alreadyIncome | formatNumber(info.wx.alreadyIncome) }}</span>
              </div>
              <div class="bottom">
                当前已收&nbsp;
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </div>

        <!-- 供应链金融 -->
        <div class="foreign_warpper" v-if="JSON.stringify(info.bl) != '{}'">
          <div class="foreign_top">
            <div class="col16">
              <img :src="info.bl.blIcon" class="icongongyinglianjinrong" />
              <span>{{info.bl.blName}}</span>
            </div>
            <!-- <div class="col8" @click="payMoneyNow()">
              <van-button type="primary" size="small">立即还款</van-button>
            </div>-->
          </div>
          <div class="foreign_center">
            <p
              class="foreign_center_top"
            >￥{{info.bl.canUseAmount | formatNumber(info.bl.canUseAmount)}}</p>
            <div class="foreign_center_center">当前可用额度</div>
            <div class="foreign_center_bottom">
              <div class="bottom_left">
                冻结总额:
                {{info.bl.frozenAmount | formatNumber(info.bl.frozenAmount)}}
              </div>
              <div class="bottom_right">
                使用规则
                <i class="iconfont iconwenhao" @click="showState = true"></i>
              </div>
            </div>
          </div>
          <div class="foreign_footer flex_center">
            <div class="foreign_tab_item">
              <div class="top yellow">
                <span class="yuan">￥</span>
                <span>{{info.bl.creditAmount | formatNumber(info.bl.creditAmount)}}</span>
              </div>
              <div class="bottom black">总额度</div>
            </div>
            <div class="foreign_tab_item">
              <div class="top yellow">
                <span class="yuan">￥</span>
                <span>{{info.bl.usedAmount | formatNumber(info.bl.usedAmount)}}</span>
              </div>
              <div class="bottom black">
                待还款金额
                <!-- <van-icon name="arrow" /> -->
              </div>
            </div>
          </div>
        </div>
      </span>

      <!-- 账户列表 -->
      <van-loading v-if="loading" />
      <div class="account_index" v-if="freightList.length > 0">
        <div class="account_com" v-for="(item, index) in freightList" :key="index">
          <div class="account_main_left">
            <div class="left_list">
              <span class="title justify">运费账户：</span>
              {{ item.subAccountNo }}
            </div>
            <div class="left_list">
              <span class="title justify">账户余额：</span>
              <span class="yellow">
                ￥{{
                item.lastMoney | formatNumber(item.lastMoney)
                }}
              </span>
            </div>
            <div class="left_list">
              <span class="title justify">户名：</span>
              {{ item.subAccountName }}
            </div>
            <div class="left_list">
              <span class="title justify">开户行：</span>
              {{ item.subAccountBank }}
            </div>
          </div>
          <div class="account_main_right" @click="handleGoList(item)">
            <i class="iconfont iconshouzhimingxi"></i>
            <span>收支明细</span>
          </div>
        </div>
      </div>
      <!-- 弹框 -->
      <van-popup
        v-model="showState"
        closeable
        :close-on-click-overlay="false"
        :style="{ top: '50%', width: '90%',borderRadius:'4px', padding:'20px 10px'}"
        class="klb_popup"
      >
        <div class="title">供应链金融使用规则</div>
        <p>1. 用户可在运单终结时在线提交供应链金融支付申请</p>
        <p>2. 系统会根据以下几个方面核实是否可以进行供应链金融支付服务</p>
        <table>
          <tr>
            <td class="list_style">●</td>
            <td class="list_text">轨迹: 运单定位轨迹完整，能够反映运输的运输线路；</td>
          </tr>
          <tr>
            <td class="list_style">●</td>
            <td class="list_text">运单信息: 货物信息、运价信息为运输真实信息；</td>
          </tr>
          <tr>
            <td class="list_style">●</td>
            <td class="list_text">运价: 运价符合市场价格；</td>
          </tr>
          <tr>
            <td class="list_style">●</td>
            <td class="list_text">运费收款人: 外调车、合同车一律需要支付到卡车司机银行卡。</td>
          </tr>
          <tr>
            <td class="list_style">●</td>
            <td
              class="list_text"
            >运费收款人: 外调车、合同车一律需要支付到卡车司机银行卡。本企业自有车辆（行驶证上面所有人一栏和该企业名称一致），支付到非法人的固定卡；</td>
          </tr>
          <tr>
            <td class="list_style">●</td>
            <td class="list_text">逾期情况：当用户产生逾期情况后，需要将逾期的运单进行归还后才能继续申请；</td>
          </tr>
          <tr>
            <td class="list_style">●</td>
            <td class="list_text">司机信息：会员认证信息必须与承运司机一致。</td>
          </tr>
        </table>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {
  getFreightInfo,
  getFinanceTotal,
  searchReceiveRule,
} from '@/api/freightaccount';
import { AppFinish } from '@/assets/js/app';
export default {
  name: 'freight_account_index',
  data() {
    return {
      freightList: [],
      loading: true,
      info: {},
      isApply: '1',
      showState: false,
    };
  },
  // 结果页返回需刷新合计数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'collection_result') {
        vm.getFinanceTotalInfo();
      }
    });
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    // 收支明细
    handleGoList(item) {
      try {
        MtaH5.clickStat('wx_freight_detail');
      } catch (error) {
        console.log(JSON.stringify(error));
      }
      this.$router.push(`/freight_account_list?sub_type=${item.subType}`);
    },
    // 可收
    handleCollected(number) {
      if (number === '') {
        try {
          MtaH5.clickStat('wx_tiqianreceive');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else if (number == '0') {
        try {
          MtaH5.clickStat('wx_canreceive');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else if (number == '1') {
        try {
          MtaH5.clickStat('wx_cannotreceive');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      } else {
        try {
          MtaH5.clickStat('wx_alreadyreceive');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
      }
      if (number === '' && this.isApply === '1') {
        return;
      }

      this.$router.push(
        `/account_collected?active=${number}&is_apply=${this.isApply}`,
      );
    },
    // 查询运费账户信息
    init() {
      this.$toast.loading({
        message: '加载中...',
      });
      getFreightInfo({})
        .then(res => {
          this.loading = false;
          if (res.data.reCode === '0') {
            this.freightList = res.data.result.list;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 查询外协金融合计数据
    getFinanceTotalInfo() {
      this.$toast.loading({
        message: '加载中...',
      });
      getFinanceTotal({}).then(res => {
        if (res.data.reCode === '0') {
          this.info = res.data.result;
        }
      });
    },
    // 查询提前收款显示规则
    getReceivesRule() {
      this.$toast.loading({
        message: '加载中...',
      });
      searchReceiveRule({}).then(res => {
        if (res.data.reCode === '0') {
          this.isApply = res.data.result.arFlag;
        }
      });
    },
    // 立即还款
    payMoneyNow() {
      this.$toast('滚！点你妈呢');
    },
  },
  created() {},
  mounted() {
    this.getFinanceTotalInfo();
    this.getReceivesRule();
    this.init();
  },
};
</script>

<style lang="less" scoped>
.freight_account_index_box {
  .yellow {
    color: #ff8a00 !important;
  }
  .black {
    color: #000000 !important;
  }
  .klb_popup {
    .title {
      text-align: center;
      font-weight: bold;
      color: #202020;
      font-size: 17px;
      margin: 10px auto 20px;
      letter-spacing: 2px;
    }
    p {
      margin: 10px 0px;
      font-size: 14px;
      line-height: 1.5em;
      margin-left: 6px;
    }
    table {
      font-size: 14px;
      border-collapse: separate;
      border-spacing: 6px;
      .list_style {
        vertical-align: initial;
        color: #15499a;
        font-size: 5px;
        padding-top: 6px;
      }
      .list_text {
        line-height: 1.5em;
      }
    }
  }
  // 外协金融
  .foreign_warpper {
    display: flex;
    flex-direction: column;
    margin: 22px 10px 0 10px;
    background: @white;
    box-shadow: 0px 0px 20px 0px rgba(13, 40, 80, 0.05);
    border-radius: 5px;
    overflow: hidden;
    .foreign_top {
      display: flex;
      padding: 15px @font-size-md;
      .col16 {
        flex: 1;
        line-height: 28px;
        font-weight: bold;
        color: @button-color;
        display: flex;
        .icongongyinglianjinrong {
          width: 21px;
          height: 21px;
          margin-right: 8px;
          position: relative;
          top: 2px;
        }
      }
      .col8 {
        width: 80px;
        height: 28px;
        flex: 0 0 auto;
        /deep/ .van-button--small {
          font-size: @font-size-md;
          width: 100%;
          height: 100%;
          line-height: inherit;
          &.disabled {
            background: #bfbfbf;
            border: 1px solid #bfbfbf;
            color: #fff;
          }
        }
      }
    }
    .foreign_center {
      background: #2f78e9;
      padding: 22px 12px 20px 12px;
      font-size: 13px;
      color: @white;
      display: flex;
      flex-direction: column;
      align-items: center;
      &_top {
        font-size: 25px;
        font-weight: bold;
        overflow: hidden;
        padding-bottom: 10px;
        span {
          font-size: 15px;
        }
      }
      &_center {
        font-size: @font-size-md;
      }
      &_bottom {
        display: flex;
        width: 100%;
        margin-top: 21px;
        opacity: 0.8;
        font-size: 13px;
        .bottom_left {
          flex: 1;
        }
        .bottom_right {
          flex: 1;
          text-align: right;
        }
      }
    }
    .foreign_footer {
      padding: 20px 8px 18px;
      background: #f8faff;
      .foreign_tab_item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        // margin-right: 15px;
        position: relative;

        &:first-child {
          .top,
          .bottom {
            color: #ff8a00;
          }
        }
        &:nth-child(2) {
          // margin: 0 10px;
        }
        &:last-child {
          margin-right: 0;
          margin-left: 0px;
          &::after {
            height: 0;
          }
        }
        &::after {
          content: '';
          position: absolute;
          right: 0px;
          top: 8px;
          width: 1px;
          height: 15px;
          background: #dfdfdf;
        }
        .top {
          color: @font-color;
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 8px;
          .yuan {
            font-size: 10px;
          }
        }
        .bottom {
          font-size: 13px;
          /deep/ .van-icon-arrow {
            position: relative;
            top: 3px;
          }
        }
      }
    }
  }
  .account_index {
    padding-bottom: 10px;
  }
  .account_com {
    margin: 22px 10px 0px 10px;
    background: @white;
    box-shadow: 0px 0px 20px 0px rgba(13, 40, 80, 0.05);
    border-radius: 5px;
    padding: 20px 12px;
    display: flex;
    .account_main_left {
      flex: 1;
      font-size: 15px;
      color: @font-color;
      .left_list {
        display: flex;
        margin-bottom: 16px;
        word-break: break-all;
        &:last-child {
          margin-bottom: 0;
        }
        .title {
          flex: 0 0 auto;
          color: #797979;
          width: 81px;
          height: 15px;
        }
      }
    }
    .account_main_right {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: @themeColor;
      font-size: 13px;
      text-align: center;
      .iconshouzhimingxi {
        font-size: 17px;
        padding-bottom: 5px;
      }
    }
  }
}
</style>
