/* eslint-disable */
import ConfirmComponent from './confirm.vue'

const mergeOptions = function($vm, options) {
  const defaults = {}
  for (let i in $vm.$options.props) {
    if (i !== 'value') {
      defaults[i] = $vm.$options.props[i].default
    }
  }
  const _options = Object.assign({}, defaults, options)
  for (let i in _options) {
    $vm[i] = _options[i]
  }
}
let $vm

const plugin = {
  install(vue, options = {}) {
    const Confirm = vue.extend(ConfirmComponent)

    if (!$vm) {
      $vm = new Confirm({
        el: document.createElement('div'),
        propsData: {
          title: ''
        }
      })
      document.body.appendChild($vm.$el)
    }

    const confirm = {
      show(options) {
        if (typeof options === 'object') {
          mergeOptions($vm, options)
        }
        if (typeof options === 'object' && (options.onShow || options.onHide)) {
          options.onShow && options.onShow()
        }
        this.$watcher && this.$watcher()
        this.$watcher = $vm.$watch('showValue', val => {
          if (!val && options && options.onHide) {
            options.onHide()
          }
        })

        $vm.$off('on-cancel')
        $vm.$off('on-confirm')
        $vm.$off('on-close')

        $vm.$on('on-cancel', () => {
          options && options.onCancel && options.onCancel()
        })
        $vm.$on('on-confirm', msg => {
          options && options.onConfirm && options.onConfirm(msg)
        })
        $vm.$on('on-close', () => {
          options && options.onClose && options.onClose()
        })

        $vm.showValue = true
      },
      setInputValue(val) {
        vue.nextTick(() => {
          setTimeout(() => {
            $vm.setInputValue(val)
          }, 10)
        })
      },
      prompt(placeholder, options) {
        this.show(
          Object.assign({}, options, {
            placeholder,
            showInput: true
          })
        )
      },
      hide() {
        $vm.showValue = false
      },
      isVisible() {
        return $vm.showValue
      }
    }

    if (!vue.$klb) {
      vue.$klb = {
        confirm
      }
    } else {
      vue.$klb.confirm = confirm
    }
    vue.mixin({
      created: function() {
        this.$klb = vue.$klb
      }
    })
  }
}

export default plugin
export const install = plugin.install
