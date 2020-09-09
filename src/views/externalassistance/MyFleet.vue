<template>
  <div class="my_fleet_container">
    <c-header>
      <van-nav-bar title="我的车队" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="search_ipt_cxt_box">
        <div class="search_ipt_cxt">
          <div class="search_ipt_style">
            <i class="iconfont iconsousuo"></i>
            <van-field class="input" title placeholder="输入车牌号/司机姓名/司机手机" v-model="condition"></van-field>
          </div>
          <div class="search-control-btn" @click="searchBtn()">{{ searchBtnMsg }}</div>
        </div>
      </div>
      <div class="search-result-cxt" v-if="driverList.length > 0">
        <van-list
          v-model="loading"
          :finished="finished"
          :finished-text="finishedText"
          @load="onLoad"
          :immediate-check="false"
        >
          <div
            class="search-result-list"
            :class="{ 'search-resul-active': resulActiveFlag === index }"
            v-for="(item, index, key) in driverList"
            :key="key"
            @click="itemClick(index)"
          >
            <div class="list-item-top">
              <i class="iconfont iconchedui"></i>
              <span class="car-number-sp">{{ item.cartBadgeNo }}</span>
            </div>
            <div class="list-item-bottom">
              <span class="driver-phone-number">{{ item.mobileNo | formatPhone }}，</span>
              <span class="driver-name-sp">{{ item.driverName }}</span>
              <span v-show="item.hybWallet === '1'">
                <i class="iconfont iconhaoyunbaoqianbao"></i>
              </span>
            </div>
            <div
              class="use_btn_style"
              v-show="resulActiveFlag === index"
              @click="useBtnClick(item)"
            >使用</div>
          </div>
        </van-list>
      </div>
      <div class="search-no-result" v-if="driverList.length === 0 && !loading && searchResult">
        <img
          class="error-img-style"
          src="@/assets/imgs/externalassistance/pipeixinxi_icon@2x.png"
          alt
        />
        <div>未搜索到匹配信息~</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDriverMsgList,
  getDriverMsgSearch
} from '@/api/externalassistanceapi'
import bus from '@/assets/js/bus.js'

