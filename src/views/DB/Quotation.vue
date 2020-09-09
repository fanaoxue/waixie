<template>
  <div class="Quotation">
    <c-header class="header">
      <van-nav-bar
        left-arrow
        fixed
        :title="isEdit === '1' ? '修改报价' : '报价'"
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="container">
        <div class="top">
          <div class="location_box van-hairline--bottom">
            <div class="location">
              <i class="iconfont icondidiandingwei"></i>
              <span>{{ details.startPlace }}</span>
              <i class="iconfont icondidiandaoxiang"></i>
              <span>{{ details.endPlace }}</span>
            </div>
            <div class="timer">
              <Countdown
                v-if="details.createdTime"
                :start-time="details.createdTime"
                :time-diff="details.timeDiff"
                @time-end="timeEnd"
              ></Countdown>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="item">
            <div class="label"><span class="text">订单号</span>：</div>
            <div class="value">{{ details.goodsNo }}</div>
          </div>
          <div class="item">
            <div class="label"><span class="text">车辆要求</span>：</div>
            <div class="value">{{ details.carInfo }}</div>
          </div>
          <div class="item">
            <div class="label"><span class="text">货物信息</span>：</div>
            <div class="value">{{ details.goodsInfo }}</div>
          </div>
          <div class="item">
            <div class="label"><span class="text">发货方</span>：</div>
            <div class="value">{{ details.carrierOrgName }}</div>
          </div>
          <div class="item">
            <div class="label"><span class="text">货源类型</span>：</div>
            <div class="value">{{ details.goodsType | goodsTypeFilter }}</div>
          </div>
          <div class="item" v-if="Number(details.insFee) > 0">
            <div class="label"><span class="text">保价费</span>：</div>
            <div class="value">{{ details.insFee }}元</div>
          </div>
          <div class="item">
            <div class="label"><span class="text">询价时间</span>：</div>
            <div class="value">{{ details.createdTime }}</div>
          </div>
          <div class="item van-hairline--top">
            <div class="label"><span class="text">报价提醒</span>：</div>
            <div class="value">
              询价时间4小时内可报价、报价后仅可修改一次哦！
              <!-- <div></div>
              <div></div>-->
            </div>
          </div>
        </div>
      </div>
      <van-cell-group class="form">
        <van-field
          v-model.trim="details.freight"
          type="number"
          required
          clearable
          label="我的报价："
          placeholder="请输入您的报价总金额"
          :readonly="!available"
          class="input"
        >
          <template #extra>
            <div class="unit">元</div>
          </template>
        </van-field>
        <van-field
          v-model.trim="details.offerNote"
          class="textarea"
          label="备注："
          type="textarea"
          maxlength="100"
          placeholder="请输入备注"
          :readonly="!available"
          show-word-limit
        />
      </van-cell-group>
      <van-button
        class="submit"
        type="primary"
        size="large"
        @click="submit"
        :disabled="!available"
        >{{ isEdit === '1' ? '确认修改' : '确认提交' }}</van-button
      >
    </div>
  </div>
</template>

