<template>
  <div class="circle">
    <!-- 可以拖拽的悬浮按钮 -->
    <div
      class="xuanfu"
      ref="div"
      v-show="showState"
      @click="gotoRecord"
      @mousedown="down"
      @mousemove="move"
      @mouseup="end"
      @touchstart="down"
      @touchmove.prevent="move"
      @touchend="end"
    >
      <img src="../../../assets/imgs/xuanfu_icon@2x.png" alt width="30px" height="30px" />
      <p>修改记录</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dragCircle',
  props: {
    showState: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: '',
      moveDiv: '',
      flags: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.moveDiv = this.$refs.div
    })
  },
  methods: {
    gotoRecord() {
      this.$emit('fn')
    },
    // 实现移动端拖拽
    down() {
      this.flags = true
      var touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.position.x = touch.clientX
      this.position.y = touch.clientY
      this.dx = this.moveDiv.offsetLeft
      this.dy = this.moveDiv.offsetTop
    },
    move() {
      if (this.flags) {
        var touch
        if (event.touches) {
          touch = event.touches[0]
        } else {
          touch = event
        }
        this.nx = touch.clientX - this.position.x
        this.ny = touch.clientY - this.position.y
        this.xPum = this.dx + this.nx
        this.yPum = this.dy + this.ny
        this.moveDiv.style.left = this.xPum + 'px'
        this.moveDiv.style.top = this.yPum + 'px'
        //阻止页面的滑动默认事件
        // document.addEventListener("touchmove",function(){
        //     event.preventDefault();
        // },false);
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false
    }
  }
}
</script>
<style lang="less" scoped>
.circle {
  .xuanfu {
    height: 4.0rem;
    width: 4.0rem;
    position: fixed;
    bottom: 5rem;
    right: 0.5rem;
    border-radius: 50%;
    background-color: #ffba00;
    z-index: 990;
    box-shadow: 0px 0px 1px 1px #ccc;
    touch-action: none;
    img {
      position: absolute;
      left: 50%;
      top: 47%;
      transform: translateX(-40%) translateY(-80%);
    }
    p {
      position: absolute;
      font-size: 12px;
      color: #fff;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 60px;
      text-align: center;
    }
  }
}
</style>