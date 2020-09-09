<template>
  <div class="stop_waybill_container">
    <c-header>
      <van-nav-bar title="终结" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="title">{{ text }}</div>
      <div class="select">
        <selectImage :multiple="true" :file="file" :imgList="imgList" :imgListMaxLength="10"></selectImage>
        <div class="button_box">
          <div>
            <van-button plain type="primary" size="large" @click="phoneCall">联系司机</van-button>
          </div>
          <div>
            <van-button type="primary" size="large" @click="submit" :disabled="disabled">确认终结</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { operateWaybill, AppFinish, AppGotoTell } from '@/assets/js/app';
import {
  getBillImage,
  uploadImage,
  uploadImgUrl,
  closingWaybill,
} from '@/api/wayBill';
import selectImage from '@/common/components/selectImage';
export default {
  name: 'stop_waybill',
  data() {
    return {
      payState: '0',
      taxWaybillId: this.$route.query.taxWaybillId,
      waybillState: this.$route.query.waybillState,
      category: this.$route.query.category,
      classify: this.$route.query.classify,
      xid: this.$route.query.xid,
      mobileNo: this.$route.query.mobileNo,
      imgList: [], //展示的有url
      file: [], //传后台的
      contractPhotoUrlList: [], //传后台需要tostring
      disabled: false,
    };
  },
  components: {
    selectImage,
  },
  computed: {
    text() {
      return this.payState === '1'
        ? '司机已上传回单，请核实回单信息'
        : '司机未上传回单，请上传回单';
    },
  },
  mounted() {
    this._getBillImage();
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1);
    },
    phoneCall() {
      if (this.mobileNo) AppGotoTell(this.mobileNo);
    },
    _getBillImage() {
      const loading = this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      let json = {
        imageType: 2,
        xid: this.xid,
      };
      getBillImage(json).then(res => {
        loading.clear();
        if (res.data.reCode === '0') {
          let hd = res.data.result.hd;
          if (hd.length > 0) {
            hd.forEach(val => {
              this.imgList.push({ name: '', src: val.origPath });
              this.file.push(null);
              this.payState = '1';
              // this.contractPhotoUrlList.push(val.origPath);
            });
          }
        }
      });
    },
    check() {
      if (this.imgList.length === 0) {
        this.$toast('请上传回单');
        return false;
      }
      return true;
    },
    submit() {
      if (!this.check()) {
        return;
      }
      this.$klb.confirm.show({
        title: '温馨提示',
        content: '是否确认终结运单？',
        confirmText: '确认',
        cancelText: '取消',
        onConfirm: () => {
          if (this.category == '0' && this.classify == '2') {
            try {
              MtaH5.clickStat('wx_stopwaybill_confirmstop_q');
            } catch (error) {
              console.log(JSON.stringify(error));
            }
          } else {
            try {
              MtaH5.clickStat('wx_stopwaybill_confirmstop_w');
            } catch (error) {
              console.log(JSON.stringify(error));
            }
          }
          this.clickConfirm();
        },
        onCancel: () => {},
        onClose: () => {},
      });
    },
    _closingWaybill() {
      this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true,
      });
      let json = {
        taxWaybillId: this.taxWaybillId,
      };
      closingWaybill(json).then(res => {
        if (res.data.reCode === '0') {
          let json = {
            type: '2',
            taxWaybillId: this.taxWaybillId,
            waybillState: this.waybillState,
            refreshList: [],
            content: res.data.result,
          };
          operateWaybill(json);
          //
          this.$klb.confirm.show({
            title: '温馨提示',
            content: '回单已终结，可前往修改货损货差',
            confirmText: '确认',
            cancelText: '取消',
            onConfirm: () => {
              this.gotoModifyWaybil();
            },
            onCancel: () => {
              this.onClickLeft();
            },
            onClose: () => {
              // let json = {
              //   selectedIndex:'0',
              //   subIndex:'2',
              //   waybillTopIndex:'1',
              //   refreshList:[]
              // }
              // jumpIndex(json)
              this.onClickLeft();
            },
          });
        } else {
          this.disabled = false;
        }
      });
    },
    gotoModifyWaybil() {
      this.$store.commit('keepalive/ADD_EXCLUDE_COMPONENT', [
        'confirm_pay_freight',
        'should_pay_freight',
        'supplier_modify_waybill',
        'write_receive_information',
      ]);
      this.$nextTick(() => {
        this.$store.commit('keepalive/REMOVE_EXCLUDE_COMPONENT', [
          'confirm_pay_freight',
          'should_pay_freight',
          'supplier_modify_waybill',
          'write_receive_information',
        ]);
        if (this.category == '0' && this.classify == '2') {
          try {
            MtaH5.clickStat('wx_modifylossfee_q');
          } catch (error) {
            console.log(JSON.stringify(error));
          }
          this.$router.replace({
            path: '/confirm_pay_freight',
            query: {
              taxWaybillId: this.taxWaybillId,
              category: this.category,
              classify: this.classify,
            },
          });
        } else {
          try {
            MtaH5.clickStat('wx_modifylossfee_w');
          } catch (error) {
            console.log(JSON.stringify(error));
          }
          this.$router.replace({
            path: '/supplier_modify_waybill',
            query: {
              taxWaybillId: this.taxWaybillId,
              category: this.category,
              classify: this.classify,
            },
          });
        }
      });
    },
    _uploadImgUrl() {
      return new Promise((resolve, reject) => {
        const loading = this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        let json = {
          taxWaybillId: this.taxWaybillId,
          xid: this.xid,
          receiptUrls: this.contractPhotoUrlList,
        };
        uploadImgUrl(json).then(res => {
          loading.clear();
          if (res.data.reCode !== '0') {
            this.disabled = false;
            this.$toast(res.data.reInfo, 'middle');
            reject();
          } else {
            resolve(res);
          }
        });
      });
    },
    _uploadImage() {
      return new Promise((resolve, reject) => {
        const loading = this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true,
        });
        uploadImage({
          imageFileList: this.file.filter(Boolean),
        })
          .then(res => {
            loading.clear();
            if (res.data.reCode !== '0') {
              reject();
            } else {
              let fileUrl = res.data.result.urlList;
              resolve(fileUrl);
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    clickConfirm() {
      this.disabled = true;
      this._clickConfirm();
    },
    async _clickConfirm() {
      // 上传图片
      let uploadBoolean = true;
      let fileUrl = [];
      if (this.file.filter(Boolean).length !== 0) {
        try {
          fileUrl = await this._uploadImage();
        } catch (e) {
          this.disabled = false;
          uploadBoolean = false;
        }
      }
      this.contractPhotoUrlList = this.imgList.map(
        (currentValue, index, arr) => {
          console.log(arr);
          return this.file[index] ? fileUrl.shift() : currentValue.src;
        },
      );
      if (!uploadBoolean) {
        return;
      }

      // 提交url
      try {
        if (this.contractPhotoUrlList.length === 0) {
          this.disabled = false;
          this.$toast('图片不能为空！', 'middle');
          return;
        }
        await this._uploadImgUrl();
        this._closingWaybill();
      } catch (e) {
        this.disabled = false;
        // this.$toast("网络异常，请稍后再试~~~", "middle");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.stop_waybill_container {
  background: #efefef;
  .title {
    font-size: 15px;
    color: #202020;
    padding: 15px;
  }
  .select {
    padding: 15px;
    background: #fff;
    .button_box {
      margin-top: 40px;
      display: flex;
      justify-content: space-between;
      & > div {
        width: 48%;
      }
    }
  }
}
</style>
