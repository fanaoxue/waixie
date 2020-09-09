<template>
  <div class="Countdown ignore">
    <span v-if="flag"> 剩余时效:{{ time }} </span>
    <span v-else>
      已失效
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      flag: true,
      time: '',
      endTime: 0,
    };
  },
  mounted() {
    const timeDiff = this.timeDiff * 60 * 1000;
    let startTime = this.startTime.replace(/(-)/g, '/');
    startTime = new Date(startTime).getTime();
    const nowTime = new Date().getTime();
    if (nowTime - startTime > timeDiff) {
      this.flag = false;
      this.$emit('time-end');
    } else {
      this.endTime = timeDiff + startTime;
      let timer = setInterval(() => {
        if (this.flag === false) {
          clearInterval(timer);
        }
        this.timeDown();
      }, 500);
      this.$once('hook:beforeDestroy', () => {
        timer = null;
      });
    }
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    startTime: {
      type: String,
    },
    timeDiff: {
      type: String,
      default: '0',
    },
  },
  methods: {
    timeDown() {
      const nowTime = new Date().getTime();
      let leftTime = parseInt((this.endTime - nowTime) / 1000);
      if (leftTime <= 0) {
        this.flag = false;
        this.$emit('time-end');
        return;
      }
      //   let d = parseInt(leftTime / (24 * 60 * 60));
      // let h = this.formate(parseInt((leftTime / (60 * 60)) % 24));
      let h = parseInt((leftTime / (60 * 60)) % 24);
      let m = this.formate(parseInt((leftTime / 60) % 60));
      // let s = this.formate(parseInt(leftTime % 60));
      //   this.timer = `${d}天${h}小时${m}分${s}秒`;
      this.time = `${h}:${m}`;
    },
    formate(time) {
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.Countdown.ignore {
  font-size: 14px;
  color: #ff8a00;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  span {
    line-height: normal;
  }
}
</style>
