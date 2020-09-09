<template>
  <div class="check_receipt_container">
    <c-header>
      <van-nav-bar title="查看回单" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="select">
        <selectImage
          :multiple="true"
          :file="file"
          :imgList="imgList"
          :imgListMaxLength="10"
        ></selectImage>
        <div class="button_box">
          <van-button type="primary" size="large" :loading="disabled" @click="clickConfirm">保存</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AppFinish } from '@/assets/js/app'
import { getBillImage, uploadImage, uploadImgUrl } from '@/api/wayBill'
import selectImage from '@/common/components/selectImage'
export default {
  name: 'check_receipt',
  data() {
    return {
      hybState: this.$route.query.hybState, // 2展示
      taxWaybillId: this.$route.query.taxWaybillId,
      waybillState: this.$route.query.waybillState,
      xid: this.$route.query.xid,
      imgList: [], //展示的有url
      file: [], //传后台的
      contractPhotoUrlList: [], //传后台需要tostring
      disabled: false
    }
  },
  components: {
    selectImage
  },
  computed: {},
  mounted() {
    this._getBillImage()
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      AppFinish(-1)
    },
    _getBillImage() {
      const loading = this.$toast.loading({
        duration: 0,
        message: '加载中',
        forbidClick: true
      })
      let json = {
        imageType: 2,
        xid: this.xid
      }
      getBillImage(json).then(res => {
        loading.clear()
        if (res.data.reCode === '0') {
          let hd = res.data.result.hd
          if (hd.length > 0) {
            hd.forEach(val => {
              this.imgList.push({ name: '', src: val.origPath })
              this.file.push(null)
            })
          }
        }
      })
    },
    _uploadImgUrl() {
      return new Promise((resolve, reject) => {
        const loading = this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true
        })
        let json = {
          taxWaybillId: this.taxWaybillId,
          xid: this.xid,
          receiptUrls: this.contractPhotoUrlList
        }
        uploadImgUrl(json).then(res => {
          loading.clear()
          if (res.data.reCode !== '0') {
            this.disabled = false
            reject()
          } else {
            resolve(res)
          }
        })
      })
    },
    _uploadImage() {
      return new Promise((resolve, reject) => {
        const loading = this.$toast.loading({
          duration: 0,
          message: '加载中',
          forbidClick: true
        })
        uploadImage({
          imageFileList: this.file.filter(Boolean)
        }).then(res => {
          loading.clear()
          if (res.data.reCode !== '0') {
            reject()
          } else {
            let fileUrl = res.data.result.urlList
            resolve(fileUrl)
          }
        })
      })
    },
    clickConfirm() {
      this.disabled = true
      this._clickConfirm()
    },
    async _clickConfirm() {
      // 上传图片
      let uploadBoolean = true
      let fileUrl = []
      if (this.file.filter(Boolean).length !== 0) {
        try {
          fileUrl = await this._uploadImage()
        } catch (e) {
          this.disabled = false
          uploadBoolean = false
        }
      }
      this.contractPhotoUrlList = this.imgList.map(
        (currentValue, index, arr) => {
          console.log(arr)
          return this.file[index] ? fileUrl.shift() : currentValue.src
        }
      )
      if (!uploadBoolean) {
        return
      }

      // 提交url
      try {
        if (this.contractPhotoUrlList.length === 0) {
          this.disabled = false
          this.$toast('图片不能为空！', 'middle')
          return
        }
        await this._uploadImgUrl()
      } catch (e) {
        this.disabled = false
      }
      // 返回APP并通知
      this.$toast('保存成功', 'middle')
      setTimeout(() => {
        AppFinish(-1)
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.check_receipt_container {
  background: #efefef;
  .select {
    padding: 15px;
    background: #fff;
    .button_box {
      margin-top: 40px;
      width: 100%;
    }
  }
}
</style>
