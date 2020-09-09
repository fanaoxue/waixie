<template>
  <div class="klb-collapse-content">
    <div class="klb-collapse-left" v-if="collapse.showChecked" @click.stop="handleChecked">
      <i
        class="iconfont"
        :class="{
          iconxuanzhongmingxi: checked,
          iconfuxuankuang3: !checked
        }"
      ></i>
    </div>
    <div
      class="klb-collapse-cell"
      :class="{
        'klb-collapse-cell--disabled': disabled,
        'klb-collapse-cell--notdisabled': !disabled,
        'klb-collapse-cell--open': isOpen,
        'klb-collapse-cell--hide': !isOpen,
        active: checked
      }"
    >
      <div class="klb-collapse-cell__title" @click.stop="onClick">
        <div class="klb-collapse-cell__title-text">
          <slot name="title">{{ title }}</slot>
        </div>
        <div
          :class="{
            'klb-collapse-cell__title-arrow-active': isOpen,
            'klb-collapse-cell--animation': showAnimation === true
          }"
          class="klb-collapse-cell__title-arrow"
        >
          <i class="van-icon van-icon-arrow van-cell__right-icon"></i>
        </div>
      </div>
      <div
        :class="{ 'klb-collapse-cell__content--hide': !isOpen }"
        class="klb-collapse-cell__content"
      >
        <div
          :class="{ 'klb-collapse-cell--animation': showAnimation === true }"
          class="klb-collapse-cell__wrapper van-hairline--top"
          :style="{
            transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
            '-webkit-transform': isOpen ? 'translateY(0)' : 'translateY(-100%)'
          }"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * CollapseItem 折叠面板子组件
 * @description 折叠面板子组件
 * @property {String} title 标题文字
 * @property {String} thumb 标题左侧缩略图
 * @property {Boolean} disabled = [true|false] 是否展开面板
 * @property {Boolean} showAnimation = [true|false] 开启动画
 */
export default {
  name: 'KlbCollapseItem',
  components: {},
  props: {
    title: {
      // 列表标题
      type: String,
      default: '',
    },
    name: {
      // 唯一标识符
      type: [Number, String],
      default: 0,
    },
    disabled: {
      // 是否禁用
      type: Boolean,
      default: false,
    },
    showAnimation: {
      // 是否显示动画
      type: Boolean,
      default: false,
    },
    open: {
      // 是否展开
      type: Boolean,
      default: false,
    },
    thumb: {
      // 缩略图
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
      checked: false,
    };
  },
  watch: {
    open(val) {
      this.isOpen = val;
    },
  },
  inject: ['collapse'],
  created() {
    this.isOpen = this.open;
    this.nameSync = this.name ? this.name : this.collapse.childrens.length;
    this.collapse.childrens.push(this);
    if (String(this.collapse.accordion) === 'true') {
      if (this.isOpen) {
        let lastEl = this.collapse.childrens[
          this.collapse.childrens.length - 2
        ];
        if (lastEl) {
          this.collapse.childrens[
            this.collapse.childrens.length - 2
          ].isOpen = false;
        }
      }
    }
    // 下拉刷新数据时，若勾选了全选，则下面的数据依然保持勾选状态
    if (this.collapse.selectAll) {
      // this.collapse.changeSelectAll && this.collapse.changeSelectAll(true)
    }
  },
  methods: {
    onClick() {
      if (this.disabled) {
        return;
      }
      if (String(this.collapse.accordion) === 'true') {
        this.collapse.childrens.forEach(vm => {
          if (vm === this) {
            return;
          }
          vm.isOpen = false;
        });
      }
      this.isOpen = !this.isOpen;
      this.collapse.onChange && this.collapse.onChange();
      this.$forceUpdate();
    },
    handleChecked() {
      if (this.collapse.maxlength === 0) {
        this.checked = !this.checked;
        this.$emit('checked');
        return;
      }
      if (this.collapse.curLen < this.collapse.maxlength) {
        this.checked = !this.checked;
        this.$emit('checked');
      } else {
        if (this.checked) {
          this.checked = false;
          this.$emit('checked');
        } else {
          this.$emit('beyond');
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.klb-collapse-content {
  display: flex;
  margin-bottom: 10px;
  .klb-collapse-left {
    // color: #fff;
    font-size: 16px;
    margin-right: 10px;
    .iconfuxuankuang3,
    .iconxuanzhongmingxi {
      position: relative;
      padding: 0px 1px;
      top: 15px;
      background-color: #ffffff;
      color: #9f9f9f;
    }
    .iconxuanzhongmingxi {
      color: #15499a;
    }
  }
  .klb-collapse-cell {
    flex: 1;
    background-color: #fff;
    border: 1px solid #fff;
    &.active {
      border: 1px solid #15499a;
    }
    &.klb-collapse-cell--open {
      background-color: #fff;
      .klb-collapse-cell__title {
        .van-cell__right-icon {
          &::before {
            transform: rotate(-90deg);
          }
        }
      }
    }
    .klb-collapse-cell__title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      // align-items: center;
      position: relative;
      overflow: hidden;
      color: #323233;
      font-size: 14px;
      line-height: 20px;
      padding: 15px 10px;
      .klb-collapse-cell__title-arrow {
        width: 20px;
        height: 20px;
      }
      .van-cell__right-icon {
        color: #121212;
        &::before {
          transform: rotate(90deg);
          transition: transform 0.3s;
        }
      }
      .klb-collapse-cell__title-text {
        flex: 1;
        font-size: 14px;
        white-space: nowrap;
        color: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .klb-collapse-cell__content {
      overflow: hidden;
      .klb-collapse-cell__wrapper {
        display: flex;
        flex-direction: column;
        padding: 15px 10px;
      }
    }
  }
}

.klb-collapse-cell--disabled {
  background-color: #f1f1f1;
}
.klb-collapse-cell--hide {
  min-height: 48px;
  // max-height: 68px;
}
.klb-collapse-cell--animation {
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}

.klb-collapse-cell__content--hide {
  height: 0px;
  line-height: 0px;
}
</style>
