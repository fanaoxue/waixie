<template>
  <div class="klb_confirm">
    <!-- closeable -->
    <van-popup
      :close-on-click-overlay="closeOnClickCOverlay"
      :close-on-popstate="closeOnPopstate"
      v-model="showValue"
      :style="{ top: '45%', left: '50%', width: '90%' }"
      class="klb_popup"
    >
      <div class="klb_popup_div">
        <div class="klb_dialog__hd" v-if="!!title">
          <span class="klb_dialog__title">{{ title }}</span>
          <span @click="_on_Cancel" class="close_style">×</span>
        </div>
        <template v-if="showContent" class="van-dialog__content">
          <div class="klb_dialog__bd" v-if="!showInput">
            <slot>
              <div v-html="content" class="van-dialog__message"></div>
            </slot>
          </div>
          <div v-else class="klb_dialog_prompt">
            <input
              class="klb_dialog_prompt_msgbox"
              v-bind="getInputAttrs()"
              v-model="msg"
              :placeholder="placeholder"
              @touchend="setInputFocus"
              ref="input"
            />
          </div>
        </template>
        <div class="van-hairline--top van-dialog__footer van-dialog__footer--buttons">
          <button
            v-if="showCancelButton"
            href="javascript:;"
            class="van-button van-button--default van-button--large van-dialog__cancel"
            @click="_onCancel"
          >{{ cancelText }}</button>
          <button
            v-if="showConfirmButton"
            href="javascript:;"
            class="klb_button_conmfirm van-button van-button--default van-button--large van-dialog__cancel"
            @click="_onConfirm"
          >{{ confirmText }}</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
/* eslint-disable */
import { Popup } from 'vant'
export default {
  name: 'confirm',
  components: {
    vanPopup: Popup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    closeOnClickCOverlay: {
      type: Boolean,
      default: false
    },
    closeOnPopstate: {
      type: Boolean,
      default: true
    },
    title: String,
    confirmText: { type: String, default: '确定' },
    cancelText: { type: String, default: '取消' },
    maskZIndex: [Number, String],
    content: String,
    closeOnConfirm: {
      type: Boolean,
      default: true
    },
    inputAttrs: Object,
    showContent: {
      type: Boolean,
      default: true
    },
    showCancelButton: {
      type: Boolean,
      default: true
    },
    showConfirmButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      msg: ''
    }
  },
  created() {
    if (this.value) {
      this.showValue = this.value
    }
  },
  watch: {
    value(val) {
      this.showValue = val
    },
    showValue(val) {
      this.$emit('input', val)
      if (val) {
        if (this.showInput) {
          this.msg = ''
          setTimeout(() => {
            if (this.$refs.input) {
              this.setInputFocus()
            }
          }, 300)
        }
        this.$emit('on-show') // emit just after msg is cleared
      }
    }
  },
  data() {
    return {
      showValue: false
    }
  },
  methods: {
    getInputAttrs() {
      return (
        this.inputAttrs || {
          type: 'text'
        }
      )
    },
    setInputValue(val) {
      this.msg = val
    },
    setInputFocus(evt) {
      if (evt) {
        evt.preventDefault()
      }
      this.$refs.input.focus()
    },
    _onConfirm() {
      if (!this.showValue) {
        return
      }
      if (this.closeOnConfirm) {
        this.showValue = false
      }
      this.$emit('on-confirm', this.msg)
    },
    _onCancel() {
      if (!this.showValue) {
        return
      }
      this.showValue = false
      this.$emit('on-cancel')
    },
    // 关闭的按钮
    _on_Cancel() {
      if (!this.showValue) {
        return
      }
      this.showValue = false
      this.$emit('on-close')
    }
  }
}
</script>
<style lang="less" scoped>
.klb_confirm {
  .klb_popup {
    border-radius: 7px;
    width: 80% !important;
  }
  .klb_dialog__hd {
    background: #15499a;
    color: #fff;
    padding: 10px;
    font-size: 18px;
    position: relative;
    text-align: center;
    .close_style {
      position: absolute;
      font-size: 30px;
      font-weight: 400;
      color: #fff;
      right: 10px;
      top: 0px;
    }
  }
  .klb_dialog__bd {
    font-size: 16px;
    color: #202020;
    padding: 1em;
    // line-height: 40px;
    .van-dialog__message {
      font-size: 14px;
      overflow-y: auto;
      overflow-x: hidden;
      max-height: 130px;
      line-height: 30px;
      white-space: normal;
      padding:14px;
    }
  }
  /deep/.van-button {
    border-radius: 0px !important;
  }
  .klb_button_conmfirm {
    color: #15499a;
  }
  .klb_dialog_prompt {
    padding: 2em 1em;
    text-align: center;
    input {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
    }
  }
}
</style>
