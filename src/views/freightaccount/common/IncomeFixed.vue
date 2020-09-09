<template>
  <div class="top_fixed">
    <div class="bgefef">
      <div class="top_left">
        <p>
          <span v-show="active === 0 || active === ''">可</span>
          <span v-show="active === 1">不可</span>
          <span v-show="active === 2">已</span>收总额
        </p>
        <p class="jine">{{ totalAmount | formatNumber(totalAmount) }}</p>
      </div>
      <div class="top_right" @click="showDateTimePicker = true">
        <div>
          <span v-show="queryTime === ''">全部</span>
          <span v-show="queryTime">{{ queryTime | dateFormat('Y年m月') }}</span>
          <i class="iconfont iconquanbuanniuxiala"></i>
        </div>
        <div>共计运单<span class="num">{{ totalCount | format }}</span>笔</div>
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
        cancel-button-text="全部"
        @cancel="cancelDateTimePicker"
        @confirm="handleComfirmDate"
      />
    </van-popup>
  </div>
</template>

<script>
import { dateFormat } from '@/common/filters'
export default {
  props: ['active', 'totalAmount', 'totalCount'],
  data() {
    return {
      queryTime: '',
      currentDate: new Date(),
      minDate: this.setTime(-6),
      maxDate: new Date(),
      showDateTimePicker: false
    }
  },
  watch: {
    active() {
      this.queryTime = ''
    }
  },
  filters: {
    format(val) {
      return Number(val) || '0'
    }
  },
  methods: {
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
      // console.log(dateFormat(value, 'Y-m'), '----', this.queryTime)
      // console.log(dateFormat(value, 'Y-m') !== this.queryTime)
      if (dateFormat(value, 'Y-m') !== this.queryTime) {
        this.queryTime = value
        this.$emit('comfirmDatePicker', dateFormat(value, 'Y-m'))
      }
    },
    // 全部（取消）
    cancelDateTimePicker() {
      this.showDateTimePicker = false
      if (this.queryTime !== '') {
        this.queryTime = ''
        this.$emit('cancelDatePicker', '')
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    .iconquanbuanniuxiala {
      padding-left: 7px;
      color: @themeColor;
    }
    .num{
      color: rgb(255, 186, 0);
    }
  }
}
</style>