<script>
import bus from '@/assets/js/bus.js';
import Countdown from './components/Countdown';
import { getQuotationDetails, goQuotation } from '@/api/DB.js';
export default {
  name: 'Quotation',
  components: {
    Countdown,
  },
  filters: {
    goodsTypeFilter(val) {
      let str = '';
      switch (val) {
        case '0':
          str = '大票';
          break;
        case '1':
          str = '整车';
          break;
        default:
          break;
      }
      return str;
    },
  },
  data() {
    return {
      isEdit: this.$route.query.isEdit || '0',
      goodsId: this.$route.query.goodsId || '',
      details: {
        startPlace: '',
        endPlace: '',
        goodsNo: '',
        goodsInfo: '',
        carInfo: '',
        carrierOrgName: '',
        goodsType: '',
        createdTime: '',
        freight: '',
        offerNote: '',
        timeDiff: '40',
      },
      available: true,
    };
  },
  mounted() {
    this.$_getQuotationDetails();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back();
    },
    // 验证
    validte() {
      if (this.details.freight === '') {
        this.$toast('我的报价必填！');
        return false;
      }
      if (
        Number(this.details.freight) <= 0 ||
        Number(this.details.freight) > 9999999
      ) {
        this.$toast('我的报价不合法！');
        return false;
      }
      return true;
    },
    // 提交
    submit() {
      if (!this.available) {
        this.$toast('报价已经失效！');
        return false;
      }
      if (!this.validte()) {
        return false;
      }
      this.$_goQuotation().then(() => {
        if (this.isEdit === '1') {
          bus.$emit('onRefresh', { active: 1 });
          this.$router.back();
        } else {
          this.$router.push({ path: '/QuotationSuccess' });
        }
      });
    },
    // 详情
    $_getQuotationDetails() {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        getQuotationDetails({
          goodsId: this.goodsId,
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode === '0') {
              let result = res.data.result || {};
              this.details = result;
              // 产品要求
              if (this.details.freight && Number(this.details.freight) === 0) {
                this.details.freight = '';
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
    //去报价
    $_goQuotation() {
      return new Promise((resolve, reject) => {
        // 初始化页面显示toast弹窗
        const loading = this.$toast.loading({
          message: '加载中',
        });
        goQuotation({
          goodsId: this.goodsId,
          goodsNo: this.details.goodsNo,
          freight: this.details.freight,
          offerNote: this.details.offerNote,
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
    timeEnd() {
      this.available = false;
    },
  },
};
</script>
<style lang="less" scoped>
.Quotation {
  background: #efefef;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  /deep/ .van-hairline--bottom::after {
    border-color: rgba(207, 207, 207, 1);
  }
  /deep/ .van-hairline--top::after {
    border-color: rgba(207, 207, 207, 1);
  }
  .sub_page_base {
    .container {
      .top {
        height: 88px;
        background: linear-gradient(
          0deg,
          rgba(22, 129, 207, 1),
          rgba(21, 73, 154, 1)
        );
        padding: 20px 10px 0;
        box-sizing: border-box;
        .location_box {
          width: 100%;
          height: 100%;
          border-radius: 5px 5px 0 0;
          background: #fff;
          padding: 12px 12px 5px;
          box-sizing: border-box;
          // border-bottom: 1px solid rgba(207, 207, 207, 1);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          .location {
            font-size: 16px;
            color: #121212;
            .icondidiandingwei {
              color: #ffba00;
              margin-right: 4px;
            }
            .icondidiandaoxiang {
              color: @themeColor;
              margin: 0 2px 1px;
            }
          }
          .timer {
            margin-left: 20px;
            width: 103px;
            // padding-top: 4px;
            // padding-bottom: 4px;
            box-sizing: border-box;
            // height: 22px;
            background: rgba(254, 244, 233, 1);
            border-radius: 11px;
          }
        }
      }
      .content {
        box-shadow: 0px 0px 9px 0px rgba(21, 73, 154, 0.12);
        margin: 0 10px;
        padding: 15px 12px;
        background: #fff;
        border-radius: 0 0 5px 5px;
        .item {
          display: flex;
          margin-bottom: 15px;
          .label {
            color: #797979;
            white-space: nowrap;
            .text {
              width: 64px;
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
            word-break: break-all;
            flex: 1;
            text-align: right;
          }
          &:last-child {
            margin-bottom: 0;
            padding-top: 16px;
            // border-top: 1px solid rgba(220, 220, 220, 1);
            justify-content: space-between;
            .value {
              position: relative;
              // right: -10px;
              text-align: left;
              max-width: 57%;
              color: #ffba00;
              font-size: 15px;
            }
          }
        }
      }
      .bottom {
        margin: 0 10px;
        padding: 15px 12px;
        background: #fff;
        border-radius: 0 0 5px 5px;
      }
    }
    .form {
      box-shadow: 0px 0px 9px 0px rgba(21, 73, 154, 0.12);
      border-radius: 5px;
      padding: 10px 5px;
      margin: 10px;
      .input {
        /deep/.van-field__body {
          width: 150px;
        }
      }
      .textarea {
        /deep/.van-field__body {
          width: 225px;
        }
      }
      /deep/ .van-field {
        padding-right: 5px;
        &::after {
          border-bottom: none;
        }
        .van-field__label {
          text-align: left !important;
          flex: 1;
        }
        .van-field__value {
          padding: 0 5px;
          font-size: 15px;
          background: rgba(246, 246, 246, 1);
          border: 1px solid rgba(223, 223, 223, 1);
          border-radius: 5px;
          // input {
          //   width: 150px;
          // }

          // textarea {
          //   width: 225px;
          // }
        }
      }
      .unit {
        margin-left: 5px;
      }
    }
    .submit {
      position: fixed;
      bottom: 0;
      left: 0;
      border-radius: 0;
    }
  }
}
</style>
