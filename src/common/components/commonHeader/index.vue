<template>
  <div class="com_header">
    <slot></slot>
  </div>
</template>

<script>
import { setNativeHead } from '@/assets/js/app';
export default {
  name: 'CommonHeader',
  data() {
    return {};
  },
  created() {
    setNativeHead({
      isShow: '0',
    });
  },
};
</script>

<style lang="less" scoped>
.com_header {
  z-index: 99999;
  .van-nav-bar {
    z-index: 99999 !important;
  }
  .van-hairline--bottom::after {
    border-bottom-width: 0px !important;
  }
}
</style>
