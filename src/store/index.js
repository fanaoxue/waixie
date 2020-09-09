import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import settings from './modules/settings';
import loading from './modules/loading';
import cityData from './modules/cityData';
import myfleet from './modules/myfleet';
import applyPayMsg from './modules/wayBillApplyPay';
import permission from './modules/permission';
import buildWaybill from './modules/buildWaybill';
import oilCard from './modules/oilCard';
import keepalive from './modules/keepalive';
import goodsSupply from './modules/goodsSupply';
import carTeamMasterInfo from './modules/carTeamMasterInfo'
import createLogger from 'vuex/dist/logger';

const debug = process.env.VUE_APP_ENV !== 'production';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    settings,
    loading,
    cityData,
    myfleet,
    applyPayMsg,
    permission,
    buildWaybill,
    oilCard,
    keepalive,
    goodsSupply,
    carTeamMasterInfo
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

export default store;
