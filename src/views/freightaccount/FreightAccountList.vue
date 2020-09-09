<template>
  <div class="freight_account_list_box">
    <c-header isShowTitle class="header">
      <van-nav-bar title="收支明细" left-arrow fixed @click-left="onClickLeft">
        <div class="header_all" slot="right" @click="showAllScreen = true">
          {{ screenList[screenValue]
          }}
          <i class="iconfont iconquanbuanniuxiala all_xiala"></i>
        </div>
      </van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="top_fixed">
        <div class="top_date" @click="showPopupPicker">
          {{ pageCurDate | dateFormat('Y年m月') }}
          <van-icon name="arrow-down" v-show="!showDateTimePicker" />
          <van-icon name="arrow-up" v-show="showDateTimePicker" />
        </div>
        <div class="top_con">
          <div class="top_con_left flex_center">
            <p>付款</p>
            <p>￥{{ paymentAmount | formatNumber(paymentAmount) }}</p>
          </div>
          <div class="top_con_right flex_center">
            <p>收款</p>
            <p>￥{{ receiveAmount | formatNumber(receiveAmount) }}</p>
          </div>
        </div>
      </div>
      <div class="center_list_con">
        <div class="nodata flex_center" v-if="budgetList.length === 0">暂无相关数据~</div>
        <van-list
          v-model="isUpLoading"
          :finished="upFinished"
          :immediate-check="false"
          :offset="10"
          finished-text="没有更多了"
          @load="onLoadList"
          v-if="budgetList.length > 0"
        >
          <div class="item" v-for="(data, index) in budgetList" :key="index">
            <div class="list_title" :class="{'title_padding' : data.title}">{{ data.title }}</div>
            <div v-if="data.childList.length > 0">
              <div
                class="list_item"
                v-for="(item, i) in data.childList"
                :key="i"
                :class="{ 'van-hairline--top': i > 0 }"
              >
                <div class="item_left">
                  <p class="title">{{ item.dcFlag === '1' ? '收款' : '付款' }}</p>
                  <p>
                    {{ item.dcFlag === '1' ? '打款' : '收款' }}方：{{
                    item.sendName
                    }}
                  </p>
                  <p v-if="item.dcFlag === '2'">{{ item.sendAccount }}</p>
                  <p class="time">{{ item.createdTime }}</p>
                </div>
                <div class="item_right" :class="{ yellow: item.dcFlag === '1' }">
                  <span>
                    {{ item.dcFlag === '1' ? '+' : '-' }}￥{{
                    item.transAmount | formatNumber(item.transAmount)
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="list_item">暂无相关数据~</div>
          </div>
        </van-list>
      </div>
    </div>
    <!-- 日期 -->
    <van-popup v-model="showDateTimePicker" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @cancel="showDateTimePicker = false"
        @confirm="handleComfirmDate"
        @change="timeChange"
      />
    </van-popup>
    <!-- 全部搜索 -->
    <van-popup class="screen" v-model="showAllScreen" position="bottom">
      <van-cell
        :value="val"
        v-for="(val, index) in screenList"
        :key="index"
        :value-class="{ active: val === screenValue }"
        @click="handleScreenList(index)"
      />
    </van-popup>
  </div>
</template>

<script>
import { dateFormat } from '@/common/filters'
import { getBudgetDetailed } from '@/api/freightaccount'
export default {
  components: {},
  props: {},
  name: 'freight_account_list',
  data() {
    return {
      indexList: [''],
      subType: this.$route.query.sub_type,
      pageCurDate: new Date(),
      showDateTimePicker: false,
      currentDate: new Date(),
      minDate: this.setTime(-6),
      maxDate: new Date(),
      paymentAmount: '1443.67', // 付款金额
      receiveAmount: '1443.67', // 收款金额
      budgetList: [], // 列表数据
      pageIdx: 1, // 当页
      pageSize: 15,
      isUpLoading: false, // 上拉加载
      upFinished: false, // 上拉加载完毕
      offset: 50, // 滚动条与底部距离小于 offset 时触发load事件
      showAllScreen: false,
      screenList: ['全部', '收款', '付款'],
      screenValue: 0
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    },
    // 日期打开
    showPopupPicker() {
      this.showDateTimePicker = true
    },
    // 找当前日期距离半年之前的月份
    setTime(mon) {
      let d = new Date()
      d.setMonth(d.getMonth() + mon)
      return d
    },
    // 格式化日期
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      }
      return value
    },
    // 确认更改日期
    handleComfirmDate(value) {
      this.showDateTimePicker = false
      if (dateFormat(value, 'Y-m') !== dateFormat(this.pageCurDate, 'Y-m')) {
        this.pageCurDate = value
        this.initSearch(1)
        console.log(value, dateFormat(value, 'Y-m'))
      }
    },
    timeChange(val) {
      this.upFinished = false
    },
    // 重置搜索条件
    initSearch(type) {
      this.paymentAmount = '' // 付款金额
      this.receiveAmount = '' // 收款金额
      this.budgetList = []
      this.pageIdx = 1
      this.upFinished = false
      this.init(type)
    },
    // 上拉加载请求方法
    onLoadList() {
      this.pageIdx++
      console.log('上拉加载init加载数据')
      this.init()
    },
    // 初始化页面
    init(type) {
      if (type === 1) {
        // 初始化页面显示toast弹窗
        this.$toast.loading({
          message: '加载中...'
        })
      }
      getBudgetDetailed({
        subType: this.subType,
        searchDate: dateFormat(this.pageCurDate, 'Y-m'),
        pageIdx: this.pageIdx,
        pageSize: this.pageSize,
        dcFlag: this.screenValue === 0 ? '' : this.screenValue
      })
        .then(res => {
          if (res.data.reCode === '0') {
            const resResult = res.data.result
            this.paymentAmount = resResult.paymentAmount
            this.receiveAmount = resResult.receiveAmount
            if (resResult.list == null || resResult.list.length === 0) {
              // 没有数据 禁止了上拉加载 - 加载结束
              this.upFinished = true
              return
            }
            if (
              (resResult.list.length < this.pageSize &&
                resResult.list.length === 1 &&
                resResult.list[0].childList.length < this.pageSize) ||
              (resResult.list.length > 1 &&
                resResult.list.length < this.pageSize)
            ) {
              // 最后不足一页，也禁止上拉
              this.upFinished = true
            }
            // 处理数据
            if (this.pageIdx === 1) {
              this.budgetList = resResult.list
            } else {
              this.budgetList = this.budgetList.concat(resResult.list)
              this.budgetList.forEach((item, index) => {
                if (index + 1 < this.budgetList.length) {
                  if (
                    this.budgetList[index].title ===
                    this.budgetList[index + 1].title
                  ) {
                    // 相同日期合并数组
                    // item.childList = item.childList.concat(
                    //   this.budgetList[index + 1].childList
                    // )
                    this.budgetList[index + 1].title = ''
                  }
                }
              })
            }
          }
        })
        .finally(() => {
          this.isUpLoading = false
        })
    },
    // 刷选
    handleScreenList(index) {
      this.showAllScreen = false
      if (this.screenList[index] !== this.screenList[this.screenValue]) {
        this.screenValue = index
        this.initSearch(1)
        console.log(index)
      }
    }
  },
  created() {},
  mounted() {
    this.initSearch(1)
  }
}
</script>

