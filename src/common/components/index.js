import './vantIntroduce';
import CommonHeader from './commonHeader';
import Confirm1 from './confirm/index.js';
import carIpt from './carIpt';
import klbCollapse from './collapse/KlbCollapse.vue';
import klbCollapseItem from './collapse/KlbCollapseItem';
import VueScroll from './vueScroll';
// eslint-disable-next-line
const install = (Vue, config = {}) => {
  Vue.use(Confirm1);
  Vue.$carIpt = Vue.prototype.$carIpt = carIpt;
  // Vue.$sysType = Vue.prototype.$sysType = sysType()
  Vue.component('c-header', CommonHeader);
  Vue.component('klb-collapse', klbCollapse);
  Vue.component('klb-collapse-item', klbCollapseItem);
  Vue.component('vue-scroll', VueScroll);
};

export default install;
