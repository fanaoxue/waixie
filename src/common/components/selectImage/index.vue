<template>
  <div class="select-image-container">
    <!-- 一个选择多个展示 -->
    <div v-if="multiple">
      <div class="multiple-content">
        <div
          class="multiple-show-content"
          v-show="imgList.length != 0"
          v-for="(item, index) of imgList"
          :key="index"
        >
          <div class="show-box multiple-show-box">
            <div
              class="show-img-box multiple-show-img-box"
              @click="show(index)"
            >
              <div class="upload_warp_img_div_top">
                <div class="upload_warp_img_div_text">{{ item.name }}</div>
                <img
                  src="./chacha@2x.png"
                  class="upload_warp_img_div_del"
                  v-if="!isNoChangeAmount && !disabled"
                  @click.prevent.stop="fileDel(index)"
                />
                <!-- v-show="imgList.length > 1" -->
              </div>
              <img class="show-img" :src="item.src" />
            </div>
          </div>
          <div v-if="reUpload" class="select-bottom-box">
            <div class="select-bottom">
              <div @click="fileClick(index)">重新上传</div>
            </div>
          </div>
        </div>

        <div
          class="select-box"
          @click="fileClick(imgList.length)"
          v-show="!isNoChangeAmount && imgList.length < imgListMaxLength"
          v-if="!disabled"
          :style="borderStyle == 'dashed' ? 'border: 1px dashed #999;' : ''"
        >
          <div class="select-img-box">
            <img class="select-img" src="./tianjia_icon@2x.png" />
          </div>
        </div>
      </div>
    </div>

    <!-- 一个选择一个展示 -->
    <div v-if="!multiple">
      <slot name="select-title"></slot>
      <div class="content">
        <div v-for="index in count" :key="index">
          <div
            class="select-box"
            @click="fileClick(index - 1)"
            v-show="!imgList[index - 1]"
          >
            <div class="select-img-box">
              <img class="select-img" src="./tianjia_icon@2x.png" />
              <slot name="select-text"></slot>
              <slot :name="'select-text' + index"></slot>
            </div>
          </div>

          <div class="show-box" v-if="!!imgList[index - 1]">
            <div class="show-img-box" @click="show(index - 1)">
              <!-- 对预览有影响 -->
              <!-- <div class="upload_warp_img_div_top">
                <div class="upload_warp_img_div_text">{{imgList[index-1].name}}</div>
                <img
                  src="../../../assets/imgs/chacha@2x.png"
                  class="upload_warp_img_div_del"
                  @click.stop="fileDel(index-1)"
                >
              </div>-->
              <img class="show-img" :src="imgList[index - 1].src" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="reUpload" class="select-bottom-box">
        <div v-for="index in count" :key="index" style="width: 50%">
          <div class="select-bottom">
            <div @click="fileClick(index - 1)" v-show="!!imgList[index - 1]">
              重新上传
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- multiple -->
    <input
      class="file"
      type="file"
      id="files"
      ref="file"
      name="imageFile"
      @change="handleFilesUpload($event)"
      accept="image/*"
    />
    <!-- capture="camera" -->
  </div>
