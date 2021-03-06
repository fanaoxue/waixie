<template>
  <div class="pr-wrap">
    <div class="wrap-part first">
      <vuescroll
        ref="vs"
        :ops="ops"
        @refresh-start="handleRS"
        @load-before-deactivate="handleLBD"
        @refresh-before-deactivate="handleRBD"
        @load-start="handleLoadStart"
      >
        <slot></slot>
        <div slot="load-beforeDeactive" v-if="noData">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="8056"
          >
            <path
              d="M469.333333 384h85.333334v213.333333h-85.333334z m0 298.666667h85.333334v85.333333h-85.333334z"
              fill
              p-id="8057"
            />
            <path
              d="M549.717333 108.032c-14.762667-27.904-60.672-27.904-75.434666 0l-384 725.333333A42.624 42.624 0 0 0 128 896h768a42.581333 42.581333 0 0 0 37.674667-62.592L549.717333 108.032zM198.869333 810.666667L512 219.221333 825.130667 810.666667H198.869333z"
              fill
              p-id="8058"
            />
          </svg>
          暂无更多
        </div>
      </vuescroll>
    </div>
  </div>
</template>

<script>
// 参考地址：https://vuescrolljs.yvescoding.org/zh/guide/
import vuescroll from 'vuescroll'
export default {
  props: {
    // 距离底部触发自动加载的距离
    autoLoadDistance: {
      default: 10
    },
    // 是否开启下拉刷新
    isRefresh: {
      default: true
    },
    // 是否开启上拉加载
    isPushLoad: {
      default: true
    },
    // 数据是否全部加载完成 true为全部加载完成
    noData: {
      default: false
    },
    // 下拉刷新开始
    refreshStart: {
      default: () => {}
    },
    // 下拉刷新完成之后
    refreshDeactivate: {
      default: () => {}
    },
    // 上拉开始
    loadStart: {
      default: () => {}
    },
    // 上拉完成之后
    loadDeactivate: {
      default: () => {}
    }
  },
  components: { vuescroll },
  data() {
    const config = {}
    const ops = {
      vuescroll: {
        mode: 'slide',
        pullRefresh: {
          enable: this.isRefresh
        },
        pushLoad: {
          enable: this.isPushLoad,
          auto: true, //是否自动触发加载
          autoLoadDistance: this.autoLoadDistance
        }
      },
      bar: {
        opacity: 0
      }
    }
    ops.vuescroll.pullRefresh.tips = {
      deactive: '下拉刷新',
      active: '释放刷新',
      start: '刷新中...',
      beforeDeactive: '刷新成功!'
    }
    ops.vuescroll.pushLoad.tips = {
      deactive: '上拉加载',
      active: '释放加载',
      start: '加载中...',
      beforeDeactive: '加载成功!'
    }
    return {
      ops,
      config
    }
  },
  methods: {
    // 刷新开始
    // vsInstance vm===this
    // refreshDom === 刷新dom
    handleRS(vsInstance, refreshDom, done) {
      if (this.refreshStart) {
        this.refreshStart(done)
      } else {
        this.setDone(done)
      }
    },
    // 刷新完之后
    handleRBD(vm, loadDom, done) {
      if (this.refreshDeactivate) {
        this.refreshDeactivate(done)
      } else {
        setTimeout(() => {
          this.setDone(done)
        }, 600)
      }
    },
    // 上拉开始
    handleLoadStart(vm, dom, done) {
      if (this.loadStart) {
        this.loadStart(done)
      } else {
        this.setDone(done)
      }
    },
    // 上拉完成后
    handleLBD(vm, loadDom, done) {
      if (!this.$parent.noData) {
        if (this.loadDeactivate) {
          this.loadDeactivate(done)
        } else {
          setTimeout(() => {
            this.setDone(done)
          }, 600)
        }
      } else {
        setTimeout(() => {
          this.setDone(done)
        }, 600)
      }
    },
    // 手动触发 外部通过ref触发
    // type load 为加载   refresh 为刷新
    trigger(type = 'load') {
      this.$refs['vs'].triggerRefreshOrLoad(type)
    },
    setDone(done) {
      done()
    }
  }
}
</script>

<style lang="less" scoped>
.pr-wrap {
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
  .wrap-part {
    height: 100%;
    &.first {
      width: 100%;
    }
  }
  /deep/.__vuescroll .__refresh {
    // height: 0px;
    // line-height: 0px;
    top: -40px;
  }
  /deep/ .__vuescroll .__load {
    bottom: -40px !important;
  }
  /deep/ .__vuescroll {
    .__refresh svg,
    .__load svg {
      width: 20px;
      height: 20px;
    }
    .__refresh svg path,
    .__refresh svg rect,
    .__load svg path,
    .__load svg rect {
      fill: #15499a;
    }
    .__refresh svg.start .active-path,
    .__load svg.start .active-path {
      stroke: #15499a;
    }
  }
}
</style>
