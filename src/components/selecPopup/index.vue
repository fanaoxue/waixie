<template>
  <div>
    <div class="van-hairline--top-bottom van-picker__toolbar">
      <button type="button" class="van-picker__cancel" @click="cancel">取消</button>
      <button type="button" class="van-picker__confirm" @click="submit">确认</button>
    </div>
    <div class="car_msg_choose">
      <div
        class="car_choose_btn"
        v-for="(item, index, key) in arrayList"
        :class="{ 'choose-btn-active': active === index }"
        @click="active = index"
        :key="key"
      >{{ item.type }}</div>
    </div>
    <div class="self_ipt" v-if="inputShow">
      <span>其他：</span>
      <input type="number" :placeholder="inputPlaceholder" v-model="input" @click="active = -1" />
      <span>{{ inputUnit }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'selecPopup',
  props: {
    arrayList: Array,
    inputShow: {
      type: Boolean,
      default: false
    },
    inputPlaceholder: {
      type: String,
      default: '请输入车长'
    },
    inputUnit: {
      type: String,
      default: '米'
    }
  },
  data() {
    return {
      active: -1,
      input: ''
    }
  },
  methods: {
    cancel() {
      this.$emit('on-cancle')
    },
    submit() {
      if (this.active === -1) {
        if (this.input === '') {
          this.$toast('请选择~~~', 'middle')
          return false
        } else {
          let reg = /^\d+(\.\d{1,2})?$/
          if (!reg.test(this.input)) {
            this.$toast('输入的不符合规则~~~', 'middle')
            return false
          }
        }
      }
      let val
      if (this.active >= 0) {
        val = this.arrayList[this.active].type
      } else {
        val = this.input + this.inputUnit
      }
      this.$emit('on-submit', val)
    }
  }
}
</script>

<style lang="less" scoped>
.car_msg_choose {
  width: 100%;
  min-height: 56px;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  .car_choose_btn {
    width: 30%;
    text-align: center;
    height: 2rem;
    line-height: 2rem;
    border-radius: 0.3125rem;
    color: #797979;
    background: #f6f6f6;
    margin: 0.625rem 0.3rem;
  }
  .choose-btn-active {
    background-color: #1581cf;
    color: #fff;
  }
}
.self_ipt {
  font-size: 16px;
  color: #797979;
  display: block;
  height: 36px;
  padding-left: 6px;
  background: #fff;
  padding-bottom: 10px;
  input {
    font-size: inherit;
    color: #797979;
    width: 65%;
    height: 32px;
    line-height: 32px;
    border: 1px solid #d9d9d9;
    margin-left: 2.4%;
    text-indent: 5px;
    outline: none;
    background: #f6f6f6;
  }
}
</style>
