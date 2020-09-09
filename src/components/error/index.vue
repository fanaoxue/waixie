<template>
  <div class="error-page" @click="refresh">
    <c-header class="header">
      <van-nav-bar title="出错了~~~" left-arrow @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div style="text-align: center;margin-top:50px;">
      <img alt src="./ydzz_konghezi@2x.png" width="125" />
      <div class="p">{{ errorMsg }}</div>
      <div v-if="isShowRefresh" class="p">点击刷新</div>
    </div>
  </div>
</template>

<script>
import { AppFinish } from '@/assets/js/app'
export default {
  data() {
    return {
      errorMsg: this.$route.query.errorMsg || '访问错误，请稍后再试~~~',
      isShowRefresh: false
    }
  },
  created() {
    // this.$store.commit('updateLoadingStatus', { isLoading: false })
    // ApphiddenNativeNav();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == 'TCIndex') {
        vm.isShowRefresh = true
      } else {
        vm.isShowRefresh = false
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    // eslint-disable-next-line
    if (to.name == 'TCIndex') {
    } else {
      AppFinish(-1)
    }
    next()
  },
  methods: {
    refresh() {
      this.isShowRefresh && this.$router.go(-1)
    },
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.error-page {
  height: 100vh;
}
.p {
  width: 100%;
  color: rgba(121, 121, 121, 1);
  line-height: 24px;
  text-align: center;
  margin-top: 24px;
}
</style>
