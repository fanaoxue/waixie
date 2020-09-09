const DeliverWaybill = () => import('@/views/externalassistance/DeliverWaybill')
const WaybillInformation = () =>
  import('@/views/externalassistance/WaybillInformation')
const DeliverWaybillSuccess = () =>
  import('@/views/externalassistance/DeliverWaybillSuccess')
const WaybillDetail = () => import('@/views/externalassistance/WaybillDetail')
const BusinessModifyWaybill = () =>
  import('@/views/externalassistance/BusinessModifyWaybill')
const ApplicationForPayment = () =>
  import('@/views/externalassistance/ApplicationForPayment')
const StopWaybill = () => import('@/views/externalassistance/StopWaybill')
const ModificationRecord = () =>
  import('@/views/externalassistance/ModificationRecord')
const ConfirmPayFreight = () =>
  import('@/views/externalassistance/ConfirmPayFreight')
const WaitForDispatchingCars = () =>
  import('@/views/externalassistance/WaitForDispatchingCars')
const WriteCarInformation = () =>
  import('@/views/externalassistance/WriteCarInformation')
const MyFleet = () => import('@/views/externalassistance/MyFleet')
const ShouldPayFreight = () =>
  import('@/views/externalassistance/ShouldPayFreight')
const WriteReceiveInformation = () =>
  import('@/views/externalassistance/WriteReceiveInformation')
const ReceiverInformation = () =>
  import('@/views/externalassistance/ReceiverInformation')
const DispatchingCarsSuccess = () =>
  import('@/views/externalassistance/DispatchingCarsSuccess')
const SupplierModifyWaybill = () =>
  import('@/views/externalassistance/SupplierModifyWaybill')
const PaymentDetail = () => import('@/views/externalassistance/PaymentDetail')
const ModifyTemplate = () => import('@/views/externalassistance/ModifyTemplate')
const CarMasterReceiveMsg = () => import('@/views/externalassistance/CarMasterReceiveMsg')

export default [
  {
    path: '/deliver_waybill',
    name: 'deliver_waybill',
    component: DeliverWaybill,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/waybill_information',
    name: 'waybill_information',
    component: WaybillInformation,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/deliver_waybill_success',
    name: 'deliver_waybill_success',
    component: DeliverWaybillSuccess
  },
  {
    path: '/waybill_detail',
    name: 'waybill_detail',
    component: WaybillDetail,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/business_modify_waybill',
    name: 'business_modify_waybill',
    component: BusinessModifyWaybill,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/application_for_payment',
    name: 'application_for_payment',
    component: ApplicationForPayment
  },
  {
    path: '/stop_waybill',
    name: 'stop_waybill',
    component: StopWaybill
  },
  {
    path: '/modification_record',
    name: 'modification_record',
    component: ModificationRecord
  },
  {
    path: '/confirm_pay_freight',
    name: 'confirm_pay_freight',
    component: ConfirmPayFreight,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/wait_for_dispatching_cars',
    name: 'wait_for_dispatching_cars',
    component: WaitForDispatchingCars,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/write_car_information',
    name: 'write_car_information',
    component: WriteCarInformation,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/my_fleet',
    name: 'my_fleet',
    component: MyFleet
  },
  {
    path: '/should_pay_freight',
    name: 'should_pay_freight',
    component: ShouldPayFreight,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/write_receive_information',
    name: 'write_receive_information',
    component: WriteReceiveInformation,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/receiver_information',
    name: 'receiver_information',
    component: ReceiverInformation
  },
  {
    path: '/dispatching_cars_success',
    name: 'dispatching_cars_success',
    component: DispatchingCarsSuccess
  },
  {
    path: '/supplier_modify_waybill',
    name: 'supplier_modify_waybill',
    component: SupplierModifyWaybill,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/payment_detail',
    name: 'payment_detail',
    component: PaymentDetail
  },
  {
    path: '/modify_template',
    name: 'modify_template',
    component: ModifyTemplate,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/choose_oil_card',
    name: 'choose_oil_card',
    component: () => import('@/views/externalassistance/ChooseOilCard')
  },
  {
    path: '/add_oil_card',
    name: 'add_oil_card',
    component: () => import('@/views/externalassistance/AddOilCard')
  },
  {
    path: '/choose_city',
    name: 'choose_city',
    component: () => import('@/components/chooseCity')
  },
  {
    path: '/check_receipt',
    name: 'check_receipt',
    component: () => import('@/views/externalassistance/CheckReceipt')
  },
  {
    path: '/alipay_qrcode',
    name: 'alipay_qrcode',
    component: () => import('@/views/externalassistance/AlipayQRcode')
  },
  {
    path: '/confirm_for_payment',
    name: 'confirm_for_payment',
    component: () => import('@/views/externalassistance/ConfirmForPayment'),
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/usually_receive_person',
    name: 'usually_receive_person',
    component: () => import('@/views/externalassistance/UsuallyReceivePerson')
  },
  {
    path: '/claim_rules',
    name: 'claim_rules',
    component: () => import('@/views/externalassistance/ClaimRules')
  },
  {
    path: '/payment_success',
    name: 'payment_success',
    component: () => import('@/views/externalassistance/paymentSuccess')
  },
  {
    path: '/ensure_payment',
    name: 'ensure_payment',
    component: () => import('@/views/externalassistance/EnsurePayment')
  },
  {
    path: '/car_master_receiveMsg',
    name: 'car_master_receiveMsg',
    component: () => import('@/views/externalassistance/CarMasterReceiveMsg'),
    meta: {
      keepAlive: true
    }
  }
]
