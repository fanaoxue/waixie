<template>
  <div class="modify-template">
    <c-header>
      <van-nav-bar title="修改常用模板" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="gray"></div>
      <div class="content">
        <van-cell-group>
          <van-field
            v-model="formData.startPlace"
            label="装货地："
            placeholder="请选择装货地"
            @click="goChooseCity(0)"
            :right-icon="readOnly ? '' : 'arrow'"
            required
            readonly
          />
          <van-field
            v-model="formData.endPlace"
            label="卸货地："
            placeholder="请选择卸货地"
            @click="goChooseCity(1)"
            :right-icon="readOnly ? '' : 'arrow'"
            required
            readonly
          />
          <van-field
            v-model="formData.goodsName"
            label="货物名称："
            placeholder="请输入货物名称"
            :readonly="readOnly"
            required
            clearable
          />
          <van-field
            v-model="formData.goodsAmount"
            label="货物数量："
            placeholder="请输入货物数量"
            :readonly="readOnly"
            required
            clearable
          >
            <div slot="right-icon">
              <van-radio-group v-model="formData.goodsAmountType" class="goods-amount-type-box">
                <van-radio name="0">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >吨</div>
                </van-radio>
                <van-radio name="1">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >方</div>
                </van-radio>
                <van-radio name="2">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >件</div>
                </van-radio>
                <van-radio name="3">
                  <div
                    slot="icon"
                    slot-scope="props"
                    class="goods-amount-type-item"
                    :class="props.checked ? 'active' : 'inactive'"
                  >车</div>
                </van-radio>
              </van-radio-group>
            </div>
          </van-field>
          <van-field
            v-model="formData.supplierOrgName"
            label="外协供应商："
            @click="carrierStart"
            placeholder="请选择供应商"
            :right-icon="'arrow'"
            readonly
            required
            clearable
          />
        </van-cell-group>
        <div class="gray"></div>
      </div>
      <div class="footer">
        <van-button type="primary" size="large" @click.native="saveTemplate">保存</van-button>
      </div>

      <!-- 外协供应商组件 -->
      <van-popup v-model="carrierShow" position="bottom" :overlay="true">
        <van-picker
          :default-index="carrierDefaultIndex"
          show-toolbar
          :columns="carrierArray"
          @cancel="carrierShow = false"
          @confirm="onConfirmCarrier"
        />
      </van-popup>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { AppFinish } from '@/assets/js/app.js';
