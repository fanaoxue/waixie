<template>
  <div class="deliver_waybill">
    <c-header isShowTitle class="header">
      <van-nav-bar title="派单" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base" v-show="page">
      <div class="content">
        <van-button type="primary">常用模板建单</van-button>
        <van-button type="default" @click="buildNewWaybill">新建运单</van-button>
      </div>
      <div class="default_tips" v-show="cardList.length === 0">
        <div class="p1">
          <span class="iconfont iconleijijingyingshouyijieshi"></span>什么是常用模板建单？
        </div>
        <div class="p2">您可以按照项目、线路、货物信息，提前创建好模板，直接使用模板来创建运单即可，不需要填写运单信息。</div>
        <div class="p3">您可以与我们运营人员联系，由运营来给您创建维护这些常用模板。</div>
      </div>
      <div class="list" v-show="cardList.length !== 0">
        <!-- vant下拉刷新组件 -->
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="finishedText"
            @load="onLoad"
          >
            <div
              class="list-card"
              v-for="(item, index) in cardList"
              :key="index"
              @click="chooseItem(item)"
            >
              <div class="card-left">
                <div class="card-left-cell">
                  <div class="left-cell-title">装货地：</div>
                  <div class="left-cell-value blue">{{ item.startAddress }}</div>
                </div>
                <div class="card-left-cell">
                  <div class="left-cell-title">卸货地：</div>
                  <div class="left-cell-value blue">{{ item.endAddress }}</div>
                </div>
                <div class="card-left-cell">
                  <div class="left-cell-title">货物信息：</div>
                  <div class="left-cell-value black">{{ item.goodsInfo }}</div>
                </div>
                <div class="card-left-cell" v-show="item.supplierOrgName">
                  <div class="left-cell-title">外协供应商：</div>
                  <div class="left-cell-value blue">{{ item.supplierOrgName }}</div>
                </div>
              </div>
              <div class="card-right">
                <input type="button" value="使用" @click.stop="useWayill(item.mWaybillTemplateId)" />
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 弹出层 -->
    <van-action-sheet
      v-model="cardShow"
      :actions="actions"
      @select="onSelect"
      cancel-text="取消"
      @cancel="cardShow = false"
    />
  </div>
