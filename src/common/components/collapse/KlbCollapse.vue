<template>
  <div class="klb_collapse">
    <slot />
  </div>
</template>

<script>
/**
 * Collapse 折叠面板
 * @description 展示可以折叠 / 展开的内容区域
 * @property {Boolean} accordion = [true|false] 是否开启手风琴效果是否开启手风琴效果
 * @event {Function} change 切换面板时触发，activeNames（Array）：展开状态的CollapseItem的 name 值
 */
export default {
  name: 'KlbCollapse',
  props: {
    accordion: {
      // 是否开启手风琴效果
      type: [Boolean, String],
      default: false
    },
    showChecked: Boolean,
    curLen: Number,
    maxlength: {
      type: Number,
      default: 0
    },
    selectAll: [Boolean, String]
  },
  watch: {
    // 监听全选事件，循环勾选
    selectAll(flag) {
      if (flag === 'false') return
      this.changeSelectAll(flag)
    }
  },
  data() {
    return {}
  },
  provide() {
    return {
      collapse: this
    }
  },
  created() {
    this.childrens = []
  },
  methods: {
    onChange() {
      let activeItem = []
      this.childrens.forEach(vm => {
        if (vm.isOpen) {
          activeItem.push(vm.nameSync)
        }
      })
      this.$emit('change', activeItem)
    },
    changeSelectAll(flag) {
      const _this = this
      this.childrens.forEach((vm, index) => {
        if (flag) {
          if (!vm.checked) {
            vm.checked = true
            _this.$emit('checkeds', 'selectAll', index)
          }
        } else {
          if (vm.checked) {
            vm.checked = false
            _this.$emit('checkeds', 'selectAll', index)
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.klb_collapse {
  width: 100%;
}
</style>
