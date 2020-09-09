<template>
  <div class="confirm_for_payment">
    <c-header isShowTitle class="header">
      <van-nav-bar
        :title="title"
        left-arrow
        fixed
        @click-left="onClickLeft"
      ></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <section
        v-if="type === '0'"
        class="apply-pay-msg"
        v-show="
          !(prepaymentsOilCardNotPaid != '' && prepaymentsOilCardNotPaid > 0)
        "
      >
        <div class="gray"></div>
        <div class="msg-title">支付信息</div>
        <div style="height:6px;"></div>
        <div class="msg-item">
          <div class="left">车牌号码：</div>
          <div class="right">{{ dataInitMsg.cartBadgeNo }}</div>
        </div>
        <div class="msg-item">
          <div class="left">司机信息：</div>
          <div class="right">
            {{ dataInitMsg.driverName }}，{{ dataInitMsg.mobileNo }}
          </div>
        </div>
        <div class="msg-item">
          <div class="left">运费金额：</div>
          <div class="right">{{ dataInitMsg.userFreight }}元</div>
        </div>
        <div class="msg-item" v-if="dataInitMsg.prepayments !== ''">
          <div class="left">预 付 款 ：</div>
          <div class="right">{{ dataInitMsg.prepayments }}元</div>
        </div>
        <div class="msg-item" v-if="dataInitMsg.backFee !== ''">
          <div class="left">回单押金：</div>
          <div class="right">{{ dataInitMsg.backFee }}元</div>
        </div>
      </section>

      <div class="gray"></div>
      <van-cell-group
        v-show="
          !(prepaymentsOilCardNotPaid != '' && prepaymentsOilCardNotPaid > 0)
        "
      >
        <van-field
          v-model="suppiler"
          label="发货方："
          readonly
          v-show="false"
        />
        <van-field
          v-show="payState == '0' || payState == '5'"
          v-model="dataInitMsg.paidType"
          label="运费类型："
          @click="choosePayType"
          placeholder="请选择运费类型"
          :right-icon="payTypeArray.length > 1 ? 'arrow' : ''"
          readonly
        />
        <span v-show="dataInitMsg.paidType != '货损付'">
          <van-field
            v-model="dataInitMsg.canPayMaxFreight"
            label="待付运费："
            type="number"
            disabled
          >
            <div slot="right-icon">元</div>
          </van-field>
          <van-field
            v-show="dataInitMsg.insFeeState === '0'"
            v-model="dataInitMsg.insFee"
            label="保价费："
            type="number"
            disabled
          >
            <div slot="right-icon">元</div>
          </van-field>
          <van-field
            v-model="payMoney"
            label="支付金额："
            type="number"
            class="dash_color"
            clearable
            :disabled="
              (advancePayState == '1' &&
                permission.collectTwoCfg == '8' &&
                dataInitMsg.paidType == '到付款') ||
                !(payState == '0' || payState == '5')
            "
          >
            <div slot="right-icon">元</div>
          </van-field>
          <van-field
            v-show="
              !(
                advancePayState == '1' &&
                permission.collectTwoCfg == '8' &&
                dataInitMsg.paidType == '到付款'
              ) &&
                (zyCapitalCfg == '8' || hybWalletCfg == '8')
            "
            v-model="payType"
            label="收款方式："
            @click="chooseReceiveType"
            placeholder="请选择收款方式"
            :right-icon="receiveTypeArray.length === 2 ? 'arrow' : ''"
            required
            readonly
          />
          <span
            v-show="
              !(
                advancePayState == '1' &&
                permission.collectTwoCfg == '8' &&
                dataInitMsg.paidType == '到付款'
              ) &&
                zyCapitalCfg == '8' &&
                payType === '好运宝收款'
            "
          >
            <van-field v-model="name" label="收款人姓名：" disabled />
            <van-field v-model="idCard" label="收款人身份证：" disabled />
            <van-field v-model="phoneNumber" label="手机号码：" disabled />
            <van-field v-model="aliNum" label="支付宝账号：" disabled />
            <div class="gray"></div>
            <p>
              <span class="iconfont icongantanhao">
                司机
                <span>{{ this.dataInitMsg.driverName }}</span
                >已开通好运宝收款,请提醒司机去收款~
              </span>
            </p>
          </span>

          <span
            v-show="
              (advancePayState == '1' &&
                permission.collectTwoCfg == '8' &&
                dataInitMsg.paidType == '到付款') ||
                zyCapitalCfg !== '8' ||
                payType === '银行卡收款'
            "
          >
            <van-field
              type="text"
              v-model="personName"
              placeholder="请输入收款人姓名"
              label="收款人姓名："
              @input="nameChange"
              clearable
              :disabled="receiveState"
              v-show="orderType != '2'"
            >
              <div
                slot="right-icon"
                class="yellowButton"
                v-show="
                  !(
                    advancePayState == '1' &&
                    permission.collectTwoCfg == '8' &&
                    dataInitMsg.paidType == '到付款'
                  ) &&
                    (payState == '0' || payState == '5')
                "
              >
                <input type="button" value="常用收款人" @click="usuallyPay" />
              </div>
            </van-field>
            <van-field
              type="text"
              v-model="cardNum"
              placeholder="请输入收款人身份证号码"
              label="收款人身份证："
              clearable
              :disabled="receiveState"
              v-show="!(orderType == '2' || orderType == '1')"
            />
            <van-field
              v-model="bankNum"
              type="number"
              label="银行卡号："
              placeholder="请输入银行卡号"
              @blur="getBankNameAjax()"
              :disabled="receiveState"
              clearable
            />
            <van-field
              v-model="bankName"
              label="收款银行："
              placeholder="请选择收款银行"
              :disabled="receiveState"
              readonly
              :right-icon="receiveState ? '' : 'arrow'"
              @click="showSelectBankPicker"
              v-show="orderType != '2'"
            />
            <van-field
              v-model="bankAdress"
              label="开户行地址："
              placeholder="请选择开户行地址"
              :disabled="receiveState"
              :right-icon="receiveState ? '' : 'arrow'"
              readonly
              @click="showSelectCityPicker"
              v-show="orderType != '2'"
            />
            <!-- 自保理需求 -->
            <span
              v-show="zyCapitalCfg !== '8' && zblState == 1 && zblshow == true"
            >
              <van-cell title="支付宝账号：">
                <span>
                  <van-checkbox v-model="jiedanState" @change="changeValue"
                    >接单手机号</van-checkbox
                  >
                </span>
              </van-cell>
              <van-field
                v-model.trim="dataInitMsg.alipayNo"
                @input="mobileChange"
                type="number"
                placeholder="非接单手机号，请输入支付宝账号"
              ></van-field>
            </span>
          </span>
        </span>

        <!-- 货损付显示这一模块 -->
        <span
          v-show="
            (dataResult.length > '1' && dataInitMsg.paidType == '货损付') ||
              (dataResult.length == '1' && dataInitMsg.paidType == '货损付')
          "
        >
          <van-field disabled label="支付金额：" v-model="payMoney">
            <span slot="right-icon">元</span>
          </van-field>
          <van-field disabled label="收款方式：" v-model="payType" />
          <van-field disabled label="收款人姓名：" v-model="lossFeePayeeName" />
          <van-field disabled label="银行卡号：" v-model="lossFeePayeeBankNo" />
          <van-field
            disabled
            label="收款银行："
            v-model="lossFeePayeeBankName"
          />
          <van-field disabled label="开户行地址：" v-model="address" />
        </span>
      </van-cell-group>
      <!-- 新增加的油卡模块 -->
      <van-cell-group>
        <span
          v-show="
            prepaymentsOilCardNotPaid != '' && prepaymentsOilCardNotPaid > 0
          "
        >
          <van-field label="运费类型：" value="预付油卡" readonly />
          <van-field label="支付金额：" v-model="payMoney" readonly>
            <span slot="right-icon">元</span>
          </van-field>
          <van-field
            label="油卡卡号："
            v-model="oilCardNo"
            placeholder="未选择"
            @click="gotoSelectOilCard(payMoney)"
            right-icon="arrow"
            readonly
          />
        </span>
      </van-cell-group>
      <p
        v-show="
          drawMoneyState == '1' &&
            (dataInitMsg.paidType == '预付款' ||
              dataInitMsg.paidType == '到付款')
        "
      >
        <span class="iconfont icongantanhao"></span>
        <span
          >该运单司机已申请【提前收款】，请与货主确认货物运输无误后点击【确认申请】，点击后该运单信息不可进行修改。</span
        >
      </p>

      <p v-show="showTips">
        <span class="iconfont iconleijijingyingshouyijieshi"></span>
        <span
          >供应链金融运单仅支持司机好运宝钱包收款、请司机完成证件识别。</span
        >
      </p>

      <div class="gray"></div>
      <div class="footer" style="height:40px;"></div>
      <div class="button">
        <van-button
          type="primary"
          size="large"
          @click="applicationForPayment"
          :disabled="showTips"
          >{{ btnText }}</van-button
        >
      </div>
      <div
        style="text-decoration: underline;color: #15499A;text-align: center;margin-bottom: 20px;"
        @click="clearAll"
        v-show="
          (walletPay == '5' || walletPay == '6') &&
            !(advancePayState == '1' && this.permission.collectTwoCfg == '8')
        "
      >
        清空收款信息
      </div>
    </div>

    <!-- 运费类型选择框 -->
    <van-action-sheet
      v-model="payTypeShow"
      :actions="payTypeArray"
      @select="payTypeonSelect"
    />

    <!-- 收款方式选择框 -->
    <van-action-sheet
      v-model="receiveTypeShow"
      :actions="receiveTypeArray"
      @select="receiveTypeonSelect"
    />

    <!-- 选择银行 -->
    <van-popup v-model="selectBankPickerShow" position="bottom">
      <van-picker
        :default-index="bankDefaultIndex"
        show-toolbar
        :columns="bankList"
        value-key="bankName"
        @cancel="selectBankPickerShow = false"
        @confirm="onConfirmSelectBank"
      />
    </van-popup>

    <!-- 城市选择器 -->
    <van-popup v-model="selectCityPickerShow" position="bottom">
      <cityPicker
        @onConfirm="onConfirmCityPicker"
        @onCancel="selectCityPickerShow = false"
      ></cityPicker>
    </van-popup>

    <!-- 普通弹框一 -->
    <van-dialog
      v-model="sureAlertFlag"
      class="apply-pay-alert"
      title="支付单信息确认"
      lock-scroll
      show-cancel-button
      confirm-button-text="确认申请"
      @confirm="surePayBtn"
      :closeOnPopstate="true"
    >
      <div class="apply-pay-msg">
        <div style="color: #FFBA00;" v-if="dataInitMsg.insFeeState === '0'">
          支付总金额：{{
            (parseFloat(payMoney) + parseFloat(dataInitMsg.insFee)).toFixed(2)
          }}元
          <span>(保价费：{{ dataInitMsg.insFee }}元)</span>
        </div>
        <div style="color: #FFBA00;" v-else>
          支付总金额：{{ parseFloat(payMoney).toFixed(2) }}元
        </div>
        <div class="gray_bg">支付司机运费：{{ payMoney }}元</div>
      </div>
      <span
        v-show="
          payType === '银行卡收款' ||
            (advancePayState == '1' &&
              permission.collectTwoCfg == '8' &&
              dataInitMsg.paidType == '到付款')
        "
      >
        <div class="pay-person-msg van-hairline--top">
          <div class="person-msg-list">
            <div class="list-left">收款人姓名：</div>
            <div class="list-right">{{ personName }}</div>
          </div>
          <div class="person-msg-list">
            <div class="list-left">收 款 银 行：</div>
            <div class="list-right">{{ bankName }}</div>
          </div>
          <div class="person-msg-list">
            <div class="list-left">收 款 卡 号：</div>
            <div class="list-right">{{ bankNum }}</div>
          </div>
        </div>
      </span>
    </van-dialog>

    <!-- 货损付弹框二 -->
    <van-dialog
      v-model="huosunfuToast"
      class="apply-pay-alert"
      title="支付单信息确认"
      lock-scroll
      show-cancel-button
      confirm-button-text="确认申请"
      @confirm="huosunfuSurePayBtn"
      :closeOnPopstate="true"
    >
      <div class="apply-pay-msg">
        <!-- <div v-show="insFeeState != '0'" style="color: #FFBA00;">支付总金额：{{ totalMoney2 }}元</div>
        <div v-show="insFeeState == '0'" style="color: #FFBA00;">支付总金额：{{ totalMoney3 }}元</div>-->
        <div style="color: #FFBA00;">支付总金额：{{ payMoney }}元</div>
      </div>
      <span v-show="payType === '银行卡收款'">
        <div
          style="height:1px;width:90%;background-color:#DFDFDF;margin-left: 5%;"
        ></div>
        <div class="pay-person-msg">
          <div class="person-msg-list">
            <div class="list-left">收款人姓名：</div>
            <div class="list-right">{{ lossFeePayeeName }}</div>
          </div>
          <div class="person-msg-list">
            <div class="list-left">收 款 银 行：</div>
            <div class="list-right">{{ lossFeePayeeBankName }}</div>
          </div>
          <div class="person-msg-list">
            <div class="list-left">收 款 卡 号：</div>
            <div class="list-right">{{ lossFeePayeeBankNo }}</div>
          </div>
        </div>
        <div style="height:1px;background-color:#DFDFDF"></div>
      </span>
    </van-dialog>

    <!-- 密码弹出框 -->
    <van-popup
      v-model="PWDstate"
      :overlay="true"
      :close-on-click-overlay="false"
      :style="{ borderRadius: '10px' }"
    >
      <div style="width:90vw">
        <div class="van-hairline--top-bottom van-picker__toolbar">
          <button type="button" class="van-picker__cancel"></button>
          <div class="van-picker__title">请输入支付密码</div>
          <button type="button" class="van-picker__confirm" @click="closeBtn">
            <img
              src="../../assets/imgs/externalassistance/guanbi_icon@2x.png"
              width="16px"
              alt
            />
          </button>
        </div>
        <div class="pwd_content">
          <van-cell-group>
            <van-field
              v-model="password"
              type="password"
              placeholder="请输入支付密码"
            />
          </van-cell-group>
          <div class="tips">
            <div class="iconfont icongantanhao"></div>
            <p>
              确认支付后，运费将直接进入对方账户，无法撤回或退款，请谨慎操作!
            </p>
          </div>
          <div class="pwd_button">
            <van-button type="primary" size="large" @click="nextStep"
              >下一步</van-button
            >
          </div>
        </div>
      </div>
    </van-popup>
    <!-- 申请支付成功的弹出框 -->
    <van-popup
      v-model="paySuccessState"
      :overlay="true"
      :round="true"
      :close-on-click-overlay="false"
      :style="{ height: '250px', width: '60%', padding: '20px' }"
    >
      <div style="text-align:center">
        <img
          src="../../assets/imgs/jiandancheng_icon@2x.png"
          alt
          width="120px"
        />
        <p>申请支付已成功</p>
        <div class="pay_button" style>
          <van-button type="default" @click="checkWaybill">查看运单</van-button>
          <van-button type="primary" @click="nowTopay">立即支付</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import bus from '@/assets/js/bus.js';
