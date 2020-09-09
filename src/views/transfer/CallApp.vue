<!-- CallApp -->
<template>
  <div class="CallApp"></div>
</template>

<script>
import { APP_URL } from '@/assets/js/consts.js';
import CallAppLib from 'callapp-lib';
export default {
  name: 'CallApp',
  data() {
    return {
      url: this.$route.query.url || '',
      tag: this.$route.query.tag || '',
      timestamp: Number(this.$route.query.timestamp) || 0,
    };
  },
  components: {},
  computed: {},
  mounted() {
    if (new Date().getTime() - this.timestamp < 48*60*60*1000) {
    // if (new Date().getTime() - this.timestamp < 10*60*1000) {
      if (this.tag == '1') {
        this.url = APP_URL + '/MySourceOfGoods';
      }
      this.init();
    } else {
      this.$toast('链接已失效！')
    }
  },
  methods: {
    init() {
      // 法一
      //   if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
      //     // ios
      //     window.location.href = `klb://dispatcher/start?url=${encodeURIComponent(
      //       'https://test-microservice.log56.com/m_extassist_h5/dist/#/MySourceOfGoods',
      //     )}`;
      //     console.log(
      //       `iosScheme:  klb://dispatcher/start?url=https://test-microservice.log56.com/m_extassist_h5/dist/#/MySourceOfGoods`,
      //     );
      //     setTimeout(() => {
      //       console.log('ios下载地址');
      //       window.location.href =
      //         'http://itunes.apple.com/cn/app/id1447587911?mt=8';
      //     }, 2000);
      //   } else if (navigator.userAgent.match(/android/i)) {
      //     // Android
      //     window.location.href = `klb://dispatcher/start?url=${encodeURIComponent(
      //       'https://test-microservice.log56.com/m_extassist_h5/dist/#/MySourceOfGoods',
      //     )}`;
      //     console.log(
      //       `AndroidScheme:  klb://dispatcher/start?url=https://test-microservice.log56.com/m_extassist_h5/dist/#/MySourceOfGoods`,
      //     );
      //     setTimeout(() => {
      //       console.log('Android下载地址');
      //       window.location.href =
      //         'https://a.app.qq.com/o/simple.jsp?pkgname=com.wtyt.lggcb.diaodu';
      //     }, 2000);
      //   } else {
      //     // todo
      //   }
      //   ==========================================================================
      //   法二
      let option = '';
      if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
        // ios
        option = {
          scheme: {
            protocol: 'klb',
          },
          outChain: {
            protocol: 'klb',
            path: 'dispatcher/start',
            key: 'url',
          },
          appstore: 'http://itunes.apple.com/cn/app/id1447587911?mt=8',
          fallback: 'http://itunes.apple.com/cn/app/id1447587911?mt=8',
          timeout: 2000,
          buildScheme: () => {
            return this.url;
          },
        };
      } else {
        option = {
          scheme: {
            protocol: 'klb',
          },
          outChain: {
            protocol: 'klb',
            path: 'dispatcher/start',
            key: 'url',
          },
          yingyongbao:
            'https://a.app.qq.com/o/simple.jsp?pkgname=com.wtyt.lggcb.diaodu',
          fallback:
            'https://a.app.qq.com/o/simple.jsp?pkgname=com.wtyt.lggcb.diaodu',
          timeout: 2000,
          buildScheme: () => {
            return this.url;
          },
        };
      }
      // 触发方式：
      const lib = new CallAppLib(option);
      lib.open({});
    },
  },
};
</script>
<style lang="less">
.CallApp {
}
</style>
