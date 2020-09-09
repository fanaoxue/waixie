<template>
  <div class="waybill_detail">
    <c-header isShowTitle class="header">
      <van-nav-bar title="运单详情" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base" v-show="pageState">
      <!-- 自定义步进条 -->
      <steps-card :timeLine="timeLine"></steps-card>
      <!-- 自定义卡片组件 -->
      <!-- <detail-card :cardList="cardList"></detail-card> -->
      <div class="card_group">
        <div class="list-card">
          <van-cell title="运单信息" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-show="resultDate.taxWaybillNo != ''">
            <div class="left-cell-title">运单号：</div>
            <div class="left-cell-value">{{ resultDate.taxWaybillNo }}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.goodsNo">
            <div class="left-cell-title">关联订单号：</div>
            <div class="left-cell-value">{{ resultDate.goodsNo }}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.loadingCityName != ''">
            <div class="left-cell-title">装货地：</div>
            <div class="left-cell-value">{{ resultDate.loadingCityName }}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.unloadingCityName != ''">
            <div class="left-cell-title">卸货地：</div>
            <div class="left-cell-value">{{ resultDate.unloadingCityName }}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.goodsName != ''">
            <div class="left-cell-title">货物名称：</div>
            <div class="left-cell-value">{{ resultDate.goodsName }}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.goodsAmount!= ''">
            <div class="left-cell-title">货物数量：</div>
            <div class="left-cell-value">{{ resultDate.goodsAmount }}</div>
          </div>
          <div
            class="card-left-cell"
            v-show="category == '0' && classify == '2' && resultDate.carrierOrgName != ''"
          >
            <div class="left-cell-title">外协供应商：</div>
            <div class="left-cell-value">{{ resultDate.carrierOrgName}}</div>
          </div>
          <span v-show="category == '0' && classify == '2'">
            <div class="card-left-cell" v-show="resultDate.userFreight">
              <div class="left-cell-title">运费总额：</div>
              <div class="left-cell-value">{{ resultDate.userFreight }}元</div>
            </div>
            <div class="card-left-cell" v-show="resultDate.lossFee">
              <div class="left-cell-title">货损金额：</div>
              <div class="left-cell-value">{{ resultDate.lossFee}}元</div>
            </div>
            <div class="card-left-cell" v-show="resultDate.freightIncr">
              <div class="left-cell-title">运费增补：</div>
              <div class="left-cell-value">{{ resultDate.freightIncr}}元</div>
            </div>
          </span>
          <div class="card-left-cell" v-show="resultDate.drawee != ''">
            <div class="left-cell-title">受票方：</div>
            <div class="left-cell-value">{{ resultDate.drawee }}</div>
          </div>
          <div class="card-left-cell" v-show="permission.orgCfg718 == '49' && resultDate.upUserFreight">
            <div class="left-cell-title">应收运费：</div>
            <div class="left-cell-value">{{ resultDate.upUserFreight}}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="category == '0' && classify == '1' && resultDate.carrierOrgName"
          >
            <div class="left-cell-title">发货方：</div>
            <div class="left-cell-value">{{ resultDate.carrierOrgName}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.startTime">
            <div class="left-cell-title">起运时间：</div>
            <div class="left-cell-value">{{ resultDate.startTime }}</div>
          </div>
          <div
            class="card-left-cell"
            v-show="permission.orgCfg718 !== '49' && resultDate.arrivePlaceTime"
          >
            <div class="left-cell-title">到场时间：</div>
            <div class="left-cell-value">{{ resultDate.arrivePlaceTime }}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.tranRequire">
            <div class="left-cell-title">运输要求：</div>
            <div class="left-cell-value">{{ resultDate.tranRequire}}</div>
          </div>
        </div>
      </div>

      <div class="card_group" v-show="resultDate.cartBadgeNo">
        <div class="list-card">
          <van-cell title="承运信息" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-show="resultDate.cartBadgeNo">
            <div class="left-cell-title">车牌号码：</div>
            <div class="left-cell-value">{{ resultDate.cartBadgeNo}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.driverName">
            <div class="left-cell-title">司机姓名：</div>
            <div class="left-cell-value">{{ resultDate.driverName}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.mobileNo">
            <div class="left-cell-title">司机手机：</div>
            <div
              class="left-cell-value"
              @click="dialPhone(resultDate.driverName, resultDate.mobileNo)"
            >
              {{ resultDate.mobileNo}}
              <img
                src="../../assets/imgs/externalassistance/dianhua_icon@2x.png"
                alt
                width="18px"
                v-show="resultDate.driverName"
              />
            </div>
          </div>
          <div class="card-left-cell" v-show="resultDate.cartType">
            <div class="left-cell-title">车型：</div>
            <div class="left-cell-value">{{ resultDate.cartType}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.cartLenAndTon">
            <div class="left-cell-title">车长：</div>
            <div class="left-cell-value">{{ resultDate.cartLenAndTon | splitString(0)}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.cartLenAndTon">
            <div class="left-cell-title">吨位：</div>
            <div class="left-cell-value">{{ resultDate.cartLenAndTon | splitString(1)}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.currentPosition">
            <div class="left-cell-title">最新定位：</div>
            <div class="left-cell-value">{{ resultDate.currentPosition}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.positionTime">
            <div class="left-cell-title">定位时间：</div>
            <div class="left-cell-value">{{ resultDate.positionTime}}</div>
          </div>
        </div>
      </div>

      <div
        class="card_group"
        v-show="category == '0' && classify == '1' && resultDate.upUserFreight && resultDate.carrierOrgName"
      >
        <div class="list-card">
          <van-cell title="应收运费" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-show="permission.orgCfg718 != '49' && resultDate.upUserFreight">
            <div class="left-cell-title">应收运费：</div>
            <div class="left-cell-value">{{ resultDate.upUserFreight}}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="resultDate.upLossFee && Number(resultDate.upLossFee) != '0'"
          >
            <div class="left-cell-title">货损金额：</div>
            <div class="left-cell-value">{{ resultDate.upLossFee}}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="resultDate.upFreightIncr && Number(resultDate.upFreightIncr) != '0'"
          >
            <div class="left-cell-title">运费增补：</div>
            <div class="left-cell-value">{{ resultDate.upFreightIncr}}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="(resultDate.upLossFee && Number(resultDate.upLossFee) != '0') || (resultDate.upFreightIncr && Number(resultDate.upFreightIncr) != '0')"
          >
            <div class="left-cell-title">实际应收金额：</div>
            <div
              class="left-cell-value"
            >{{ (Number(resultDate.upUserFreight) + Number(resultDate.upFreightIncr)- Number(resultDate.upLossFee)).toFixed(2) }}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.carrierOrgName">
            <div class="left-cell-title">货主名称：</div>
            <div class="left-cell-value">{{ resultDate.carrierOrgName}}</div>
          </div>
        </div>
      </div>

      <div class="card_group" v-show="category == '0' && classify == '1'">
        <div class="list-card">
          <van-cell title="应付运费" class="header_cell_title"></van-cell>
          <div class="card-left-cell" v-show="resultDate.payable">
            <div class="left-cell-title">应付总额：</div>
            <div class="left-cell-value highLight">{{ resultDate.payable}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.paidAllFreight">
            <div class="left-cell-title">已付金额：</div>
            <div class="left-cell-value highLight">{{ resultDate.paidAllFreight}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.notPayFee">
            <div class="left-cell-title">未付金额：</div>
            <div class="left-cell-value highLight">{{ resultDate.notPayFee}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.applyPayFee">
            <div class="left-cell-title">申请支付金额：</div>
            <div class="left-cell-value highLight">{{ resultDate.applyPayFee}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.prepayments">
            <div class="left-cell-title">预付现金：</div>
            <div class="left-cell-value">{{ resultDate.prepayments}}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="resultDate.prepaymentsOilCard && Number(resultDate.prepaymentsOilCard) != 0"
          >
            <div class="left-cell-title">预付油卡：</div>
            <div class="left-cell-value">{{ resultDate.prepaymentsOilCard}}元</div>
          </div>
          <div
            class="card-left-cell"
            v-show="resultDate.prepaymentsOilCard != '' && Number(resultDate.prepaymentsOilCard) != '0'"
          >
            <div class="left-cell-title">油卡卡号：</div>
            <div
              class="left-cell-value"
              v-show="resultDate.oilCardNo != ''"
            >{{ resultDate.oilCardNo}}</div>
            <div class="left-cell-value" v-show="resultDate.oilCardNo == ''">未选择</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.arrivePay">
            <div class="left-cell-title">到付款：</div>
            <div class="left-cell-value">{{ resultDate.arrivePay}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.backFee">
            <div class="left-cell-title">回单押金：</div>
            <div class="left-cell-value">{{ resultDate.backFee}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.lossFee">
            <div class="left-cell-title">货损金额：</div>
            <div class="left-cell-value">{{ resultDate.lossFee}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.freightIncr">
            <div class="left-cell-title">运费增补：</div>
            <div class="left-cell-value">{{ resultDate.freightIncr}}元</div>
          </div>
          <div class="card-left-cell" v-show="Number(resultDate.insFee) > 0">
            <div class="left-cell-title">保价费：</div>
            <div class="left-cell-value">{{ resultDate.insFee}}元</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.goodsCost">
            <div class="left-cell-title">货值：</div>
            <div class="left-cell-value">{{ resultDate.goodsCost}}元</div>
          </div>
        </div>
      </div>

      <div class="card_group" v-show="category == '0' && classify == '1'">
        <div class="list-card">
          <van-cell title="司机收款信息" class="header_cell_title"></van-cell>
          <div class="card-left-cell">
            <div class="left-cell-title">收款方式：</div>
            <div class="left-cell-value">
              <span v-if="resultDate.hkbPayeeType == '1'">好运宝收款</span>
              <span v-else-if="resultDate.hkbPayeeType == '0'">银行卡收款</span>
              <span v-else>未选择</span>
            </div>
          </div>
          <div class="card-left-cell">
            <div class="left-cell-title">收款人姓名：</div>
            <div class="left-cell-value">
              <span
                v-if="peizhi.collectTwoCfg === '8' && resultDate.advancePayState === '1'"
              >{{ resultDate.driverName }}好运宝钱包</span>
              <span v-else-if="resultDate.payName == ''">未填写</span>
              <span v-else>{{ resultDate.payName }}</span>
            </div>
          </div>
          <div class="card-left-cell" v-show="resultDate.payBankName">
            <div class="left-cell-title">收款银行：</div>
            <div class="left-cell-value">{{resultDate.payBankName}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.payBankNo">
            <div class="left-cell-title">银行卡号：</div>
            <div class="left-cell-value">{{resultDate.payBankNo}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.payIdCard">
            <div class="left-cell-title">身份证号：</div>
            <div class="left-cell-value">{{resultDate.payIdCard}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.payMobileNo">
            <div class="left-cell-title">联系手机：</div>
            <div class="left-cell-value">{{resultDate.payMobileNo}}</div>
          </div>
          <div class="card-left-cell" v-show="resultDate.payBankBranchName">
            <div class="left-cell-title">开户行地址：</div>
            <div class="left-cell-value">{{resultDate.payBankBranchName}}</div>
          </div>
          <div
            class="card-left-cell"
            v-show="(resultDate.zyCapitalCfg == '8' && resultDate.hkbPayeeType == '1') || (resultDate.zyCapitalCfg == '9' && peizhi.zblState == '1')"
          >
            <div class="left-cell-title">支付宝账号：</div>
            <div class="left-cell-value">{{resultDate.aliPayNo}}</div>
          </div>
        </div>
      </div>

      <div class="footer" style="height:60px;"></div>
      <div class="button">
        <van-button
          type="default"
          @click="paymentDetail"
          v-if="peizhi.payState == 1 || peizhi.payState == 2 || peizhi.payState == 3 || peizhi.payState == 5 || peizhi.payState == 6 || peizhi.payState == 7"
        >支付明细</van-button>
        <van-button
          type="default"
          @click="cancelWaybill"
          v-if="(peizhi.klbState == 1 || peizhi.sendCarState == 1) && !(peizhi.payState == 1 || peizhi.payState == 2 || peizhi.payState == 3 || peizhi.payState == 5 || peizhi.payState == 6 || peizhi.payState == 7) &&!(peizhi.invoiceState === '0' && peizhi.payState == 0 && permission.deleteWaybillCfg != '9'&&peizhi.sendCarState != 1)"
        >取消</van-button>
        <van-button
          type="default"
          @click="deleteWaybill"
          v-if="peizhi.invoiceState === '0' && peizhi.payState == 0 && permission.deleteWaybillCfg != '9'&&peizhi.sendCarState != 1"
        >删除</van-button>
        <van-button
          type="primary"
          @click="modifyWaybill"
          v-if="peizhi.invoiceState === '0' && peizhi.updateWaybillCfg != '9'"
        >修改</van-button>
      </div>
      <drag-circle @fn="gotoRecord" :showState="showState"></drag-circle>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import {
  AppFinish,
  AppGotoTell,
  AppUpdateWaybillData,
  operateWaybill,
} from '@/assets/js/app.js';
import stepsCard from '@/components/stepscard/index.vue';
import dragCircle from '../../common/components/dragCircle/index.vue';
import {
  waybillDetail,
  deleteWaybill,
  isRecordShow,
  zblState,
} from '../../api/wayBill';
export default {
  components: {
    stepsCard,
    dragCircle,
  },
  name: 'WaybillDetail',
  data() {
    return {
      pageState: false,
      taxWaybillId: this.$route.query.taxWaybillId,
      category: this.$route.query.category, //0：综合物流 1：大综
      classify: this.$route.query.classify, //0：自有运单 1：外协运单 2：企业+外协
      waybillState: this.$route.query.waybillState,
      timeLine: [],
      peizhi: {
        updateWaybillCfg: '', // 修改运单配置 8：开通9：关闭
        collectTwoCfg: '', // 删除运单配置 8：开通9：关闭
        isModifyWaybill: '',
        zblState: '',
        klbState: '', //开票状态
        payState: '', //支付状态
        invoiceState: '', //快路宝状态
      },
      resultDate: [],
      showState: false,
    };
  },
  filters: {
    // dataFormat: function(item) {
    //   if (item == '' || item == undefined || item == null) {
    //     return '/'
    //   } else {
    //     return item
    //   }
    // },
    splitString: function(item, index) {
      if (item == 'undefined') {
        return false;
      } else {
        return (item || '').split('，')[index] || '/';
      }
    },
  },
  computed: {
    ...mapGetters(['permission']),
  },
  created() {},
  activated() {
    this.$nextTick(() => {
      let json = {
        taxWaybillId: this.taxWaybillId,
      };
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      waybillDetail(json)
        .then(res => {
          if (res.data.reCode === '0') {
            this.resultDate = res.data.result;
            this.peizhi = Object.assign(this.peizhi, this.resultDate);
            // 承运商版
            if (this.category == '0' && this.classify == '1') {
              this.timeLine = [
                {
                  img: require('../../assets/imgs/facheselected_icon_green@2x.png'),
                  timeName:
                    this.permission.orgCfg718 === '49'
                      ? '建单时间'
                      : '派车时间',
                  timeValue: this.peizhi.createdTime,
                  peizhi: '1',
                },
                {
                  img: this.peizhi.receiveTime
                    ? require('../../assets/imgs/jiedanshijian_green@2x.png')
                    : require('../../assets/imgs/jiedanshijian_icon@2x.png'),
                  timeName: '接单时间',
                  timeValue: this.peizhi.receiveTime,
                  peizhi: this.peizhi.receiveTime ? '1' : '0',
                },
                {
                  img:
                    this.peizhi.endTime !== ''
                      ? require('../../assets/imgs/daoda_icon_green@2x.png')
                      : require('../../assets/imgs/daoda_icon_gray@2x.png'),
                  timeName: '到达时间',
                  timeValue: this.peizhi.endTime,
                  peizhi: this.peizhi.endTime !== '' ? '1' : '0',
                },
              ];
            } else {
              // 企业版
              this.timeLine = [
                {
                  img: require('../../assets/imgs/jiandan_icon_green@2x.png'),
                  timeName: '派单时间',
                  timeValue: this.peizhi.createdTime,
                  peizhi: '1',
                },
                {
                  img: this.peizhi.sendCarTime
                    ? require('../../assets/imgs/facheselected_icon_green@2x.png')
                    : require('../../assets/imgs/fache_icon_gray@2x.png'),
                  timeName: '派车时间',
                  timeValue: this.peizhi.sendCarTime,
                  peizhi: this.peizhi.sendCarTime ? '1' : '0',
                },
                {
                  img: this.peizhi.startTime2
                    ? require('../../assets/imgs/daochang_icon_green@2x.png')
                    : require('../../assets/imgs/daochang_icon_gray@2x.png'),
                  timeName: '到场时间',
                  timeValue: this.peizhi.startTime2,
                  peizhi: this.peizhi.startTime2 ? '1' : '0',
                },
                {
                  img:
                    this.peizhi.endTime !== ''
                      ? require('../../assets/imgs/daoda_icon_green@2x.png')
                      : require('../../assets/imgs/daoda_icon_gray@2x.png'),
                  timeName: '到达时间',
                  timeValue: this.peizhi.endTime,
                  peizhi: this.peizhi.endTime !== '' ? '1' : '0',
                },
              ];
            }
            this.$toast.loading({
              duration: 0,
              message: '加载中',
              forbidClick: true,
            });
            //查询是否存在修改记录
            isRecordShow(json).then(res => {
              if (res.data.reCode === '0') {
                // 1  存在   0 不存在
                if (
                  res.data.result.count == '0' ||
                  res.data.result.count == ''
                ) {
                  this.showState = false;
                } else {
                  this.showState = true;
                }
              }
              this.$toast.loading({
                duration: 0,
                message: '加载中',
                forbidClick: true,
              });
              zblState({}).then(response => {
                this.peizhi = Object.assign(this.peizhi, response.data.result);
                this.pageState = true;
              });
            });
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(err => {});
    });
  },
  mounted() {},
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    // 删除
    deleteWaybill() {
      try {
        MtaH5.clickStat('wx_deletewaybill');
      } catch (error) {
        console.log(JSON.stringify(error));
      }
      this.$klb.confirm.show({
        title: '提示',
        content: '是否删除此笔运单?',
        confirmText: '确认',
        cancelText: '取消',
        onConfirm: () => {
          this.$toast.loading({
            duration: 0,
            message: '删除中...',
            forbidClick: true,
          });
          let json = {
            taxWaybillId: this.taxWaybillId,
          };
          deleteWaybill(json)
            .then(res => {
              if (res.data.reCode === '0') {
                //删除成功
                this.$toast('删除运单成功！');
                setTimeout(() => {
                  let json = {
                    type: '1',
                    taxWaybillId: this.taxWaybillId, //运单号
                    content: {},
                    refreshList: [this.waybillState],
                    waybillState: this.waybillState,
                  };
                  operateWaybill(json);
                  this.onClickLeft();
                }, 1000);
              } else {
                this.$toast(res.data.reInfo);
              }
            })
            .catch(err => {
              this.$toast(err);
            });
        },
      });
    },
    //判断机型,向客户端发送信息
    postMessage: function(item) {
      AppUpdateWaybillData(item);
    },
    //拨打电话的弹框
    dialPhone(driverName, mobileNo) {
      this.$klb.confirm.show({
        title: '拨打电话',
        content:
          `<p style='text-align:left'>确认拨打：</p><p style='color:#FFBA00;text-align:left'>` +
          driverName +
          `</p><p style='color:#FFBA00;text-align:left'>` +
          mobileNo +
          `</p>`,
        confirmText: '确认',
        cancelText: '取消',
        onConfirm: () => {
          //调用客户端的拨打电话功能
          AppGotoTell(mobileNo);
        },
      });
    },
    // 修改运单
    modifyWaybill() {
      if (this.resultDate.isModifyWaybill === '1') {
        this.$toast('存在提前收款支付单不可修改运单!');
        return;
      }
      if (this.category == '0' && this.classify == '2') {
        try {
          MtaH5.clickStat('wx_modify_q');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
          'business_modify_waybill',
        ]);
        this.$nextTick(() => {
          this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
            'business_modify_waybill',
          ]);
          this.$router.push({
            path: '/business_modify_waybill',
            query: {
              taxWaybillId: this.taxWaybillId,
              type: '0',
              category: this.category,
              classify: this.classify,
              waybillState: this.waybillState,
              isFromH5: '1',
            }, //type:0从详情进入修改，1：列表进入修改
          });
        });
      } else {
        try {
          MtaH5.clickStat('wx_modify_w');
        } catch (error) {
          console.log(JSON.stringify(error));
        }
        this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
          'supplier_modify_waybill',
        ]);
        this.$nextTick(() => {
          this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
            'supplier_modify_waybill',
          ]);
          this.$router.push({
            path: '/supplier_modify_waybill',
            query: {
              taxWaybillId: this.taxWaybillId,
              type: '0',
              category: this.category,
              classify: this.classify,
              waybillState: this.waybillState,
              isFromH5: '1',
            }, //type:0从详情进入修改，1：列表进入修改
          });
        });
      }
    },
    // 取消运单
    cancelWaybill() {
      this.onClickLeft();
    },
    // 支付明细
    paymentDetail() {
      this.$router.push({
        path: '/payment_detail',
        query: { taxWaybillId: this.taxWaybillId },
      });
    },
    // 修改记录点击事件
    gotoRecord() {
      this.$router.push({
        path: '/modification_record',
        query: { taxWaybillId: this.taxWaybillId },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.waybill_detail {
  .button {
    position: fixed;
    bottom: 0px;
    width: 100%;
    display: flex;
    .van-button {
      flex: 1;
      height: 50px;
      border-radius: 0px;
    }
  }
  .sub_page_base {
    .card_group {
      background: #ffffff;
      width: 100%;
      margin-top: 10px;
      position: relative;
      &:before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #d9d9d9;
        color: #d9d9d9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
      .list-card {
        width: 100%;
        .van-cell {
          padding: 12px;
        }
        .header_cell_title {
          color: #121212;
          font-weight: bold;
        }
        .card-left-cell {
          display: flex;
          display: -webkit-box;
          display: -webkit-flex;

          // min-height: 40px;
          // align-items: center;
          padding: 8px 12px;
          .left-cell-title {
            // flex: 1.4;
            // -webkit-flex: 1.4;
            width: 120px;
            height: 20px;
            line-height: 20px;
            text-align: justify;
            text-align-last: justify;
            color: #797979;
          }
          .left-cell-value {
            flex: 3;
            -webkit-flex: 3;
            color: #202020;
            word-break: break-word;
            margin-left: -2px;
          }
          .highLight {
            color: #ffba00;
          }
        }
      }
    }
  }
}
</style>
