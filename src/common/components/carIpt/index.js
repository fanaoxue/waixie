import Vue from 'vue'
import { Toast } from 'vant'
import './cartBadge.less'
Vue.use(Toast, { time: '3000' })
let cartBadgeStr = `
<div class="cart-num-ipt-cxt" id="cardIpt">
    <div class="cart-ipt-bg" @click="input('关闭')"></div>
    <transition name="bottom-fade">
      <div class="typer"  v-show="showTyper!=0">
        <input class="cart-hide-ipt" v-model="cartBadgeNo" />
        <div class="cartBadgeNo">
            <div class="cart-ipt-cancle" @click="input('关闭')">取消</div>
            <div><span class="cart-ipt-placeholder" v-show="!cartBadgeNo">请输入车牌号</span><span>{{cartBadgeNo}}</span></div>
            <div class="cart-ipt-sure"><div v-show="cartBadgeNo.length>6"  @click="input('确定')">确定</div></div>
        </div>
        <ul class="clearfix ul_input" v-show="showTyper==1">
            <li class="typer-pro" v-for="item in provinces" :class="{'is-closeType':item=='关闭'}"
            @click="input(item)" ><span>{{item}}</span></li>
        </ul>
        <ul class="clearfix ul_keybord" v-show="showTyper==2">
            <li class="typer-num" v-for="item in keyNums" :class="{'is-OK':item=='确定','is-Del':item=='删除'}"
            @click="input(item)" ><span>{{item}}</span></li>
        </ul>
    </div>
    </transition>
</div>`
// 禁止页面滑动
let scrollContr = type => {
  if (type) {
    // 1禁止，0取消
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = 'visible'
    document.body.style.overflow = 'visible'
  }
}
const CartNumIptConstructor = Vue.extend({
  template: cartBadgeStr,
  data() {
    return {
      // 输入法的值，0表示不显示，1表示显示省输入键盘，2表示显示数字字母输入键盘
      cartBadgeNo: '',
      showTyper: 0,
      // provinces: ['京', '沪', '浙', '苏', '粤', '鲁', '晋', '冀', // 省
      //   '豫', '川', '渝', '辽', '吉', '黑', '皖', '鄂',
      //   '津', '贵', '云', '桂', '琼', '青', '新', '藏',
      //   '蒙', '宁', '甘', '陕', '闽', '赣', '湘'
      // ],
      provinces: [
        '京',
        '皖',
        '闽',
        '甘',
        '粤',
        '桂',
        '贵',
        '琼',
        '冀',
        '豫',
        '黑',
        '鄂',
        '湘',
        '吉',
        '苏',
        '辽',
        '蒙',
        '宁',
        '青',
        '鲁',
        '晋',
        '陕',
        '沪',
        '川',
        '津',
        '新',
        '云',
        '浙',
        '渝',
        '藏',
        '赣'
      ],
      // keyNums: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', // 数字字母
      //   'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
      //   'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
      //   'Z', 'X', 'C', 'V', 'B', 'N', 'M', '挂', '确定'
      // ]
      keyNums: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        'M',
        'N',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '挂',
        '删除'
      ]
    }
  },
  methods: {
    // _domObj.addEventListener('transitionend', function () {
    //   document.body.removeChild(_domObj)
    // })
    changeTyper: function () {
      // 判断输入的车牌号处于什么状态，为空？已输入第一个值（即省）？输入省之后的值？
      if (this.cartBadgeNo.length >= 1) {
        this.showTyper = 2
      }
      if (this.cartBadgeNo.length === 0) {
        this.showTyper = 1
      }
    },
    input: function () {
      // 键盘点击事件，传入键盘本身的值
    }
  }
})

function cartBadgeIpt(
  options = {
    dpCartNum: ''
  }
) {
  scrollContr(1)
  let instance = new CartNumIptConstructor().$mount(
    document.createElement('div')
  )
  document.body.appendChild(instance.$el)
  instance.cartBadgeNo = options.dpCartNum
  if (
    typeof options.dpCartNum !== 'undefined' &&
    options.dpCartNum.length > 0
  ) {
    instance.showTyper = 2
  } else {
    instance.showTyper = 1
  }
  instance.input = function (item) {
    var _domObj = this.$el
    if (item === '关闭') {
      instance.showTyper = 0
      setTimeout(function () {
        document.body.removeChild(_domObj)
      }, 310)
      return false
    }
    if (item === '确定') {
      // 判断是否点击了关闭按钮
      scrollContr(0)
      let cartBadgeCheck = /^([\u4E00-\u9FA5](([0-9A-Z]{6,7})|([0-9A-Z]{5,6}[\u4E00-\u9FA5]{1})))$/
      if (instance.cartBadgeNo.length === 0) {
        Toast('车牌号码输入为空~~~', 'top')
        return false
      }
      if (
        instance.cartBadgeNo.length > 0 &&
        instance.cartBadgeNo.length < 7 &&
        !cartBadgeCheck.test(instance.cartBadgeNo)
      ) {
        Toast('车牌号码输入有误~~~')
        return false
      }
      options.fn(instance.cartBadgeNo)
      instance.showTyper = 0
      setTimeout(function () {
        document.body.removeChild(_domObj)
      }, 310)
      return
    }
    if (item === '删除') {
      // 判断是否点击了删除按钮
      instance.cartBadgeNo = instance.cartBadgeNo.slice(0, -1)
      setTimeout(function () {
        instance.changeTyper()
      }, 0)
      return
    }
    if (instance.cartBadgeNo.length < 8) {
      // 判断当前的车牌号的数目是否合法，还未超出8位则可继续输入
      instance.cartBadgeNo = instance.cartBadgeNo + item
      setTimeout(function () {
        instance.changeTyper()
      }, 0)
    } else {
      Toast('请输入合规车牌号~~~', 'top')
    }
  }
}

export default cartBadgeIpt