<style lang="less" scoped>
.freight_account_list_box {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /deep/ .van-nav-bar__right {
    color: #fff;
    font-size: 16px;
    line-height: 46px;
    .all_xiala {
      transition: transform 0.3s;
    }
    .iconquanbuanniuxiala {
      padding-left: 5px;
      font-size: 12px;
    }
  }
  .top_fixed {
    width: calc(~'100% - 24px');
    position: fixed;
    z-index: 100;
    padding: 20px 12px 0 12px;
    overflow: hidden;
    background: #efefef;
    .top_date {
      font-weight: bold;
      color: #313233;
      font-size: 17px;
      margin-bottom: 13px;
      /deep/ .van-icon {
        font-weight: bold;
        position: relative;
        top: 2px;
      }
    }
    .top_con {
      background: #fff;
      border-radius: 5px;
      display: flex;
      padding-top: 18px;
      padding-bottom: 19px;
      .top_con_left,
      .top_con_right {
        flex: 1;
        flex-direction: column;
        color: #454545;
        font-size: 15px;
        line-height: 24px;
      }
      .top_con_left {
        position: relative;
        &::after {
          content: '';
          position: absolute;
          right: -1px;
          top: 20px;
          width: 1px;
          height: 15px;
          background: #dfdfdf;
        }
      }
    }
  }
  .center_list_con {
    position: relative;
    top: 154px;
    height: calc(~'100vh - 200px');
    overflow-y: auto;
    .item {
      &:first-child {
        .list_title {
          padding-top: 0;
        }
      }
    }
    .list_title {
      font-size: 16px;
      color: #313233;
      font-weight: bold;
    }
    .title_padding {
      padding: 20px 12px 12px 12px;
    }
    .list_item {
      background: #fff;
      padding: 15px 12px;
      display: flex;
      color: @font-color;
      font-size: 13px;
      .item_left {
        flex: 1;
        // line-height: 24px;
        > p {
          margin-bottom: 10px;
          &:last-child {
            margin-bottom: 0;
          }
        }
        .title {
          font-size: 15px;
        }
        .time {
          color: #bcbcbc;
        }
      }
      .item_right {
        justify-content: flex-end;
        align-items: center;
        display: flex;
        font-weight: bold;
        font-size: 15px;
        &.yellow {
          color: #ffba00;
        }
      }
    }
    .nodata {
      height: 100%;
      color: #797979;
    }
  }
  .screen {
    /deep/ .van-cell {
      padding: 18px 0;
      .van-cell__value--alone {
        text-align: center;
        font-size: 15px;
        &.active {
          color: #15499a;
        }
      }
    }
  }
}
</style>