import { templateDetail, modifyTemplate } from '../../api/template.js';
import { getCarrier, checkCommonCity } from '../../api/wayBill';
export default {
  name: 'modify_template',
  data() {
    return {
      readOnly: this.$route.query.readOnly === '1',
      goodsAmountType: '0',
      carrierShow: false, //外协状态
      carrierArray: [], // 外协供应商集合
      carrierObj: {},
      carrierDefaultIndex: 0,
      mWaybillTemplateId: this.$route.query.mWaybillTemplateId,
      formData: {
        startPlace: '',
        startPlaceCode: [],
        endPlace: '',
        endPlaceCode: [],
        goodsName: '',
        goodsAmount: '',
        unitPrice: '',
        goodsAmountType: '',
        source: '2',
        templateType: '1', //0：自有运单（默认） 1：外协运单
        supplierOrgName: '', //供应商名称
        supplierOrgId: '', //供应商ID
      },
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'choose_city') {
        let val = vm.cityDataArray;
        if (val.type === 0) {
          vm.formData.startPlace = val.cityArr;
          vm.formData.startPlaceCode = val.cityIdArr;
        } else if (val.type === 1) {
          vm.formData.endPlace = val.cityArr;
          vm.formData.endPlaceCode = val.cityIdArr;
        }
      }
    });
  },
  computed: {
    ...mapState({
      cityDataArray: state => state.cityData.cityDataArray,
    }),
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.dataInit();
    });
  },
  methods: {
    dataInit() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      templateDetail({ mWaybillTemplateId: this.mWaybillTemplateId })
        .then(res => {
          if (res.data.reCode === '0') {
            let result = res.data.result;
            Object.assign(this.formData, result);
            this.formData.startPlaceCode.push(
              result.startProvinceId,
              result.startCityId,
              result.startCountyId,
            );
            this.formData.endPlaceCode.push(
              result.endProvinceId,
              result.endCityId,
              result.endCountyId,
            );
            this.formData.startPlace =
              this.formData.startProvinceName +
              ' ' +
              this.formData.startCityName +
              ' ' +
              this.formData.startCountyName;
            this.formData.endPlace =
              this.formData.endProvinceName +
              ' ' +
              this.formData.endCityName +
              ' ' +
              this.formData.endCountyName;
          }
        })
        .catch(err => {});
    },
    // 导航左侧点击
    onClickLeft() {
      // AppFinish(-1)
      this.$router.go(-1);
    },
    // 外协供应商点击
    carrierStart() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      getCarrier({})
        .then(res => {
          if (res.data.reCode === '0') {
            var data = res.data.result;
            this.carrierObj = data;
            this.carrierArray = [];
            data.forEach(item => {
              this.carrierArray.push(item.carrierOrgShortName);
            });
            // 定位
            if (this.formData.supplierOrgName) {
              this.carrierArray.forEach((item, index) => {
                if (this.formData.supplierOrgName === item) {
                  this.carrierDefaultIndex = index;
                }
              });
            }
            this.carrierShow = true;
          }
        })
        .catch(err => {});
    },
    // 外协供应商确定
    onConfirmCarrier(picker, value, index) {
      this.carrierShow = false;
      this.formData.supplierOrgName = picker;
      this.formData.supplierOrgId = this.carrierObj[value].supplierOrgId;
    },
    // 选择城市
    goChooseCity(type) {
      this.$router.push({ path: '/choose_city', query: { type: type } });
    },
    // 验证同城区县
    isSameCity() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      let json = {
        fromProvId: this.formData.startProvinceId,
        fromCityId: this.formData.startCityId,
        fromCountyId: this.formData.startCountyId,
        toCountyId: this.formData.endCountyId,
        toCityId: this.formData.endCityId,
      };
      return new Promise((resolve, reject) => {
        checkCommonCity(json)
          .then(res => {
            resolve(res.data.reCode);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    //点击保存
    async saveTemplate() {
      if (this.formData.supplierOrgName == '') {
        this.$toast('外协供应商必填！');
        return;
      }
      this.formData.startProvinceId = this.formData.startPlaceCode[0];
      this.formData.startCityId = this.formData.startPlaceCode[1];
      this.formData.startCountyId = this.formData.startPlaceCode[2];
      this.formData.endProvinceId = this.formData.endPlaceCode[0];
      this.formData.endCityId = this.formData.endPlaceCode[1];
      this.formData.endCountyId = this.formData.endPlaceCode[2];
      if ((await this.isSameCity()) == '1') {
        this.$toast('起始地或目的地区县必填!');
        return;
      }
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      modifyTemplate(this.formData)
        .then(res => {
          this.$toast(res.data.reInfo);
          setTimeout(() => {
            this.onClickLeft();
          }, 1500);
        })
        .catch(err => {});
    },
  },
};
</script>

<style lang="less" scoped>
.modify-template {
  background: #ffffff;
  .sub_page_base {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .content {
      flex: 1;
    }
    .footer {
      height: 50px;
      width: 100%;
      box-sizing: border-box;
      padding: 0 25px;
      margin-bottom: 60px;
    }
    // 吨方件车
    .goods-amount-type-box {
      display: flex;
      .goods-amount-type-item {
        font-size: 15px;
        background: #bebebe;
        padding: 0 2px;
        margin: 0 2px;
        border-radius: 6px;
        color: #fff;
        &.active {
          background: #1581cf;
        }
      }
    }
  }
}
</style>
