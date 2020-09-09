<template>
  <div class="wait_for_dispatching_cars_container">
    <c-header>
      <van-nav-bar
        title="待派车"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base" v-show="pageShow">
      <div class="list_box" v-show="dataList.length !== 0">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
            :immediate-check="false"
            :offset="100"
            class="list"
          >
            <div v-for="(item, index) in dataList" :key="index">
              <div class="title">
                <div>{{ item.title }}</div>
                <div class="title_right">
                  <span>{{ item.childCount }}</span
                  >笔
                </div>
              </div>
              <div
                class="card"
                v-for="(data, key) in item.childList"
                :key="key"
              >
                <waybillCard :data="data">
                  <div
                    slot="btn"
                    class="btn"
                    @click="gotoWaybillInformation(data.taxWaybillId)"
                  >
                    去派车
                  </div>
                </waybillCard>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
      <div class="noData" v-show="dataList.length === 0">
        <div style="text-align: center;margin-top:50px;">
          <img alt src="../../assets/imgs/ydzz_konghezi@2x.png" width="125" />
          <div class="p">暂无数据~~~</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AppFinish } from '@/assets/js/app'
import waybillCard from '@/components/waybillcard'
import { getWayBillList } from '@/api/wayBill'
import { openNewWindow } from '@/assets/js/app'
import { APP_URL } from '@/assets/js/consts'
export default {
  name: 'wait_for_dispatching_cars',
  components: {
    waybillCard
  },
  data() {
    return {
      pageShow: false,
      isLoading: false,
      loading: false,
      finished: false,
      finishedText: '没有更多了',
      searchParams: {
        waybillState: '0',
        pageIdx: ''
      },
      dataList: [],
      lastListGroupId: ''
    }
  },
  mounted() {
    // this.pageInit()
    window.AppJSApi_finishCallBack = this.refresh
  },
  activated() {
    console.log('========activated============')
    this.pageInit()
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1)
    },
    pageInit() {
      this.searchParams.pageIdx = '1'
      this.lastListGroupId = ''
      this.finished = false
      this.fristGetWayBillList()
    },
    refresh() {
      this.pageInit()
    },
    onRefresh() {
      // this.$toast.loading({
      //   duration: 0,
      //   message: '加载中',
      //   forbidClick: true
      // })
      this.pageInit()
    },
    fristGetWayBillList() {
      // 分开的原因是因为当list过少是，下拉刷新会同时执行onload，函数异步。赋值两步
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      getWayBillList(this.searchParams)
        .then(res => {
          const { data } = res
          const { result } = data
          if (res.data.reCode === '0') {
            const { list } = result
            this.dataList = list
            this.dataList.length > 0 &&
              (this.lastListGroupId = this.dataList[
                this.dataList.length - 1
              ].groupId)
            if (Number(result.currentNums) < 15) {
              this.finished = true
            }
            this.loading = false
          }
          this.pageShow = true
          this.isLoading = false
        })
        .catch(() => {})
    },
    //
    getWayBillList() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      getWayBillList(this.searchParams)
        .then(res => {
          this.pageShow = true
          const { data } = res
          const { result } = data
          if (res.data.reCode === '0') {
            let { list } = result
            if (this.searchParams.pageIdx === '1') {
              this.dataList = list
            } else {
              if (list.length > 0 && list[0].groupId === this.lastListGroupId) {
                this.dataList[this.dataList.length - 1].childList.push(
                  ...list[0].childList
                )
                list = list.slice(1)
              }
              list.length > 0 && this.dataList.push(...list)
            }
            this.lastListGroupId = this.dataList[
              this.dataList.length - 1
            ].groupId
            if (Number(result.currentNums) < 15) {
              this.finished = true
            }
            this.loading = false
          }
          this.isLoading = false
        })
        .catch(() => {})
    },
    onLoad() {
      this.searchParams.pageIdx = Number(this.searchParams.pageIdx) + 1
      this.getWayBillList()
    },
    // 派单
    gotoWaybillInformation(taxWaybillId) {
      console.log(taxWaybillId)
      const url = `${APP_URL}/waybill_information?taxWaybillId=${taxWaybillId}&pagetype=0&isFromH5=1`
      openNewWindow({ url })

      // this.$router.push({
      //   path: '/waybill_information',
      //   query: {
      //     taxWaybillId: taxWaybillId,
      //     pagetype: '0',
      //     isFromH5: '1'
      //   }
      // })
    }
  }
}
</script>
<style lang="less" scoped>
.wait_for_dispatching_cars_container {
  .sub_page_base {
    .list_box {
      min-height: 100vh;
      padding: 0 10px;
    }
    .list {
      min-height: 100vh;
      .title {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        display: flex;
        justify-content: space-between;
        align-content: center;
        .title_right {
          font-size: 16px;
          span {
            color: @themeColor;
          }
        }
      }
      .card {
        padding-bottom: 20px;
        & > div {
          margin-bottom: 10px;
        }
      }
    }
    .p {
      width: 100%;
      color: rgba(121, 121, 121, 1);
      line-height: 24px;
      text-align: center;
      margin-top: 24px;
    }
  }
}
</style>
