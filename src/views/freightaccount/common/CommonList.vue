<template>
  <div class="common_list_box">
    <klb-collapse
      accordion="true"
      :showChecked="showChecked"
      :curLen="receiveList.length"
      :selectAll="checkedAll"
      @checkeds="handleChencked"
    >
      <div class="checked_box" v-if="showChecked">
        <i
          class="iconfont"
          :class="{
            iconxuanzhongmingxi: selectAll,
            iconfuxuankuang3: !selectAll
          }"
          @click="handleSelectAll"
        ></i>全选(
        <span>{{ receiveList.length }}</span>
        /{{ listData.length }})
      </div>
      <div style="height:20px" v-if="showChecked"></div>
      <klb-collapse-item
        v-for="(item, index) in listData"
        :key="index"
        @checked="handleChencked(item, index)"
        @beyond="handlebeyond"
      >
        <div slot="title">
          <div class="address_distance">
            <i class="iconfont icondidiandingwei"></i>
            <p class="address">
              {{ item.startCityName }}{{ item.startCountyName }}
              <i
                class="iconfont icondidiandaoxiang"
              ></i>
              {{ item.endCityName }}{{ item.endCountyName }}
            </p>
            <p class="distance" v-if="active === 1">{{ timeFormat(item.createdTime) }}</p>
            <p class="distance" v-else>{{ timeFormat(item.payTime) }}</p>
          </div>
          <div class="address_distance">
            <p class="address_tip">
              {{ item.cartBadgeNo }}{{ item.driverName ? ' , ' : ''
              }}{{ item.driverName }}
            </p>
            <p class="address_jine">{{ item.allFreight | formatNumber(item.allFreight) }}元</p>
          </div>
        </div>
        <div>
          <div class="left_list">
            <span
              class="justify"
              :class="{'title1':active === 1 || active === 0,'title2':active === 2}"
            >运单号</span>
            ：{{ item.taxWaybillNo }}
          </div>
          <div class="left_list">
            <span
              class="justify"
              :class="{'title1':active === 1 || active === 0,'title2':active === 2}"
            >货物信息</span>
            ：{{ item.goodsName }}，{{ item.goodsAmount
            }}{{ item.goodsAmountType }}
          </div>
          <div class="left_list">
            <span
              class="justify"
              :class="{'title1':active === 1 || active === 0,'title2':active === 2}"
            >发货方</span>
            ：{{ item.consignorOrgName }}
          </div>
          <div class="left_list" v-if="active === 2">
            <span class="justify title2">提前收款服务费</span>
            ：{{ item.serviceFee | formatNumber }}元
          </div>
        </div>
      </klb-collapse-item>
    </klb-collapse>
  </div>
</template>

<script>
export default {
  props: {
    showChecked: Boolean,
    listData: Array,
    active: [Number, String],
    receiveList: Array,
  },
  name: 'common_list',
  data() {
    return {
      checkedAll: false,
      selectAll: false,
    };
  },
  watch: {
    // 监听选中的数据
    receiveList() {
      this.calcTotal();
    },
    // 监听下拉加载数据
    listData() {
      this.selectAll = false;
      this.checkedAll = 'false';
      // this.calcTotal()
    },
  },
  methods: {
    // 计算勾选数是否等于总列表数据
    calcTotal() {
      if (this.receiveList.length === this.listData.length) {
        this.selectAll = true;
      } else {
        this.selectAll = false;
        this.checkedAll = 'false'; // 区分手动与自动
      }
    },
    // 全选事件
    handleSelectAll() {
      this.checkedAll = this.selectAll = !this.selectAll;
    },
    // 勾选事件
    handleChencked(item, index) {
      let json = {
        index: index,
      };
      // 区分手动全选及自动全选
      if (item === 'selectAll') {
        json.item = this.listData[index];
      } else {
        json.item = item;
      }
      this.$emit('common-checked', json);
    },
    // 超出给出提示
    handlebeyond() {
      this.$toast('勾选支持最多30条数据');
    },
    // 时间截取年月日
    timeFormat(number) {
      if (!number) return '';
      const year = number.slice(0, 4);
      const month = number.slice(5, 7);
      const day = number.slice(8, 10);
      return year + '年' + month + '月' + day + '日';
    },
  },
};
</script>

<style lang="less" scoped>
.common_list_box {
  .address_distance {
    display: flex;
    white-space: initial;
    color: @button-color;
    .icondidiandingwei {
      color: #ffba00;
      font-size: 15px;
    }
    .address {
      flex: 1;
      font-size: 15px;
      padding-bottom: 5px;
      .icondidiandaoxiang {
        color: #15499a;
      }
    }
    .distance {
      font-size: 14px;
      width: 114px;
      text-align: right;
    }
    .address_tip {
      flex: 1;
      color: #454545;
      font-size: 14px;
      padding-left: 16px;
    }
    .address_jine {
      color: @themeColor;
      font-size: 14px;
    }
  }
  .left_list {
    display: flex;
    margin-bottom: 10px;
    font-size: 14px;
    color: #797979;
    &:last-child {
      margin-bottom: 0;
    }
    // .title {
    //   flex: 0 0 auto;
    //   width: 110px;
    //   height: 15px;
    // }
    .title1 {
      flex: 0 0 auto;
      width: 70px;
      height: 15px;
    }
    .title2 {
      flex: 0 0 auto;
      width: 110px;
      height: 15px;
    }
  }
  /deep/ .klb-collapse-left {
    font-size: 16px;
    width: 16px;
    flex: 0 0 auto;
    .iconfont {
      padding: 0px 1px;
    }
    .iconfuxuankuang3 {
      background-color: #ffffff;
      color: #9f9f9f;
    }
  }
  /deep/ .klb-collapse-cell {
    border-radius: 5px;
    .klb-collapse-cell__title {
      .van-cell__right-icon {
        // top: -24px;
      }
    }
    .klb-collapse-cell__content .klb-collapse-cell__wrapper {
      padding: 11px 11px 16px 28px;
      overflow: hidden;
      border-top: 1px solid rgba(207, 207, 207, 0.21);
      &.van-hairline--top::after {
        border-color: transparent;
      }
    }
  }
  .checked_box {
    .iconfont {
      font-size: 16px;
      margin-right: 10px;
      &.iconxuanzhongmingxi {
        color: #15499a;
      }
    }
    .iconfuxuankuang3 {
      padding: 0px 1px;
      background-color: #ffffff;
      color: #9f9f9f;
    }
    span {
      color: #ffba00;
    }
  }
}
</style>
