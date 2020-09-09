import Vue from 'vue';
import VueRouter from 'vue-router';
import HelloWorld from '../views/HelloWorld.vue';
import FreightAccount from './modules/freightaccount'; // 运费账户
import Externalassistance from './modules/externalassistance'; // 外协企业和供应商
import Activity from './modules/activity'; // 外协企业和供应商
import DB from './modules/DB.js'; // 外协业务1.1-德邦金融&保险方案
import Transfer from './modules/transfer.js'; // 中转

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'hello_world',
    component: HelloWorld,
  },
  {
    path: '/error_page',
    name: 'error_page',
    component: () => import('@/components/error/index.vue'),
  },
  ...FreightAccount,
  ...Externalassistance,
  ...Activity,
  ...DB,
  ...Transfer,
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  // scrollBehavior: () => ({ y: 0 }),
  routes,
});

export default router;