export default {
  name: 'my_fleet',
  data() {
    return {
      condition: '',
      driverList: [],
      resulActiveFlag: -1,
      searchBtnMsg: '搜索',
      searchResult: false,
      searchTitle: '车牌号',
      searchTitleOption: [
        { text: '车牌号', value: '车牌号' },
        { text: '司机姓名', value: '司机姓名' },
        { text: '司机手机', value: '司机手机' }
      ],
      finished: false,
      loading: false,
      error: false,
      finishedText: '',
      pageSize: '15',
      pageIdx: '1',
      searchParams: {
        condition: '',
        pageSize: '',
        pageIdx: ''
      }
    }
  },
  mounted() {
    this._getDriverMsgList()
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    },
    _getDriverMsgList() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      getDriverMsgList({}).then(res => {
        if (res.data.reCode === '0') {
          this.driverList = res.data.result.driverList
          this.finished = true
        }
      })
    },
    checkSearchData() {
      var pattern = /^[\u4e00-\u9fa5]+$/
      if (pattern.test(this.condition) && this.condition.length > 1) {
        return true
      }
      if (this.condition.length < 3) {
        this.$toast('请至少输入3个字符！', 'middle')
        return false
      }
      return true
    },
    onLoad() {
      this.searchParams.pageIdx = Number(this.searchParams.pageIdx) + 1
      this._getDriverMsgSearchPagination()
    },
    itemClick(index) {
      this.resulActiveFlag = index
    },
    useBtnClick(item) {
      // this.$store.dispatch('myfleet/selectMyFleet', item)
      bus.$emit('selectMyFleet', item)
      this.$router.back()
    },
    searchBtn() {
      if (!this.checkSearchData()) return false
      this.pageIdx = '1'
      this.driverList = []
      this.finished = false
      this.finishedText = '没有更多了'
      this._firstGetDriverMsgSearchPagination()
    },
    _firstGetDriverMsgSearchPagination() {
      this.searchResult = false
      let json = {
        condition: this.condition,
        pageSize: this.pageSize,
        pageIdx: this.pageIdx
      }
      this.searchParams = json
      getDriverMsgSearch(json)
        .then(res => {
          if (res.data.reCode === '0') {
            this.driverList = res.data.result.driverList
            if (res.data.result.isPrecise == 1) {
              // 精确查询最多15条
              this.finished = true
            } else {
              if (res.data.result.driverList.length < 15) {
                this.finished = true
              }
            }
          } else {
            this.$toast(res.data.reInfo, 'middle')
          }
          this.searchResult = true
        })
        .catch(() => {
          this.$toast('搜索异常，请稍后再试~~~', 'middle')
          this.searchResult = true
        })
    },
    _getDriverMsgSearchPagination() {
      getDriverMsgSearch(this.searchParams)
        .then(res => {
          if (res.data.reCode === '0') {
            res.data.result.driverList.forEach(element => {
              this.driverList.push(element)
            })
            if (res.data.result.driverList.length < 15) {
              this.finished = true
            }
          } else {
            this.error = true
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.my_fleet_container {
  min-height: 100vh;
  overflow-y: auto;
  background: #fff;
  .van-cell {
    padding: 0;
  }
  /deep/ .van-cell__value {
    margin-left: 0px !important;
  }
  .search_title_box {
    background: #fff;
    .search_title {
      line-height: 15px;
    }
  }
  .search_ipt_cxt_box {
    position: fixed;
    width: 100%;
    .search_ipt_cxt {
      background: #fff;
      display: flex;
      width: 100%;
      height: 46px;
      line-height: 46px;
      padding: 12px;
      .search_ipt_style {
        display: flex;
        align-items: center;
        width: 80%;
        height: 44px;
        border-radius: 20px;
        border: 1px solid #bfbfbf;
        /deep/.van-cell__value {
          margin-left: 0px !important;
        }
        .iconsousuo {
          color: @themeColor;
          margin-left: 5px;
          font-size: 24px;
        }
        .input {
          margin-right: 5px;
          flex: 1;
        }
        input::-webkit-input-placeholder {
          color: #9f9f9f;
          font-size: 14px;
        }
      }
      .search-control-btn {
        padding-left: 12px;
        color: @themeColor;
      }
    }
  }
  .search-result-cxt {
    box-sizing: border-box;
    padding: 80px 12px 30px;
    min-height: 60px;
    height: 100vh;
    overflow-y: auto;
    .search-result-list {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 60px;
      background-color: #f6f6f6;
      border-radius: 5px;
      .list-item-top {
        padding-left: 10px;
        display: flex;
        align-items: center;
        .car-number-sp {
          padding-left: 10px;
          color: #15499a;
          font-size: 15px;
        }
        .iconchedui {
          color: @themeColor;
        }
      }
      .list-item-bottom {
        padding-left: 32px;
        display: flex;
        align-items: center;
        .driver-phone-number,
        .driver-name-sp {
          color: #121212;
          font-size: 15px;
        }
        .iconhaoyunbaoqianbao {
          color: #eb5e3b;
        }
      }
      .use_btn_style {
        position: absolute;
        right: 26px;
        width: 60px;
        background-color: #03a9f4;
        color: #fff;
        text-align: center;
        border-radius: 25px;
        top: 18px;
        padding: 2px 0;
      }
    }
    .search-resul-active {
      position: relative;
      background-color: #e0effb;
      border: 1px solid #3699ff;
    }
  }
  .search-no-result {
    margin-top: 70px;
    width: 100%;
    text-align: center;
    color: #797979;
  }
  .che-pai-style {
    width: 15px;
    height: 15px;
  }
  .error-img-style {
    width: 48px;
    height: 56px;
  }
}
</style>
