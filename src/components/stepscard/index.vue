<template>
  <div class="step_scard">
    <div class="steps">
      <div class="steps-flex">
        <div class="flex_1" v-for="(item,index) in timeLine" :key="index">
          <div
            class="child_flex_1"
            :class="{'white':index == 0,'green':item.peizhi == 1,'dash':item.peizhi == 0}"
          ></div>
          <div class="child_flex_1 circle">
            <img :src="item.img" alt class="img_45" />
            <p class="time" :class="{'text_gray':item.peizhi == 0}">{{item.timeName}}</p>
            <p
              class="time_val"
              :class="{'text_gray':item.peizhi == 0}"
              v-show="item.peizhi == 1"
            >{{item.timeValue}}</p>
          </div>
          <div
            class="child_flex_1"
            :class="{'green':index == 0,'green':item.peizhi == 1,'dash':item.peizhi == 0,'white':index == timeLine.length-1}"
          ></div>
        </div>
        <!-- <div class="flex_1">
            <div class="child_flex_1 dash"></div>
            <div class="child_flex_1 circle">
              <img :src="fache" alt class="img_45" />
              <h3 class="time text_gray">派车时间</h3>
              <p class="time_val text_gray">2019-05-13 17:55</p>
            </div>
            <div class="child_flex_1 dash"></div>
          </div>
          <div class="flex_1">
            <div class="child_flex_1 dash"></div>
            <div class="child_flex_1 circle">
              <img :src="daochang" alt class="img_45" />
              <h3 class="time text_gray">到场时间</h3>
              <p class="time_val text_gray">2019-05-14 17:55</p>
            </div>
            <div class="child_flex_1 dash"></div>
          </div>
          <div class="flex_1">
            <div class="child_flex_1 dash"></div>
            <div class="child_flex_1 circle">
              <img :src="daoda" alt class="img_45" />
              <h3 class="time text_gray">到达时间</h3>
              <p class="time_val text_gray">2019-05-15 17:55</p>
            </div>
            <div class="child_flex_1 white"></div>
        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'stepsCard',
  props: {
    timeLine: {
      type: [Object, Array],
      default: () => {}
    }
  }
}
</script>
<style lang="less">
.step_scard {
  //进度条自定义样式
  margin-top:10px;
  .steps {
    width: 100%;
    height: 120px;
    padding-top: 15px;
    background: #ffffff;
    &-flex {
      display: flex;
      .flex_1 {
        flex: 1;
        display: flex;
        position: relative;
        flex-direction: row;
        align-items: center;
        .child_flex_1 {
          flex: 1;
        }
        .circle {
          position: relative;
          color: #121212;
          .time {
            position: absolute;
            font-size: 16px;
            width: 70px;
            left: -14px;
            top: 54px;
            font-weight: bold;
            text-align: center;
          }
          .time_val {
            position: absolute;
            font-size: 12px;
            width: 98px;
            left: -30px;
            top: 76px;
            text-align: center;
          }
          .text_gray {
            color: #cfcfcf;
          }
        }
        .green {
          height: 2px;
          background: #28b072;
        }
        .dash {
          height: 2px;
          background: #dcdcdc;
        }
        .white {
          height: 2px;
          background: #ffffff;
        }
        .img_45 {
          width: 45px;
          height: 45px;
        }
      }
    }
  }
}
</style>