</template>
<script>
import lrz from 'lrz'
import { ImagePreview } from 'vant'
export default {
  name: 'selectImage',
  data() {
    return {
      // imgList: [],
      selectIndex: 0
    }
  },
  computed: {
    list() {
      let arr = []
      this.imgList.forEach(element => {
        if (element) {
          // if()
          arr.push({ src: element.src })
        }
      })
      return arr
    }
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    count: {
      type: Number,
      default: 1
    },
    file: {
      type: Array,
      default: () => {
        return []
      }
    },
    reUpload: {
      type: Boolean,
      default: false
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    },
    imgListMaxLength: {
      type: Number,
      default: 2
    },
    borderStyle: {
      type: String,
      default: ''
    },
    isNoChangeAmount: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  methods: {
    show(index) {
      // this.$refs.previewer.show(index)
      ImagePreview({
        // eslint-disable-next-line no-unused-vars
        images: this.imgList.filter(Boolean).map((value, index) => value.src),
        startPosition: index,
        closeOnPopstate: true,
        onClose() {
          // do something
        }
      })
    },
    fileClick(index) {
      if (this.disabled) return
      this.selectIndex = index
      //点击选择图片按钮
      // document.getElementById("files").click();
      this.$refs.file.dispatchEvent(new MouseEvent('click'))
    },
    handleFilesUpload(el) {
      let _this = this
      let file = el.target.files[0]
      lrz(file, { quality: 0.5, fieldName: 'file' })
        .then(function(rst) {
          // if (_this.multiple) {
          //   _this.file.push(rst.base64);
          // } else {
          //   _this.$set(_this.file, _this.selectIndex, rst.base64);
          // }
          _this.$set(_this.file, _this.selectIndex, rst.base64)
          let _file = {}
          _file.src = rst.base64
          _file.name = file.name
          // if (_this.multiple) {
          //   _this.imgList.push(_file);
          // } else {
          //   _this.$set(_this.imgList, _this.selectIndex, _file);
          // }
          _this.$set(_this.imgList, _this.selectIndex, _file)
          _this.$refs.file.value = ''
        })
        .catch(function(err) {
          // 万一出错了，这里可以捕捉到错误信息
          // 而且以上的then都不会执行
          console.log(err)
        })
    },
    fileAdd(file) {
      let reader = new FileReader()
      reader._this = this
      reader.readAsDataURL(file)
      reader.onload = function() {
        let _file = Object.assign({}, file)
        _file.src = this.result
        if (reader._this.multiple) {
          reader._this.imgList.push(_file)
        } else {
          reader._this.$set(
            reader._this.imgList,
            reader._this.selectIndex,
            _file
          )
        }
      }
      this.$refs.file.value = ''
    },
    fileDel(index) {
      //删除已选择的图片
      this.size = this.size - this.imgList[index].size //总大小
      if (this.multiple) {
        this.imgList.splice(index, 1)
        this.file.splice(index, 1)
      } else {
        this.$set(this.imgList, index, null)
        this.$set(this.file, index, null)
      }
    }
  }
}
</script>
<style lang="less">
.select-image-container {
  width: 100%;
  background: #fff;
  .multiple-content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: flex-start;
    .multiple-show-content {
      width: 100px;
      margin-right: 10px;
      margin-bottom: 10px;
      .multiple-show-box {
        width: 100px;
        height: 75px;
        border: 1px solid #d3d3d4;
      }
    }
    .select-box {
      width: 100px;
      height: 75px;
      margin-right: 10px;
      margin-bottom: 10px;
      border: 1px solid #d3d3d4;
      box-sizing: border-box;
    }
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: space-between;
    & > div {
      width: 45%;
      height: 115px;
      border: 1px dashed #bfbfbf;
    }
  }
  .file {
    width: 0;
    display: none;
  }
  .select-box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    .select-img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .select-img {
      width: 38px;
    }
  }

  .select-bottom-box {
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      // width: 50%;
      font-size: 15px;
      font-family: PingFang-SC-Medium;
      text-decoration: underline;
      font-weight: 500;
      color: #15499a;
      text-align: center;
    }
  }

  .show-box {
    display: flex;
    .show-img-box {
      display: flex;
      justify-content: center;
      align-items: center;
      // width: 163px;
      width: 100%;
      height: 115px;
      position: relative;
      overflow: hidden;
      .show-img {
        max-width: 100%;
        max-width: 100%;
        vertical-align: middle;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .upload_warp_img_div_top {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 30px;
        background-color: rgba(0, 0, 0, 0.4);
        line-height: 30px;
        text-align: left;
        color: #fff;
        font-size: 12px;
        text-indent: 4px;
      }
    }
    .multiple-show-img-box {
      width: 150px;
      height: 75px;
    }
  }
}
.upload_warp_img_div_del {
  position: absolute;
  top: 6px;
  width: 16px;
  right: 4px;
}

.upload_warp_img_div_text {
  white-space: nowrap;
  width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload_warp_img_div img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}

.upload_warp_img_div {
  position: relative;
  height: 100px;
  width: 120px;
  border: 1px solid #ccc;
  margin: 0px 5px 5px 0px;
  float: left;
  line-height: 100px;
  display: table-cell;
  text-align: center;
  background-color: #eee;
  cursor: pointer;
}

.upload_warp_text {
  text-align: left;
  margin-bottom: 5px;
  padding-top: 5px;
  text-indent: 14px;
  border-top: 1px solid #ccc;
  font-size: 14px;
}

.upload_warp_right {
  float: left;
  width: 57%;
  margin-left: 2%;
  height: 100%;
  border: 1px dashed #999;
  border-radius: 4px;
  line-height: 130px;
  color: #999;
}

.upload_warp_left button {
  margin: 8px 5px 0px 5px;
  cursor: pointer;
}

.upload_warp_left {
  float: left;
}

.upload_warp {
  margin: 5px;
}

.upload {
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
  background-color: #fff;

  box-shadow: 0px 1px 0px #ccc;
  border-radius: 4px;
}
</style>
