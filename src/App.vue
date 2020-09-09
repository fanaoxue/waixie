<template>
  <div id="app">
    <keep-alive :exclude="excludeComponets">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {};
  },
  computed: {
    excludeComponets() {
      return this.$store.state.keepalive.excludeComponets;
    },
  },
  created() {},
  mounted() {},
};
</script>

<style lang="less">
@import url('../src/assets/style/base.less');
html,
body {
  padding: 0px;
  margin: 0px;
  background: #efefef;
}
#app {
  // font-family: Microsoft Yahei, Helvetica Neue, Tahoma, Arial,
  //   PingFangSC-Regular, Hiragino Sans GB, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 16px;
  height: 100vh;
  background: #efefef;
  .van-loading {
    text-align: center;
    top: 35%;
  }
  .van-button--disabled {
    opacity: 1;
    background: #aaaaaa;
    border: none;
  }
  .van-dialog__header {
    padding: 10px;
    font-weight: 500;
    line-height: 6.4vw;
    height: 6.4vw;
    background: @themeColor;
    text-align: center;
    color: #ffffff;
  }
}
</style>