import { AppFinish, operateWaybill } from '@/assets/js/app.js';
import Confirm from '@/common/components/confirm/confirm';
import {
  applyDataInit,
  queryPaymentInfo,
  getRecPayHistory,
  getBankName,
  getHYBwallet,
  gateCheckOfCardNum,
  computedPayServerNum,
  sureApplyPay,
  yanzhengPWD,
  queryPayState,
  getCarMasterInfo,
} from '../../api/applyForPayment.js';
import { zblState } from '../../api/wayBill.js';
import { getBankList, phoneGetName } from '@/api/apiBuildWaybill';
import cityPicker from '@/common/components/cityPicker';
export default {
  name: 'ConfirmForPayment',
  components: {
    cityPicker,
    Confirm,
  },
  data() {
    return {
      paySuccessState: false,
      PWDstate: false,
      position: 'bottom',
      password: '',
      title: '',
      btnText: '',
      payTypeShow: false,
      receiveTypeShow: false,
      selectBankPickerShow: false,
      selectCityPickerShow: false,
      bankDefaultIndex: 0,
      sureAlertFlag: false, //弹框标志一
      huosunfuToast: false, //弹框标志二
      jiedanState: '', //接单手机选中状态
      payTypeArray: [],
      receiveTypeArray: [{ name: '好运宝收款' }, { name: '银行卡收款' }],
      taxWaybillId: this.$route.query.taxWaybillId,
      waybillState: this.$route.query.waybillState,
      payState: this.$route.query.payState, // 0，5：申请支付 3,6,7,8：立即支付
      reg: /[\u4e00-\u9fa5]/, //中文正则,
      totalMoney: '',
      totalMoney1: '', //支付总金额保价费显示的情况下出现
      totalMoney2: '', // 货损付的总金额
      totalMoney3: '', // 开通保价费的货损付总金额
      bankList: [], // 银行集合
      dataResult: '',

      showTips: false, // 司机没有开通好运宝，则显示提示语
      payMoney: '',
      cardNum: '',
      personName: '',
      bankNum: '',
      bankName: '',
      getBankListFlag: 0,
      bankAdress: '',
      payeeProvinceId: '', // 开户行省份ID
      payeeCityId: '', // 开户行城市ID
      payeeProvince: '', // 开户行省份名称
      payeeCity: '', // 开户行城市名称
      serialNumber: '', // 支付单号
      orderType: '', // 支付单类型

      msgSend: '',
      oilCardNo: '', //油卡卡号
      belongActSys: '', //所属账户体系
      isOilPay: '', //0：已支付 1：未支付（油卡付）
      prepaymentsOilCardNotPaid: '',
      prepaymentsOilCard: '', //预付油卡
      suppiler: '', // 供应商
      dataInitMsg: {
        cartBadgeNo: '',
        driverName: '',
        mobileNo: '',
        canPayMaxFreight: '',
        userFreight: '',
        prepayments: '',
        xid: '',
        paidType: '',
        backFee: '',
        insFee: '', //保价运输费
        insFeeState: '', //保价运输费状态
        alipayNo: '', //支付宝账号
      },
      type: this.$route.query.type, // 入口类型 预付现金 和 付款类型
      dataFlag: 0, // 页面初始化数据前后标记用于控制watch方法已经页面就生效的问题
      backFlag: 0, // 区分是否从常用收款人页面返回
      zblState: '', //自保理状态
      reg: /[\u4e00-\u9fa5]/, //中文正则,
      zblshow: false,
      payType: '', //收款人类型
      zyCapitalCfg: '', //回款宝配置
      hybWalletCfg: '', //好运宝钱包配置
      drawMoneyState: '', // 提款状态
      haoyunbaoBank: '好运宝钱包',
      receiveState: false, // 默认收款人信息都可以修改
      wsMerchantId: '', // 网商商户号
      walletPay: '', // 是否是钱包收款
      buttonflag: 1,
      disabledSubmit: false, //防止多次提交
      disabledConfirm: false, //防止多次提交,confirm
      alipayNo: '',
      payBankName: '',
      payBankNo: '',
      payName: '',
      isModifyElements: '', //0：可修改 1：不可修改

      changeState: 1, //默认收款方式栏位可以修改

      name: '',
      idCard: '',
      phoneNumber: '',
      aliNum: '',

      payMoneyStorehuosun: '', // 用来存储初始值
      payMoneyStoreother: '', // 用来存储其他初始值
      lossFeePayeeName: '', // 货损收款人姓名
      lossFeePayeeBankName: '', // 货损收款银行
      lossFeePayeeProvince: '', // 货损开户行省份
      lossFeePayeeCityName: '', // 货损开户行城市
      lossFeePayeeBankNo: '', // 货损收款人银行卡号

      payeeListLength: '', // 收款人列表记录是否有数据
      clearData: '0', // 点击清除按钮标志
      // autoShowWalletCfg: '', //自动带钱包的配置
      advancePayState: '', // 付款方式
      collectTwoCfg: '', //到付金2配置
      driverWalletFalg: '', // 通过8003结果判断是否带钱包
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name === 'usually_receive_person') {
      next(vm => {
        if (
          vm.applyPayMsg.bankName == '好运宝钱包' ||
          vm.applyPayMsg.bankName == '浙江网商银行' ||
          vm.applyPayMsg.bankName == '车队钱包'
        ) {
          vm.receiveState = true;
        } else {
          vm.receiveState = false;
        }
        vm.cardNum = vm.applyPayMsg.cardNum;
        vm.personName = vm.applyPayMsg.personName;
        vm.bankNum = vm.applyPayMsg.bankNum;
        vm.bankName = vm.applyPayMsg.bankName;
        vm.bankAdress = vm.applyPayMsg.bankAdress;
        vm.payeeProvinceId = vm.applyPayMsg.payeeProvinceId;
        vm.payeeCityId = vm.applyPayMsg.payeeCityId;
        vm.payMoney = vm.applyPayMsg.payMoney;
        vm.changeState = vm.applyPayMsg.changeState;
        vm.wsMerchantId = vm.applyPayMsg.wsMerchantId; // 网商商户号
        vm.walletPay = vm.applyPayMsg.walletPay; // 是否是钱包收款
        vm.clearData = vm.applyPayMsg.clearData;
        console.log(vm.applyPayMsg);
        if (vm.applyPayMsg.payType === '') {
          vm.payType = '';
        } else {
          vm.payType = vm.applyPayMsg.payType;
        }
        vm.$nextTick(() => {
          vm.backFlag = 1;
        });
      });
    } else if (from.name === 'car_master_receiveMsg') {
      next(vm => {
        if (
          vm.carTeamInfo.payeeBankName == '好运宝钱包' ||
          vm.carTeamInfo.payeeBankName == '浙江网商银行' ||
          vm.carTeamInfo.payeeBankName == '车队钱包'
        ) {
          vm.receiveState = true;
        } else {
          vm.receiveState = false;
        }
        vm.cardNum = vm.carTeamInfo.payeeIdCard;
        vm.personName = vm.carTeamInfo.payeeName;
        vm.bankNum = vm.carTeamInfo.payeeBankNo;
        vm.bankName = vm.carTeamInfo.payeeBankName;
        vm.bankAdress =
          vm.carTeamInfo.payeeProvince + ' ' + vm.carTeamInfo.payeeCityName;
        vm.payeeProvinceId = vm.carTeamInfo.payeeProvinceId;
        vm.payeeCityId = vm.carTeamInfo.payeeCityId;
        vm.wsMerchantId = vm.carTeamInfo.wsMerchantId; // 网商商户号
        vm.walletPay = vm.carTeamInfo.acctType; // 是否是钱包收款
      });
    } else {
      next();
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != 'choose_oil_card') {
      // 离开结算信息时清空选择油卡购物车
      let updateOpions = {
        type: 'chooseOilCardItem',
      };
      this.$store.commit('cleanOildCardStatus', updateOpions);
    }
    let updateOpions = {
      payeeProvinceId: this.payeeProvinceId,
      payeeCityId: this.payeeCityId,
      wsMerchantId:this.wsMerchantId,
      payMoney: this.payMoney,
      cardNum: this.cardNum,
      personName: this.personName,
      bankNum: this.bankNum,
      bankName: this.bankName,
      bankAdress: this.bankAdress,
      payType: this.payType, //收款方式
      changeState: this.changeState, //是否可以点击修改
      clearData: this.clearData,
      walletPay: this.walletPay,
    };
    this.$store.commit('updateApplyPayMsg', updateOpions);
    next();
  },
  computed: {
    ...mapState('carTeamMasterInfo/', {
      carTeamInfo: state => state.carTeamInfo,
    }),
    ...mapGetters(['permission']),
    address: function() {
      return this.lossFeePayeeProvince + ' ' + this.lossFeePayeeCityName;
    },
    chooseOilCardItem() {
      return this.$store.state.oilCard.chooseOilCardItem;
    },
    applyPayMsg() {
      return this.$store.state.applyPayMsg.applyPayMsg;
    },
    btnState() {
      if (this.zyCapitalCfg == '8') {
        if (this.payType == '好运宝收款') {
          return 1;
        } else {
          if (
            this.personName !== '' &&
            this.cardNum.length === 18 &&
            this.bankNum !== '' &&
            this.bankAdress != '' &&
            this.bankName != ''
          ) {
            return 1;
          } else {
            return 0;
          }
        }
      } else {
        if (
          this.personName !== '' &&
          this.cardNum.length === 18 &&
          this.bankNum !== '' &&
          this.bankAdress != '' &&
          this.bankName != ''
        ) {
          return 1;
        } else {
          return 0;
        }
      }
    },
  },
  watch: {
    payMoney(newVal, oldVal) {
      if (!this.dataFlag) return false;
      if (this.dataInitMsg.paidType == '货损付') return false;
      if (newVal > Number(this.dataInitMsg.canPayMaxFreight)) {
        this.payMoney = this.dataInitMsg.canPayMaxFreight;
        this.$toast(
          `支付金额需小于等于总运费（${this.dataInitMsg.canPayMaxFreight}元）`,
        );
        return false;
      }
      if (newVal < 0) {
        this.payMoney = '0.00';
        return false;
      }
      if (
        newVal.indexOf('.') > -1 &&
        newVal.substr(newVal.indexOf('.') + 1, newVal.length).length > 2
      ) {
        this.payMoney = Number(newVal).toFixed(2) + '';
        return false;
      }
    },
  },
  created() {
    if (this.payState == '0' || this.payState == '5') {
      this.title = '申请支付';
      this.btnText = '确认申请';
    } else {
      this.title = '立即支付';
      this.btnText = '立即支付';
    }
    // 通过参数判断，是普通的申请支付还是立即支付
  },
  mounted() {
    this.onBus();
    this.dataInit();
  },
  methods: {
    // 注册bus
    onBus() {
      bus.$on('selectOilCard', res => {
        this.oilCardNo = res.oilCardNo;
      });
      // bus.$on('selectReceivePerson', res => {
      //   this.setReceivePerson(res);
      // });
      this.$once('hook:beforeDestroy', () => {
        bus.$off('selectOilCard');
        // bus.$off('selectReceivePerson');
      });
    },
    // setReceivePerson(applyPayMsg) {
    //   if (
    //     applyPayMsg.bankName == '好运宝钱包' ||
    //     applyPayMsg.bankName == '浙江网商银行' ||
    //     applyPayMsg.bankName == '车队钱包'
    //   ) {
    //     this.receiveState = true;
    //   } else {
    //     this.receiveState = false;
    //   }
    //   this.cardNum = applyPayMsg.cardNum;
    //   this.personName = applyPayMsg.personName;
    //   this.bankNum = applyPayMsg.bankNum;
    //   this.bankName = applyPayMsg.bankName;
    //   this.bankAdress = applyPayMsg.bankAdress;
    //   this.payeeProvinceId = applyPayMsg.payeeProvinceId;
    //   this.payeeCityId = applyPayMsg.payeeCityId;
    //   this.payMoney = applyPayMsg.payMoney;
    //   this.changeState = applyPayMsg.changeState;
    //   this.wsMerchantId = applyPayMsg.wsMerchantId; // 网商商户号
    //   this.walletPay = applyPayMsg.walletPay; // 是否是钱包收款
    //   this.clearData = applyPayMsg.clearData;
    //   this.payType = applyPayMsg.payType;

    //   this.$nextTick(() => {
    //     this.backFlag = 1;
    //   });
    // },
    $_queryPaymentInfo() {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        queryPaymentInfo({ taxWaybillId: this.taxWaybillId })
          .then(res => {
            if (res.data.reCode === '0') {
              let result = res.data.result;

              this.dataInitMsg.canPayMaxFreight = result.canPayMaxFreight;
              this.dataInitMsg.insFee = result.insFee;
              this.dataInitMsg.insFeeState = result.insFeeState;

              this.payMoney = result.payableFreight;
              this.personName = result.realName;
              this.cardNum = result.payeeIdCard;
              this.bankNum = result.bankCardNo;
              this.bankName = result.bankName;
              this.bankAdress = result.bankProvince + ' ' + result.bankCity;
              this.walletPay = result.walletPay; // 是否是钱包收款
              this.serialNumber = result.serialNumber; // 支付单号
              this.orderType = result.orderType; // 支付单类型
              this.alipayNo = result.alipayNo; //支付宝账号
              this.receiveState = true;
              resolve();
            } else {
              this.$toast(res.data.reInfo);
              reject();
            }
          })
          .catch(err => {
            this.$toast(err.message);
            reject();
          });
      });
    },
    $_applyDataInit() {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        applyDataInit({ taxWaybillId: this.taxWaybillId })
          .then(res => {
            if (res.data.reCode === '0') {
              this.dataResult = res.data.result;
              // 区分是否有货损付
              if (this.dataResult.length > 1) {
                let result = this.dataResult[0];
                for (var i in this.dataResult) {
                  let obj = {};
                  obj.name = this.dataResult[i].paidType;
                  this.payTypeArray.push(obj);
                }
                let peizhi = this.dataResult[1];
                if (this.backFlag) {
                  this.dataInitMsg.paidType = peizhi.paidType;
                } else {
                  this.payMoney = result.paidMoney;
                  this.dataInitMsg.paidType = result.paidType;
                }
                this.advancePayState = result.advancePayState; // 付款方式
                // 支付金额不同，全部需要存储，方便切换
                this.payMoneyStorehuosun = result.paidMoney;
                this.payMoneyStoreother = peizhi.paidMoney;

                this.payType = '银行卡收款';
                this.lossFeePayeeName = result.lossFeePayeeName; // 货损收款人姓名
                this.lossFeePayeeBankName = result.lossFeePayeeBankName; // 货损收款银行
                this.lossFeePayeeProvince = result.lossFeePayeeProvince; // 货损开户行省份
                this.lossFeePayeeCityName = result.lossFeePayeeCityName; // 货损开户行城市
                this.lossFeePayeeBankNo = result.lossFeePayeeBankNo; // 货损收款人银行卡号
                this.dataInitMsg.canPayMaxFreight = result.canPayMaxFreight;
                this.zyCapitalCfg = peizhi.zyCapitalCfg; //回款宝配置
                this.hybWalletCfg = peizhi.hybWalletCfg; // 好运宝钱包配置
                this.drawMoneyState = peizhi.drawMoneyState; // 提款状态
                this.dataInitMsg.mobileNo = peizhi.mobileNo;
                this.dataInitMsg.driverName = peizhi.driverName;
                this.dataInitMsg.cartBadgeNo = peizhi.cartBadgeNo;
                this.dataInitMsg.userFreight = peizhi.userFreight;
                this.dataInitMsg.prepayments = peizhi.prepayments;
                this.dataInitMsg.backFee = peizhi.backFee;
                this.dataInitMsg.insFeeState = peizhi.insFeeState; //保价运输费状态
                this.dataInitMsg.insFee = peizhi.insFee; //保价运输费
                this.dataInitMsg.xid = peizhi.xid;

                this.autoWalletFlag = result.autoWalletFlag;
              } else {
                let result = this.dataResult[0];
                this.dataInitMsg.paidType = result.paidType;
                if (this.dataInitMsg.paidType == '货损付') {
                  this.payType = '银行卡收款';
                  this.payMoney = result.paidMoney;
                  this.dataInitMsg.xid = result.xid;
                  this.lossFeePayeeName = result.lossFeePayeeName; // 货损收款人姓名
                  this.lossFeePayeeBankName = result.lossFeePayeeBankName; // 货损收款银行
                  this.lossFeePayeeProvince = result.lossFeePayeeProvince; // 货损开户行省份
                  this.lossFeePayeeCityName = result.lossFeePayeeCityName; // 货损开户行城市
                  this.lossFeePayeeBankNo = result.lossFeePayeeBankNo; // 货损收款人银行卡号
                } else {
                  this.dataInitMsg.cartBadgeNo = result.cartBadgeNo;
                  this.dataInitMsg.driverName = result.driverName;
                  this.dataInitMsg.mobileNo = result.mobileNo;
                  this.dataInitMsg.userFreight = result.userFreight;
                  this.dataInitMsg.prepayments = result.prepayments;
                  this.dataInitMsg.backFee = result.backFee;
                  this.dataInitMsg.xid = result.xid;
                  this.dataInitMsg.canPayMaxFreight = result.canPayMaxFreight;
                  this.dataInitMsg.insFee = result.insFee; //保价运输费
                  this.dataInitMsg.insFeeState = result.insFeeState; //保价运输费状态

                  this.isModifyElements = result.isModifyElements; //0：可修改 1：不可修改
                  this.advancePayState = result.advancePayState; // 付款方式
                  this.prepaymentsOilCardNotPaid =
                    result.prepaymentsOilCardNotPaid; //0：已支付1：未支付（油卡付）
                  if (this.oilCardNo == '') {
                    this.oilCardNo = result.oilCardNo; //油卡卡号
                  }
                  if (this.zyCapitalCfg != '8') {
                    this.payType = '银行卡收款';
                  } else {
                    if (result.payType == '1') {
                      this.payType = '好运宝收款';
                    } else if (result.payType == '0') {
                      this.payType = '银行卡收款';
                    } else {
                      this.payType = '';
                    }
                  }
                  this.prepaymentsOilCard = result.prepaymentsOilCard; //预付油卡
                  this.belongActSys = result.belongActSys; //所属账户体系
                  this.zyCapitalCfg = result.zyCapitalCfg; //回款宝配置
                  this.hybWalletCfg = result.hybWalletCfg; // 好运宝钱包配置
                  this.drawMoneyState = result.drawMoneyState; // 提款状态
                  this.payName = result.payName;
                  this.alipayNo = result.aliPayNo;
                  this.payBankName = result.payBankName;
                  this.payBankNo = result.payBankNo;

                  this.autoWalletFlag = result.autoWalletFlag;
                }
              }
              resolve();
            } else {
              reject();
            }
            this.dataFlag = 1;
          })
          .catch(err => {
            this.$toast(err.message);
            reject();
            this.dataFlag = 1;
          });
      });
    },
    $_phoneGetName() {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        let json = {
          mobileNo: this.dataInitMsg.mobileNo,
        };
        phoneGetName(json)
          .then(res => {
            if (Object.keys(res.data.result).length != '0') {
              let result = res.data.result;
              if (
                result.driverName !== '' &&
                result.alipayNo !== '' &&
                result.mobileNo !== ''
              ) {
                //已认证
                this.changeState = 1;
                //四要素
                this.name = result.driverName;
                this.idCard = result.idCard;
                this.phoneNumber = result.mobileNo;
                this.aliNum = result.alipayNo;
                this.payType = '';
              } else {
                //未认证
                this.changeState = 0;
                this.payType = '银行卡收款';
              }
            } else {
              //未认证
              this.changeState = 0;
              this.payType = '银行卡收款';
            }
            resolve();
          })
          .catch(err => {
            this.$toast(err.message);
            reject();
          });
      });
    },
    $_zblState() {
      return new Promise((resolve, reject) => {
        this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        // 3004自保理状态查询接口
        zblState({})
          .then(resp => {
            this.zblState = resp.data.result.zblState; //自保理状态
            if (this.zblState == '1') {
              this.dataInitMsg.alipayNo = this.applyPayMsg.alipayNo; //支付宝账号
            } else {
              this.dataInitMsg.alipayNo = '';
            }
            resolve();
          })
          .catch(err => {
            this.$toast(err.message);
            reject();
          });
      });
    },
    // 8007 获取好运宝钱包
    $_getHYBwallet(jsonData) {
      return new Promise((resolve, reject) => {
        getHYBwallet(jsonData)
          .then(res => {
            if (res.data.reCode == "0") {
              let result = res.data.result;
              // 自动带钱包的功能修改
              if (JSON.stringify(result) != '{}') {
                this.cardNum = result.payeeIdCard;
                this.bankNum = result.payeeBankNo;
                this.bankName = result.payeeBankName;
                this.bankAdress =
                  result.payeeProvince + ' ' + result.payeeCityName;
                this.wsMerchantId = result.wsMerchantId; // 网商商户号
                this.walletPay = result.acctType; // 是否显示清空收款信息按钮
                this.receiveState = true;
                this.payType = "银行卡收款";
              } else {
                // 查询的时候，司机未开通好运宝钱包，则显示提示语，且禁用
                if (
                  this.advancePayState == '1' &&
                  this.permission.collectTwoCfg == '8'
                ) {
                  this.showTips = true;
                  this.receiveState = true;
                }
              }
              resolve()
            } else {
              reject()
            }
          })
          .catch(err => {
            this.$toast(err.message);
            reject()
          });
      });
    },
    dataInit() {
      if (!(this.payState == '0' || this.payState == '5')) {
        // 立即支付
        this.$_queryPaymentInfo();
      } else {
        // 申请支付
        this.$_applyDataInit().then(() => {
          if (
            this.dataResult.length <= 1 &&
            this.dataInitMsg.paidType !== '货损付' &&
            !this.backFlag
          ) {
            //从收款人列表回来后,不修改支付金额字段
            this.payMoney = this.dataResult[0].paidMoney;
            if (this.zyCapitalCfg == '8') {
              this.$_phoneGetName();
            }
          }
          this.$_zblState().then(() => {
            //选择常用收款人后，带回收款人的姓名进行比较
            if (this.dataInitMsg.driverName == this.personName) {
              this.zblshow = true;
            } else {
              this.zblshow = false;
            }
            // 先判断是不是油卡
            if (
              !(
                this.prepaymentsOilCardNotPaid != '' &&
                Number(this.prepaymentsOilCardNotPaid) > 0
              )
            ) {
              // 改成新的收款人信息携带逻辑 分为垫付单和非垫付单
              this.getCapPayInfo();
            }
          });
        });
      }
    },
    // 车队长收款信息方法
    getCapPayInfo() {
      if (this.autoWalletFlag === "1") {
        let json = {
          taxWaybillId: this.taxWaybillId,
          mobileNo: this.dataInitMsg.mobileNo,
          payeeName: this.dataInitMsg.driverName,
          advancePayState: this.advancePayState
        };
        this.$_getHYBwallet(json);
        this.personName = this.dataInitMsg.driverName;
      } else { 
        // 查询收款人记录
        if (
          this.permission.autoShowWalletCfg === "50" &&
          this.advancePayState != 1 &&
          this.dataInitMsg.paidType != '货损付'
        ) {
          let json = {
            entType: 1,
            mobileNo: this.dataInitMsg.mobileNo,
            payeeName: this.dataInitMsg.driverName,
            hybWalletCfg: this.hybWalletCfg,
            taxWaybillId: this.$route.query.taxWaybillId,
            autoShowWalletCfg: this.permission.autoShowWalletCfg,
            advancePayState: this.advancePayState,
            cartBadgeNo: this.dataInitMsg.cartBadgeNo,
            driverName: this.dataInitMsg.driverName,
          };
          this.$toast.loading({
            duration: 0,
            message: '加载中',
            forbidClick: true,
          });
          getRecPayHistory(json).then(res => {
            this.driverWalletFalg = res.data.result.driverWalletFalg; // 通过结果判断是否带钱包
          });
        }
  
        setTimeout(() => {
          // 车队长信息查询不分垫付非垫付
          if (
            this.collectionFlagCfg == '46' &&
            this.dataInitMsg.paidType != '货损付'
          ) {
            let json = {
              mobileNo: this.dataInitMsg.mobileNo,
              driverName: this.dataInitMsg.driverName,
              payeeName: this.dataInitMsg.driverName,
              advancePayState: this.advancePayState,
              cartBadgeNo: this.dataInitMsg.cartBadgeNo,
            };
            this.$toast.loading({
              duration: 0,
              message: '加载中',
              forbidClick: true,
            });
            getCarMasterInfo(json)
              .then(res => {
                if (res.data.reCode === '0') {
                  if (JSON.stringify(res.data.result) != '{}') {
                    // 显示提示语的标志
                    this.carMasterLength = res.data.result.payeeList.length;
                    this.receiveState = true;
                  }
                } else {
                  this.$toast(res.data.reInfo);
                }
              })
              .catch(err => {
                console.log(err);
                this.$toast(err.message);
              });
          } else {
            if (this.advancePayState == 1) {
              let json = {
                taxWaybillId: this.$route.query.taxWaybillId,
                mobileNo: this.dataInitMsg.mobileNo,
                payeeName: this.dataInitMsg.driverName,
                advancePayState: this.advancePayState,
              };
              this.$_getHYBwallet(json);
              this.personName = this.dataInitMsg.driverName;
            }
          }
        }, 20);
      }
    },
    // 8007 获取好运宝钱包
    // _getHYBwallet(jsonData) {
    //   this.$toast.loading({
    //     duration: 0,
    //     message: '加载中',
    //     forbidClick: true,
    //   });
    //   getHYBwallet(jsonData)
    //     .then(res => {
    //       if (res.data.reCode == '0') {
    //         let result = res.data.result;
    //         // 自动带钱包的功能修改
    //         if (JSON.stringify(result) != '{}') {
    //           this.cardNum = result.payeeIdCard;
    //           this.bankNum = result.payeeBankNo;
    //           this.bankName = result.payeeBankName;
    //           this.bankAdress =
    //             result.payeeProvince + ' ' + result.payeeCityName;
    //           this.wsMerchantId = result.wsMerchantId; // 网商商户号
    //           this.walletPay = result.acctType; // 是否显示清空收款信息按钮
    //           this.receiveState = true;
    //         } else {
    //           // 查询的时候，司机未开通好运宝钱包，则显示提示语，且禁用
    //           if (
    //             this.advancePayState == '1' &&
    //             this.permission.collectTwoCfg == '8'
    //           ) {
    //             this.showTips = true;
    //             this.receiveState = true;
    //           }
    //         }
    //       } else {
    //         this.$toast(res.data.reInfo);
    //       }
    //     })
    //     .catch(err => {
    //       this.$toast(err.message);
    //     });
    // },
    // 用户输入银行卡号失去焦点是查询开户行名称
    getBankNameAjax() {
      if (this.bankNum.length < 11) return false;
      getBankName({ bankCardNo: this.bankNum })
        .then(res => {
          if (res.data.reCode === '0') {
            this.bankName = res.data.result;
          }
        })
        .catch(err => {
          this.$toast(err.message);
        });
    },
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    // 确认申请
    applicationForPayment() {
      //判断是申请支付还是立即支付
      if (!(this.payState == '0' || this.payState == '5')) {
        this.PWDstate = true;
      } else {
        if (
          this.prepaymentsOilCardNotPaid != '' &&
          this.prepaymentsOilCardNotPaid > 0 &&
          this.payMoney != ''
        ) {
          if (this.oilCardNo == '') {
            this.$klb.confirm.show({
              title: '提示',
              content: `<p style='color:#454545;'>不能申请支付</p><p style='color:#454545;'>请选择油卡！</p>`,
              confirmText: '选择油卡',
              showCancelButton: false,
              onConfirm: () => {
                this.$router.push({
                  path: '/choose_oil_card',
                  query: {
                    belongActSys: this.belongActSys,
                    cartBadgeNo: this.dataInitMsg.cartBadgeNo,
                    driverName: this.dataInitMsg.driverName,
                    mobileNo: this.dataInitMsg.mobileNo,
                    prepaymentsOilCard: this.prepaymentsOilCard,
                  },
                });
              },
              OnCancel: () => {
                this.disabledSubmit = false;
              },
              onClose: () => {
                this.disabledSubmit = false;
              },
            });
            return false;
          } else {
            //油卡付必须传 2
            this.buttonflag = 0;
            this.$toast.loading({
              duration: 0,
              message: '加载中',
              forbidClick: true,
            });
            let json = {
              payType: '2',
              oilCardNo: this.oilCardNo,
              xid: this.dataInitMsg.xid,
              payeeAmount: this.payMoney,
              type: '0', //表示外协
            };
            sureApplyPay(json)
              .then(res => {
                if (res.data.reCode === '0') {
                  //申请支付成功，拉起弹框
                  if (this.type == 1) {
                    this.$toast('申请支付成功！');
                  } else {
                    this.$toast('申请支付成功,可在运输中查看！');
                  }
                  let json = {
                    type: '0',
                    taxWaybillId: this.taxWaybillId,
                    refreshList: [this.waybillState],
                    waybillState: this.waybillState,
                    content: {},
                  };
                  operateWaybill(json);
                  setTimeout(() => {
                    AppFinish(-1);
                  }, 500);
                } else {
                  this.$toast(res.data.reInfo);
                  this.buttonflag = 1;
                  this.disabledSubmit = false;
                }
              })
              .catch(error => {
                this.buttonflag = 1;
                this.disabledSubmit = false;
                this.$toast('保存异常，请稍后再试~~~');
              });
          }
        } else {
          // 货损付
          if (this.dataInitMsg.paidType == '货损付') {
            this.huosunfuToast = true;
          } else {
            if (this.payMoney === '' || Number(this.payMoney) === 0) {
              this.$toast('收款人金额须大于0');
              this.disabledSubmit = false;
              return false;
            }
            if (!this.btnState) {
              let cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
              if (
                this.cardNum.length < 18 &&
                this.cardNum.length > 0 &&
                !cP.test(this.cardNum)
              ) {
                this.$toast('收款人身份证号码输入错误~~~');
                this.disabledSubmit = false;
                return false;
              }
              this.$toast('请输入完整的收款人信息~~~');
              this.disabledSubmit = false;
              return false;
            }
            if (
              this.zyCapitalCfg !== '8' &&
              this.zblState == 1 &&
              this.zblshow == true &&
              this.dataInitMsg.alipayNo == ''
            ) {
              this.$toast('支付宝账号不能为空');
              this.disabledSubmit = false;
              return false;
            }
            if (this.zyCapitalCfg == '8') {
              if (this.payType == '好运宝收款') {
                // 不用验证身份证网关
                this.payMoneyServerNum();
              } else {
                // 验证身份证网关
                this.gateCheckOfCardNumAjax();
              }
            } else {
              // 验证身份证网关
              this.gateCheckOfCardNumAjax();
            }
          }
        }
      }
    },
    gateCheckOfCardNumAjax() {
      let json = {
        name: this.personName,
        idCard: this.cardNum,
      };
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      gateCheckOfCardNum(json)
        .then(res => {
          if (res.data.reCode === '0') {
            // this.payMoneyServerNum()
            this.$nextTick(() => {
              this.sureAlertFlag = true;
            });
          } else {
            this.$toast(res.data.reInfo);
            this.disabledSubmit = false;
          }
        })
        .catch(error => {
          this.$toast('网关异常，请稍后再试~~~');
          this.disabledSubmit = false;
        });
    },
    payMoneyServerNum() {
      //获取服务费
      let json = {
        eapfList: [
          {
            taxWaybillId: this.$route.query.taxWaybillId,
            paymentType: '0',
            payeeAmount: this.payMoney,
          },
        ],
      };
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      computedPayServerNum(json)
        .then(res => {
          if (res.data.reCode === '0') {
            this.totalMoney = res.data.result.totalMoney;
            //条件满足的情况下，调用接口后，计算两个返回的值，显示的数值精确到小数点后两位
            if (this.dataInitMsg.insFeeState == '0') {
              this.totalMoney1 = this.jia(
                this.totalMoney,
                this.dataInitMsg.insFee,
              );
            }
            this.$nextTick(() => {
              this.sureAlertFlag = true;
            });
          } else {
            this.$toast(res.data.reInfo);
            this.disabledSubmit = false;
          }
        })
        .catch(error => {
          this.disabledSubmit = false;
          this.$toast('支付服务费获取异常，请稍后再试~~~');
        });
    },
    // 运费类型弹框
    choosePayType() {
      if (this.dataResult.length < 2) {
        return;
      }
      this.payTypeShow = true;
    },
    // 运费类型选择
    payTypeonSelect(item) {
      this.payTypeShow = false;
      this.dataFlag = 1;
      if (item.name == '货损付') {
        this.walletPay = '';
        this.payMoney = this.payMoneyStorehuosun;
      } else {
        this.payMoney = this.payMoneyStoreother;
      }
      this.dataInitMsg.paidType = item.name;
    },
    // 收款方式弹框
    chooseReceiveType() {
      if (
        (this.zyCapitalCfg == '8' && this.changeState == 0) ||
        (this.hybWalletCfg == '8' && this.zyCapitalCfg != '8')
      ) {
        return;
      }
      this.receiveTypeShow = true;
    },
    // 收款方式选择
    receiveTypeonSelect(item) {
      this.receiveTypeShow = false;
      this.payType = item.name;
      if (item.name == '好运宝收款') {
        if (this.zyCapitalCfg == '8') {
          let json = {
            mobileNo: this.dataInitMsg.mobileNo,
          };
          this.$toast.loading({
            duration: 0,
            message: '加载中',
            forbidClick: true,
          });
          phoneGetName(json)
            .then(res => {
              if (Object.keys(res.data.result).length != '0') {
                let result = res.data.result;
                if (
                  result.driverName !== '' &&
                  result.alipayNo !== '' &&
                  result.mobileNo !== ''
                ) {
                  //已认证
                  this.changeState = 1;
                  //四要素
                  this.name = result.driverName;
                  this.idCard = result.idCard;
                  this.phoneNumber = result.mobileNo;
                  this.aliNum = result.alipayNo;
                  this.payType = '好运宝收款';
                } else {
                  //未认证
                  this.changeState = 0;
                  this.payType = '银行卡收款';
                }
              } else {
                //未认证
                this.changeState = 0;
                this.payType = '银行卡收款';
              }
            })
            .catch(err => {
              this.$toast(err.message);
            });
        }
      }
    },
    // 修改收款人姓名
    nameChange(val) {
      //姓名一致时，显示支付宝
      if (this.dataInitMsg.driverName === val) {
        this.zblshow = true;
        if (
          this.hybWalletCfg == '8' &&
          this.driverWalletFalg == "1"  &&
          this.clearData != 1
        ) {
          setTimeout(() => {
            let jsonData = {
              taxWaybillId: this.$route.query.taxWaybillId,
              mobileNo: this.dataInitMsg.mobileNo,
              payeeName: val,
              advancePayState: this.advancePayState,
            };
            this.$toast.loading({
              duration: 0,
              message: '加载中',
              forbidClick: true,
            });
            this.$_getHYBwallet(jsonData);
          }, 50);
        }
      } else {
        this.zblshow = false;
      }
    },
    // 8007 获取好运宝钱包
    getHYBwallet(jsonData) {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getHYBwallet(jsonData)
        .then(res => {
          if (res.data.reCode == '0') {
            let result = res.data.result;
            if (JSON.stringify(result) != '{}') {
              this.cardNum = result.payeeIdCard;
              this.bankNum = result.payeeBankNo;
              this.bankName = result.payeeBankName;
              this.bankAdress =
                result.payeeProvince + ' ' + result.payeeCityName;
              this.payeeProvince = result.payeeProvince;
              this.payeeCity = result.payeeCityName;
              this.payeeProvinceId = result.payeeProvinceId;
              this.payeeCityId = result.payeeCityId;
              this.wsMerchantId = result.wsMerchantId; // 网商商户号
              this.walletPay = result.acctType; // 是否显示清空收款信息按钮
              this.receiveState = true;
            } else {
              // 查询的时候，司机未开通好运宝钱包，则显示提示语，且禁用
              if (
                this.advancePayState == '1' &&
                this.permission.collectTwoCfg == '8' &&
                this.dataInitMsg.paidType == '到付款'
              ) {
                this.showTips = true;
                this.receiveState = true;
              }
            }
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(err => {});
    },
    // 常用收款人点击事件
    usuallyPay() {
      if (
        this.permission.collectionFlagCfg === '46' &&
        this.advancePayState == '1'
      ) {
        this.$router.push({
          path: '/car_master_receiveMsg',
          query: {
            advancePayState: this.advancePayState,
            mobileNo: this.dataInitMsg.mobileNo,
            payeeName: this.dataInitMsg.driverName,
            driverName: this.dataInitMsg.driverName,
            cartBadgeNo: this.dataInitMsg.cartBadgeNo,
          },
        });
      } else {
        this.$router.push({
          path: '/usually_receive_person',
          query: {
            mobileNo: this.dataInitMsg.mobileNo,
            payeeName: this.dataInitMsg.driverName,
            cartBadgeNo: this.dataInitMsg.cartBadgeNo,
            driverName: this.dataInitMsg.driverName,
            hybWalletCfg: this.hybWalletCfg,
            taxWaybillId: this.$route.query.taxWaybillId,
            autoShowWalletCfg: this.permission.autoShowWalletCfg,
          },
        });
      }
    },
    showSelectBankPicker() {
      if (
        !(this.payState == '0' || this.payState == '5') ||
        this.receiveState
      ) {
        return;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getBankList({})
        .then(res => {
          if (res.data.reCode === '0') {
            let bankList_temp = res.data.result.data.map(item => {
              return item.bankName;
            });
            // 银行列表添加好运宝钱包
            if (this.hybWalletCfg === '8') {
              bankList_temp.push('好运宝钱包');
            }
            this.bankList = bankList_temp;
            // 定位
            if (this.bankName) {
              this.bankList.forEach((item, index) => {
                if (this.bankName === item) {
                  this.bankDefaultIndex = index;
                }
              });
            }
          }
          this.selectBankPickerShow = true;
        })
        .catch(() => {});
    },
    onConfirmSelectBank(item) {
      this.bankName = item;
      this.selectBankPickerShow = false;
    },
    showSelectCityPicker() {
      if (
        !(this.payState == '0' || this.payState == '5') ||
        this.receiveState
      ) {
        return;
      }
      this.selectCityPickerShow = true;
    },
    onConfirmCityPicker({ text, code }) {
      this.selectCityPickerShow = false;
      this.bankAdress = text;
      this.payeeProvince = text.split(' ')[0];
      this.payeeCity = text.split(' ')[1];
      this.payeeProvinceId = code[0];
      this.payeeCityId = code[1];
      console.log(code);
    },
    //点击跳转到油卡选择页面
    gotoSelectOilCard(item) {
      this.$router.push({
        path: '/choose_oil_card',
        query: {
          belongActSys: this.belongActSys,
          cartBadgeNo: this.dataInitMsg.cartBadgeNo,
          driverName: this.dataInitMsg.driverName,
          mobileNo: this.dataInitMsg.mobileNo,
          prepaymentsOilCard: item,
        },
      });
    },
    // 申请支付按钮确认
    surePayBtn() {
      this.disabledConfirm = true;
      this.sureAlertFlag = false;
      let alipayNo, payeeName, payeeBankName, payeeBankNo;
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      alipayNo = this.dataInitMsg.alipayNo;
      payeeName = this.trim(this.personName);
      payeeBankName = this.bankName;
      payeeBankNo = this.trim(this.bankNum);
      let options = {
        type: '0', //表示外协
        payType: '0',
        xid: this.dataInitMsg.xid,
        payeeName: payeeName,
        payeeProvince: this.payeeProvince,
        payeeCity: this.payeeCity,
        payeeProvinceId:
          this.zyCapitalCfg == '8' && this.payType == '好运宝收款'
            ? ''
            : payeeBankName == '好运宝钱包'
            ? '7'
            : this.payeeProvinceId,
        payeeCityId:
          this.zyCapitalCfg == '8' && this.payType == '好运宝收款'
            ? ''
            : payeeBankName == '好运宝钱包'
            ? '7'
            : this.payeeCityId,
        payeeBankNo: this.payType == '好运宝收款' ? '' : payeeBankNo,
        payeeBankName:
          this.advancePayState == '1' &&
          this.permission.collectionFlagCfg == '46'
            ? ''
            : this.payType == '好运宝收款'
            ? ''
            : payeeBankName == '好运宝钱包'
            ? '浙江网商银行'
            : payeeBankName,
        payeeIdCard: this.cardNum,
        payeeAmount: this.payMoney,
        mobileNo:
          this.zblshow == true && this.zblState == '1'
            ? this.dataInitMsg.mobileNo
            : '',
        alipayNo: alipayNo,
        hkbPayType: this.payType == '好运宝收款' ? '1' : '0',
        wsMerchantId:
          this.payType == '好运宝收款'
            ? ''
            : payeeBankName == '好运宝钱包'
            ? this.wsMerchantId
            : '',
        walletPay:
          this.carTeamInfo.acctType == '6' || this.walletPay == '6'
            ? '2'
            : this.carTeamInfo.acctType == '5' || this.walletPay == '5'
            ? '1'
            : '0',
      };
      console.log(options);
      this.buttonflag = 0;
      sureApplyPay(options)
        .then(res => {
          if (res.data.reCode === '0') {
            this.$toast.loading({
              duration: 0,
              message: '加载中',
              forbidClick: true,
            });
            queryPayState({ taxWaybillId: this.taxWaybillId })
              .then(res => {
                if (res.data.reCode === '0') {
                  if (
                    res.data.result.payState == '3' &&
                    res.data.result.roleType == '1'
                  ) {
                    this.paySuccessState = true;
                  } else {
                    this.$toast('申请支付成功！');
                    this.checkWaybill();
                  }
                } else {
                  this.$toast(res.data.reInfo);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$toast(res.data.reInfo);
            this.buttonflag = 1;
            this.disabledSubmit = false;
            this.disabledConfirm = false;
          }
        })
        .catch(error => {
          this.disabledSubmit = false;
          this.disabledConfirm = false;
          this.buttonflag = 1;
          this.$toast('保存异常，请稍后再试~~~');
        });
    },
    // 货损付的确认申请
    huosunfuSurePayBtn() {
      this.disabledConfirm = true;
      this.huosunfuToast = false;
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      let options = {
        type: '0', //表示外协
        payType: '1', // 货损付
        xid: this.dataInitMsg.xid,
        payeeName: this.lossFeePayeeName,
        payeeProvince: this.lossFeePayeeProvince,
        payeeCity: this.lossFeePayeeCityName,
        payeeProvinceId: '',
        payeeCityId: '',
        payeeBankNo: this.lossFeePayeeBankNo,
        payeeBankName: this.lossFeePayeeBankName,
        payeeIdCard: '',
        payeeAmount: this.payMoney,
        mobileNo: '', //非本人不传手机号和支付宝
        alipayNo: '', //支付宝账号
        hkbPayType: '', //收款人类型 0：非本人 1：本人
        wsMerchantId: '', // 网商商户号  钱包收款必填
        walletPay: '', // 是否是钱包收款 0：否 1：是
      };
      console.log(options);
      this.buttonflag = 0;
      sureApplyPay(options)
        .then(res => {
          if (res.data.reCode === '0') {
            //申请支付成功，拉起弹框
            if (this.type == 1) {
              this.$toast('申请支付成功！');
            } else {
              this.$toast('申请支付成功,可在运输中查看！');
            }
            let json = {
              type: '0',
              taxWaybillId: this.taxWaybillId,
              refreshList: [this.waybillState],
              waybillState: this.waybillState,
              content: {},
            };
            operateWaybill(json);
            setTimeout(() => {
              AppFinish(-1);
            }, 500);
          } else {
            this.$toast(res.data.reInfo);
            this.buttonflag = 1;
            this.disabledSubmit = false;
            this.disabledConfirm = false;
          }
        })
        .catch(error => {
          this.disabledSubmit = false;
          this.disabledConfirm = false;
          this.buttonflag = 1;
          this.$toast('保存异常，请稍后再试~~~');
        });
    },
    //自定义去前后空格的方法
    trim: function(i) {
      return i.toString().replace(/\s/g, '');
    },
    //支付总金额计算计算方法
    jia: function(s, r) {
      var q, p, o, u;
      try {
        q = s.toString().split('.')[1].length;
      } catch (t) {
        q = 0;
      }
      try {
        p = r.toString().split('.')[1].length;
      } catch (t) {
        p = 0;
      }
      o = Math.pow(10, Math.max(q, p));
      u = q >= p ? q : p;
      return parseFloat(((s * o + r * o) / o).toFixed(u));
    },
    // 清空收款人信息
    clearAll() {
      // this.cityList = ''
      // this.cityList = cityDataToIWant(city.data)
      this.personName = '';
      this.cardNum = '';
      this.bankNum = '';
      this.bankName = '';
      this.bankAdress = '';
      this.receiveState = false;
      // 存储状态
      this.clearData = '1';
      this.walletPay = '';
    },
    //确认密码下一步
    nextStep() {
      // 走接口验证
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      yanzhengPWD({ paymentCode: this.password })
        .then(res => {
          if (res.data.reCode === '0') {
            this.PWDstate = false;
            this.$router.push({
              path: '/ensure_payment',
              query: {
                payMoney: this.payMoney,
                insFee: this.dataInitMsg.insFee, // 保费
                insFeeState: this.dataInitMsg.insFeeState, // 保费展示状态
                personName: this.personName,
                paymentCode: this.password,
                serialNumber: this.serialNumber,
                walletPay: this.walletPay,
                taxWaybillId: this.taxWaybillId,
              },
            });
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(err => {});
    },
    // 弹框 查看运单
    checkWaybill() {
      let json = {
        type: '0',
        taxWaybillId: this.taxWaybillId,
        content: {},
        refreshList: [this.waybillState],
        waybillState: this.waybillState,
      };
      operateWaybill(json);
      setTimeout(() => {
        AppFinish(-1);
      }, 500);
    },
    // 弹框 立即支付
    nowTopay() {
      this.paySuccessState = false;
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      queryPaymentInfo({ taxWaybillId: this.taxWaybillId })
        .then(res => {
          if (res.data.reCode === '0') {
            let result = res.data.result;
            this.serialNumber = result.serialNumber; // 支付单号
            this.payMoney = result.payableFreight; //支付金额
            this.walletPay = result.walletPay; // 是否是钱包收款
            this.receiveState = true;
            this.PWDstate = true;
          } else {
            this.$toast(res.data.reInfo);
          }
        })
        .catch(err => {
          this.$toast(err.message);
        });
    },
    // 关闭按钮操作
    closeBtn() {
      if (this.payState == '0' || this.payState == '5') {
        this.checkWaybill();
      } else {
        this.PWDstate = false;
      }
    },
    // 自保理切换选中状态
    changeValue(val) {
      if (val) {
        this.jiedanState = '1';
        this.dataInitMsg.alipayNo = this.dataInitMsg.mobileNo;
      } else {
        this.jiedanState = '';
        this.dataInitMsg.alipayNo = '';
      }
    },
    //支付宝账号输入变化
    mobileChange(val) {
      //若收款人的支付宝账号和接单手机号一致时,可选中{接单手机号},即自动带出运单司机手机号
      if (val == this.dataInitMsg.mobileNo) {
        this.jiedanState = '1';
      } else {
        this.jiedanState = '';
      }
    },
    // 密码框事件
    pwdFocus() {
      // this.position = 'top'
    },
    pwdBlur() {
      // this.position = 'bottom'
    },
  },
};
</script>
<style lang="less" scoped>
.confirm_for_payment {
  background: #ffffff;
  // 头部公共栏位
  .apply-pay-msg {
    min-height: 46px;
    height: auto;
    background-color: #fff;
    .msg-title {
      padding: 0 12px;
      height: 48px;
      line-height: 48px;
      border-bottom: 1px solid #cfcfcf;
      font-weight: bold;
    }
    .msg-item {
      padding: 0 12px;
      display: flex;
      min-height: 36px;
      height: auto;
      align-items: center;
      font-size: 15px;
      .left {
        color: #797979;
      }
      .right {
        flex: 1;
        word-break: break-word;
        color: #202020;
      }
    }
    .gray_bg {
      background: url('../../assets/imgs/DB/bg_img@2x.png') no-repeat center
        center;
      background-size: 80% 100%;
      padding: 20px 0px;
    }
  }
  .labe-left {
    color: #797979;
  }
  .value-right {
    color: #202020;
  }
  .yellowButton input {
    width: 90px;
    height: 25px;
    background: rgba(255, 186, 0, 1);
    border-radius: 5px;
    color: rgba(255, 255, 255, 1);
    border: none;
    font-size: 13px;
  }
  /deep/.van-field__label {
    width: 120px;
  }
  .button {
    .van-button {
      display: inherit;
      margin: 10px auto;
      border-radius: 5px;
      width: 90%;
    }
  }
  p {
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    padding: 10px;
    .iconfont {
      color: #d84b4c;
    }
  }
  .apply-pay-alert {
    .apply-alert-title {
      height: 46px;
      line-height: 46px;
      color: #fff;
      background-color: #15499a;
      font-size: 18px;
    }
    .apply-pay-msg {
      text-align: center;
      padding: 20px 0px;
      line-height: 24px;
      font-size: 16px;
    }
    .pay-person-msg {
      padding: 12px 15px;
      text-align: start;
      .person-msg-list {
        display: flex;
        font-size: 15px;
        line-height: 25px;
      }
      .list-left {
        color: #797979;
      }
      .list-right {
        color: #202020;
        flex: 1;
        word-break: break-word;
      }
    }
    .contor-btn-cxt {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20px 0px;
      .contor-left-btn {
        width: 110px;
        height: 40px;
        text-align: center;
        line-height: 42px;
        color: #15499a;
        border: 1px solid #15499a;
        border-radius: 7px;
      }
      .contor-right-btn {
        width: 110px;
        height: 42px;
        text-align: center;
        line-height: 42px;
        color: #ffffff;
        background-color: #15499a;
        border-radius: 7px;
      }
    }
  }
  .pwd_content {
    width: 100%;
    min-height: 200px;
    padding-top: 10px;
    background-color: #fff;
    .tips {
      color: #d84b4c;
      display: flex;
      .iconfont {
        margin-top: 12px;
        margin-left: 10px;
      }
    }
    .pwd_button {
      margin-top: 40px;
      .van-button {
        display: inherit;
        margin: 2.667vw auto;
        border-radius: 1.333vw;
        width: 60%;
        height: 45px;
      }
    }
    .van-cell {
      border: 1px solid #bfbfbf;
      margin: 5px 10px;
      width: auto;
      padding: 2px 10px;
      /deep/input[type='password'] {
        letter-spacing: 5px;
        font-size: 22px;
        height: 34px;
        line-height: normal;
        text-indent: 1em;
      }
      /deep/input[type='password']::placeholder {
        letter-spacing: 2px;
        font-size: 18px;
      }
    }
  }
  /deep/.van-picker__title {
    color: #ffffff;
  }
  .pay_button {
    .van-button {
      width: 60%;
      margin-top: 10px;
    }
  }
  .dash_color {
    /deep/.van-field__control {
      background: #cfcfcf;
      padding: 6px;
      border-radius: 6px;
    }
  }
}
</style>
