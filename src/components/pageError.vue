<template>
  <div style="text-align: center;margin-top:50px;">
    <img alt src="../assets/imgs/ydzz_konghezi@2x.png" width="125" />
    <div class="p">{{ errorMsg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    errorMsg: {
      type: String,
      default: '呜呜呜~~~当前暂无数据。'
    }
  },
  created() {}
}
</script>

<style scoped>
.p {
  width: 100%;
  color: rgba(121, 121, 121, 1);
  line-height: 24px;
  text-align: center;
  margin-top: 24px;
}
</style>    