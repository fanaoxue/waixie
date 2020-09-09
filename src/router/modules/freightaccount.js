const FreightAccountIndex = () =>
  import('@/views/freightaccount/FreightAccountIndex')
const FreightAccountList = () =>
  import('@/views/freightaccount/FreightAccountList')
const AccountCollected = () => import('@/views/freightaccount/AccountCollected')
const ApplyAdvancePayment = () =>
  import('@/views/freightaccount/ApplyAdvancePayment')
const AdServerDetailed = () => import('@/views/freightaccount/AdServerDetailed')
const CollectionResult = () => import('@/views/freightaccount/CollectionResult')

export default [
  {
    path: '/freight_account_index',
    name: 'freight_account_index',
    component: FreightAccountIndex
  },
  {
    path: '/freight_account_list',
    name: 'freight_account_list',
    component: FreightAccountList
  },
  {
    path: '/account_collected',
    name: 'account_collected',
    component: AccountCollected
  },
  {
    path: '/apply_advance_payment',
    name: 'apply_advance_payment',
    component: ApplyAdvancePayment
  },
  {
    path: '/ad_server_detailed',
    name: 'ad_server_detailed',
    component: AdServerDetailed
  },
  {
    path: '/collection_result',
    name: 'collection_result',
    component: CollectionResult
  }
]
