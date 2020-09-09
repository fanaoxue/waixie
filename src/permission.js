import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { Toast } from 'vant';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ['/error_page','/CallApp']; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();
  const hasPermission = store.getters.permissionType;
  if (hasPermission) {
    next();
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      try {
        await store.dispatch('permission/getPermission');
        next({ ...to, replace: true });
      } catch (error) {
        Toast(error || 'Has Error');
        next();
        NProgress.done();
      }
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
