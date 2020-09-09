<template>
  <div class="hello">
    <c-header is-show-title class="header">
      <van-nav-bar title="我是快路宝H5项目所有路由容器跳转接口"></van-nav-bar>
    </c-header>
    <van-cell-group>
      <van-cell
        v-for="(item, index, key) in routerList"
        :key="key"
        :title="item.name"
        value
        is-link
        @click.native="routerClick(item.path, item.query)"
      ></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      routerList: [
        {
          name: '运费账户',
          path: '/freight_account_index',
        },
        {
          name: '收支明细',
          path: '/freight_account_list?subType=0',
          query: {
            sub_type: 2,
          },
        },
        {
          name: '可收列表',
          path: '/account_collected?orgId=88213510',
        },
        {
          name: '申请提前收款',
          path: '/apply_advance_payment',
        },
        {
          name: '了解服务详情',
          path: '/ad_server_detailed',
        },
        {
          name: '收款结果',
          path: '/collection_result?result_status=0',
        },
        {
          name: '企业端-派单',
          path: '/deliver_waybill',
        },
        {
          name: '企业端-修改模板',
          path: '/modify_template',
          query: {
            mWaybillTemplateId: '881',
          },
        },
        {
          name: '企业端-派单成功',
          path: '/deliver_waybill_success',
        },
        {
          name: '企业端-修改运单',
          path: '/business_modify_waybill',
          query: {
            taxWaybillId: '4015177',
            type: '0',
            category: 0,
            classify: 2,
            waybillState: 0,
            isFromH5: '1',
          },
        },
        {
          name: '企业端-申请支付',
          path: '/application_for_payment',
          query: {
            taxWaybillId: '3997287',
          },
        },
        {
          name: '企业端-确认应付运费',
          path: '/confirm_pay_freight',
          query: {
            taxWaybillId: '3997039',
          },
        },
        {
          name: '供应商-待派车',
          path: '/wait_for_dispatching_cars',
        },
        {
          name: '供应商-填写承运信息',
          path: '/write_car_information',
        },
        {
          name: '供应商-我的车队',
          path: '/my_fleet',
        },
        {
          name: '供应商-应付运费',
          path: '/should_pay_freight',
        },
        {
          name: '供应商-填写收款信息',
          path: '/write_receive_information',
        },
        {
          name: '供应商-收款人信息',
          path: '/receiver_information',
        },
        {
          name: '供应商-派车成功页',
          path: '/dispatching_cars_success',
        },
        {
          name: '供应商-修改运单',
          path: '/supplier_modify_waybill',
          query: {
            taxWaybillId: '4023426',
            isFromH5: '1',
            category: '0',
            classify: '1',
          },
        },
        {
          name: '供应商-确认支付',
          path: '/confirm_for_payment',
          query: {
            taxWaybillId: '4071792',
            payState: '5',
            type: '1',
            serialNumber: '4266925330',
          },
        },
        {
          name: '供应商-确认支付-二级页面',
          path: '/ensure_payment',
          query: {
            insFee: '20.00',
            payMoney: '80000.00',
            insFeeState: '0',
            personName: '丁娇',
            paymentCode: '000000',
            type: '1',
            walletPay: '0',
            taxWaybillId: '4071792',
            serialNumber: '4266925330',
          },
        },
        {
          name: '支付成功页',
          path: '/payment_success',
        },
        {
          name: '常用收款人',
          path: '/usually_receive_person',
          query: {
            taxWaybillId: '3996878',
            mobileNo: '15755185578',
            payeeName: '',
            hybWalletCfg: '8',
            autoShowWalletCfg: '8',
          },
        },
        {
          name: '运单信息-公用',
          path: '/waybill_information',
          query: {
            mWaybillTemplateId: '1736',
            taxWaybillId: '4015177',
            pagetype: '0',
          },
        },
        {
          name: '运单详情-公用',
          path: '/waybill_detail',
          query: {
            taxWaybillId: '4023426',
            category: '0',
            classify: '1',
            waybillState: '2',
          },
        },
        {
          name: '修改记录-公用',
          path: '/modification_record',
          query: {
            taxWaybillId: '3997039',
          },
        },
        {
          name: '支付明细-公用',
          path: '/payment_detail',
          query: {
            taxWaybillId: '3997024',
          },
        },
        {
          name: '终结运单-公用',
          path: '/stop_waybill',
          query: {
            taxWaybillId: '4000423',
            xid: '8436588',
            hybState: '2',
            category: '0',
            classify: '1',
          },
        },
        {
          name: '查看回单-公用',
          path: '/check_receipt',
          query: {
            taxWaybillId: '3997039',
            xid: '8436588',
            hybState: '2',
          },
        },
        {
          name: '德邦金融-我的货源',
          path: '/MySourceOfGoods',
        },
        {
          name: '德邦金融-货源搜索结果页',
          path: '/SearchGoodsResult',
        },
        {
          name: '车队长收款信息',
          path: '/car_master_receiveMsg',
        },
      ],
    };
  },
  created() {
    // this.$klb.confirm.show({
    //   title: '提示',
    //   confirmText: '确认',
    //   cancelText: '取消',
    //   content: '132',
    //   onConfirm: () => {
    //     //点击确定去建单
    //     // this.sub()
    //   }
    // })
  },
  methods: {
    routerClick(path, query) {
      this.$router.push({
        path: path,
        query: query,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
