export default [
  {
    path: '/MySourceOfGoods',
    name: 'MySourceOfGoods',
    component: () => import('@/views/DB/MySourceOfGoods.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/WaybillLink',
    name: 'WaybillLink',
    component: () => import('@/views/DB/WaybillLink.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/SupplySuccess',
    name: 'SupplySuccess',
    component: () => import('@/views/DB/SupplySuccess.vue'),
  },
  {
    path: '/Quotation',
    name: 'Quotation',
    component: () => import('@/views/DB/Quotation.vue'),
  },
  {
    path: '/QuotationSuccess',
    name: 'QuotationSuccess',
    component: () => import('@/views/DB/QuotationSuccess.vue'),
  },
  {
    path: '/SearchGoodsResult',
    name: 'SearchGoodsResult',
    component: () => import('@/views/DB/SearchGoodsResult.vue'),
    meta: {
      keepAlive: true,
    },
  },
];