</template>
<script>
import { AppFinish } from '@/assets/js/app.js';
import { getTemplateData, deleteTemplate } from '../../api/template.js';
export default {
  name: 'DeliverWaybill',
  data() {
    return {
      page: false,
      isLoading: false,
      cardShow: false, //模板操作弹框

      loading: false,
      finished: false,
      finishedText: '',

      actions: [
        { name: '修改', value: 'modify' },
        { name: '删除', value: 'delete' },
      ], //操作栏位
      templateType: '1', // 0：自有运单(默认) 1：外协运单
      pageIdx: 1,
      cardList: [],
      mWaybillTemplateId: '', //存值
      noData: false, // 判断是否数据全部加载完成 true为全部加载完
    };
  },
  activated() {
    this.dataInit(1, this.templateType);
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == 'modify_template') {
        vm.cardShow = false;
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'waybill_information') {
      this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
        'waybill_information',
      ]);
      this.$nextTick(() => {
        this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
          'waybill_information',
        ]);
        next();
      });
    } else {
      next();
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.dataInit(this.pageIdx, this.templateType)
    // })
  },
  methods: {
    dataInit(index, type) {
      this.finished = false;
      this.finishedText = '没有更多了~~';
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getTemplateData({
        pageIdx: index,
        templateType: type,
      })
        .then(res => {
          if (res.data.reCode === '0') {
            this.cardList = res.data.result.base;
          }
          this.page = true;
        })
        .catch(() => {
          this.page = true;
        });
    },
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    // 下拉刷新
    onRefresh() {
      this.dataInit('1', this.templateType);
      this.isLoading = false;
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        this.pageIdx++;
        getTemplateData({
          pageIdx: this.pageIdx,
          templateType: this.templateType,
        })
          .then(res => {
            if (res.data.result.base.length !== 0) {
              res.data.result.base.forEach(item => {
                this.cardList.push(item);
              });
            }
            // this.cardList = res.data.result.base
          })
          .catch(err => {
            this.$toast(err.message);
          });
        this.loading = false;
        this.finished = true;
      }, 1000);
    },
    // 新建运单
    buildNewWaybill() {
      this.$router.push({
        path: '/waybill_information',
        query: {
          pagetype: '1',
          isFromH5: '1',
        },
      });
    },
    // 点击使用
    useWayill(item) {
      this.$router.push({
        path: '/waybill_information',
        query: {
          mWaybillTemplateId: item,
          pagetype: '1',
          isFromH5: '1',
        },
      });
    },
    chooseItem(item) {
      this.mWaybillTemplateId = item.mWaybillTemplateId;
      this.cardShow = true;
    },
    // 模板操作
    onSelect(item) {
      this.cardShow = false;
      // 删除模板
      if (item.value === 'delete') {
        this.$klb.confirm.show({
          title: '提示',
          confirmText: '确定',
          cancelText: '取消',
          content: '是否确认删除？',
          onConfirm: () => {
            deleteTemplate({
              mWaybillTemplateId: this.mWaybillTemplateId,
              source: '2',
            })
              .then(res => {
                this.$toast(res.data.reInfo);
                // 删除后 刷新数据
                this.dataInit('1', this.templateType);
              })
              .catch(() => {});
          },
          onCancel: () => {},
          onClose: () => {},
        });
      } else {
        this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
          'modify_template',
        ]);
        this.$nextTick(() => {
          this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
            'modify_template',
          ]);
          // 修改模板
          this.$router.push({
            path: '/modify_template',
            query: {
              mWaybillTemplateId: this.mWaybillTemplateId,
            },
          });
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.deliver_waybill {
  /deep/.van-pull-refresh__head {
    overflow: hidden;
    top: -60px;
  }
  font-size: 16px;
  .sub_page_base {
    text-align: center;
    .van-button {
      width: 135px;
      height: 50px;
      margin: 20px 10px;
      border-radius: 5px;
      font-weight: bold;
    }
    .content {
      border: 1px solid #efefef;
      position: fixed;
      width: 100%;
      z-index: 1;
      background: #efefef;
      .van-button {
        z-index: 1;
      }
    }
    .default_tips {
      background: #ffffff;
      padding: 10px 12px;
      text-align: left;
      border-radius: 10px;
      margin: 90px 12px 0px 12px;
      .p1 {
        color: #1581cf;
        span {
          font-size: 20px;
          margin-right: 4px;
        }
      }
      .p1,
      .p2,
      .p3 {
        margin: 20px 0;
      }
    }
    .list {
      // min-height: 500px;
      // overflow-y: scroll;
      // padding-bottom: 45px;
      margin-top: 100px;
      .collected_list_warpper {
        // height: calc(~'100vh - 303px');
        height: 100vh;
        overflow: hidden;
        overflow-y: auto;
      }
      .van-pull-refresh {
        overflow: visible;
      }
      &-card {
        height: auto;
        background: #ffffff;
        border-radius: 5px;
        margin: 0px 12px 16px 12px;
        padding: 10px 12px;
        font-size: 15px;
        display: flex;
        .card-left {
          flex: 4;
          &-cell {
            position: relative;
            display: -webkit-box;
            display: -webkit-flex;
            display: flex;
            text-align: left;
            // -webkit-box-align: center;
            // -webkit-align-items: center;
            // align-items: center;
            margin: 10px auto;
            .left-cell-title {
              color: #797979;
              // width: 200px;
              min-width: 100px;
              height: 16px;
              text-align: justify;
              text-align-last: justify;
            }
            .left-cell-value {
              word-break: break-all;
            }
            .blue {
              color: #1581cf;
            }
            .black {
              color: #202020;
            }
          }
        }
        .card-right {
          flex: 1;
          position: relative;
          input {
            position: absolute;
            top: 50%-10px;
            left: 50%-25px;
            border-radius: 12px;
            border: none;
            color: #fff;
            background: #1581cf;
            padding: 4px 12px;
            box-shadow: 0 0 0 0.5px #ddd;
            &:active {
              box-shadow: 0px 4px 6px 0px #ccc;
            }
          }
        }
      }
    }
  }
}
</style>
