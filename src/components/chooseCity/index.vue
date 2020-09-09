<template>
  <div class="choose_city_container">
    <c-header>
      <van-nav-bar title="城市搜索" left-arrow fixed @click-left="onClickLeft"></van-nav-bar>
    </c-header>
    <div class="sub_page_base">
      <div class="search_ipt_cxt">
        <div class="search_ipt_style">
          <i class="iconfont iconsousuo" style="font-size: 26px; color: #15499A;"></i>
          <van-field title placeholder="城市搜索" v-model.trim="condition"></van-field>
        </div>
      </div>
      <div style="padding: 0 22px;">
        <p
          class="searchCity"
          v-show="dataShow"
          style="border-bottom: 1px solid #DFDFDF;color: #797979;text-indent: 1em;font-size: 15px;padding:8px;"
          v-for="(a, b) in searchCityVal"
          :key="b"
          @click="selectCity(a, b)"
          :class="b == h ? 'fontActive' : ''"
        >{{ a.name }}</p>
      </div>
      <!-- 地图位置 -->
      <div class="bg_ef"></div>
      <div id="container" style="display:none"></div>
      <!-- 常用地址区域 -->
      <div v-show="searchShow">
        <div style="margin:20px auto;" class="address" v-show="usuallyShow">
          <p style="margin-left: 2.4%;font-weight:bold;margin-bottom: 6px;">定位/常用地址</p>
          <div class="car-msg-choose">
            <div class="car-choose-btn" @click="dingweiCity()" v-show="type == 0">
              <i class="iconfont icondidiandingwei" style="color:#FFBA00"></i>
              {{ location }}
            </div>
            <div
              class="car-choose-btn"
              @click.once="chooseCity(index)"
              v-for="(item, index) in cityList"
              :key="index"
            >{{ item.cityPlace + item.countyPlace }}</div>
          </div>
        </div>
        <div class="bg_ef"></div>
        <!-- A-Z排序 -->
        <div style="margin:20px auto;min-height:900px;" class="cityContent">
          <!-- <div class="line" style="border-top:1px dashed #797979;margin:0 2.4%;"></div> -->
          <div class="city" style="margin:0 2.4%;">
            <!-- <a href="javascript:;" class="crt">请选择</a> -->
            <div class="city city-wap" style="position:relative;">
              <div class="city-list">
                <div class="block-60" :class="searchBarFixed == true ? 'isFixed' : ''">
                  <p>请选择</p>
                  <p
                    @click="cartTypeBtn()"
                    style="background:#CFCFCF"
                    :class="show1 == true ? 'fontActive1' : ''"
                  >确定</p>
                </div>
                <div
                  v-for="(item, val) in cityListData"
                  :key="val"
                  class="clearfix"
                  style="position:relative;"
                >
                  <!-- <p :id="item.ckey">{{item.ckey}}</p> -->
                  <ul style="left:0px;" :class="searchBarFixed == true ? 'istop' : ''">
                    <li
                      v-for="(ritem, idx) in item.cityList"
                      v-show="item.ckey == anchor"
                      :key="idx"
                      @click="checkCity(ritem, idx)"
                      :class="idx === j ? 'fontActive' : ''"
                    >{{ ritem.airportName }}</li>
                  </ul>
                </div>
              </div>
              <ul style="left:200px;" v-show="countyState">
                <li
                  v-for="(a, b) in countyList"
                  :key="b"
                  @click="checkCounty(a, b)"
                  :class="b === k ? 'fontActive' : ''"
                >{{ a.name }}</li>
              </ul>
              <div class="filter">
                <div
                  v-for="(item, dex) in cityListKey"
                  :key="dex"
                  @click="switchKey(item, dex)"
                  :class="dex == i ? 'fontActive1' : ''"
                >{{ item }}</div>
              </div>
              <div class="active-key" v-if="activeKey">{{ activeKey }}</div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { getHotCity } from '@/api/externalassistanceapi.js'
import { cityDataToIWant, mohuCity, mohuCounty, value2name } from './cMethods'
// import sysType from '../common/systemType'
export default {
  name: 'choose_city',
  data() {
    return {
      location: '定位中...', //定位地址
      condition: '', //城市搜索的内容
      cityList: [], //热门城市集合
      show1: false, //是否显示确定按钮
      dataShow: true, //没有城市数据的时候显示提示文字
      usuallyShow: true, //常用地址默认显示
      searchShow: true,
      citys: cityDataToIWant(city.data),
      searchCity: mohuCity(city.data), //模糊数据集合
      searchCounty: mohuCounty(city.data), //模糊处理城市加区县
      searchCityVal: [], //模糊搜索出来的数据
      cityLists: [], //列表城市

      //第三部分 A-Z数据
      activeKey: '',
      anchor: 'A', //默认选中A字段对应的城市
      countyState: false, //默认不显示区县
      countyList: [], //得到的区县集合
      h: '0', //搜索栏默认选中第一个
      i: '0', //字母默认选中第一项
      j: '', //城市选中状态
      k: '', //区县选中状态

      //最后选择的数据 CityId
      cityArr: [''],
      cityIdArr: [''],
      type: this.$route.query.type, //判断是点击始发城市进来的还是目的城市进来的

      dingweiState: true, //定位是否开启的标志

      searchBarFixed: false, //确定栏固定位置

      clickFlag: '1',
      flag: ''
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.flag != 1) {
      this.cityIdArr = []
    }
    next()
  },
  watch: {
    //动态监测输入的值，去取数据
    condition() {
      var timer = null
      if (timer) {
        clearTimeout(this.timer)
      }
      if (this.condition != '') {
        this.dataShow = true
        this.searchShow = false
        timer = setTimeout(() => {
          this.searchCityVal = []
          const result = []
          this.searchCounty.forEach(item => {
            if (
              item.py.indexOf(this.condition) > -1 ||
              item.name.indexOf(this.condition) > -1
            ) {
              result.push(item)
            }
          })
          this.searchCityVal = result
        }, 100)
        return false
      }
      this.dataShow = false
      this.searchShow = true
    },
    //监听cityArr是否有值，即是否选择了城市数据
    cityIdArr() {
      if (this.cityIdArr.length == '0') {
        this.show1 = false
        this.usuallyShow = true
        return
      }
      this.show1 = true
      this.usuallyShow = false
    }
  },
  created() {},
  mounted() {
    //初始化常用城市数据
    const loading = this.$toast.loading({
      duration: 0,
      message: '加载中',
      forbidClick: true
    })
    getHotCity({ type: this.type })
      .then(res => {
        loading.clear()
        if (res.data.reCode === '0') {
          this.cityList = res.data.result.placeList
        } else {
          this.$toast(res.data.reInfo)
        }
      })
      .catch(err => {
        loading.clear()
        console.log(err)
      })
    // 初始化APP是否开启了定位权限
    //只有IOS会有定位权限问题,安卓关闭定位权限也会成功
    // if (this.$sysType == 2 && this.type == 0) {
    //   window.webkit.messageHandlers.isOpenLocationPermission.postMessage('')
    // }

    this.gaodeGps()

    //监听页面滑动高度
    window.addEventListener('scroll', this.handleScroll)
  },
  computed: {
    cityListData() {
      let map = {}
      let temps = []
      this.searchCity.map(item => {
        if (item.py) {
          let ekey = item.py.charAt(0).toUpperCase()
          temps = map[ekey] || []
          temps.push({
            airportCode: item.py,
            airportName: item.name
          })
          map[ekey] = temps
        }
      })
      let list = []
      for (let gkey in map) {
        list.push({
          ckey: gkey,
          cityList: map[gkey]
        })
      }
      list = list.sort(
        (li1, li2) => li1.ckey.charCodeAt(0) - li2.ckey.charCodeAt(0)
      )
      return list
    },
    // 字母 A-Z
    cityListKey() {
      let cityListKey = []
      this.cityListData.map(item => {
        cityListKey.push(item.ckey)
      })
      return cityListKey
    }
  },
  methods: {
    // 导航左侧点击
    onClickLeft() {
      this.$router.back()
    },
    getAddressName() {
      return value2name(this.cityIdArr, this.citys)
    },
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      let height
      this.usuallyShow == true ? (height = 240) : (height = 120)
      scrollTop > height
        ? (this.searchBarFixed = true)
        : (this.searchBarFixed = false)
    },
    gaodeGps() {
      // console.log(this.type)
      this.location = '定位中...'
      if (this.type == 0) {
        var v = this
        var address = []
        var map, geolocation
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
          resizeEnable: true
        })
        map.plugin(['AMap.Geolocation', 'AMap.Geocoder'], function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            timeout: 10000, //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          })
          map.addControl(geolocation)
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', onComplete) //返回定位信息
          AMap.event.addListener(geolocation, 'error', onError) //返回定位出错信息
        })
        //解析定位结果
        function onComplete(data) {
          var str = ['定位成功']
          str.push('经度：' + data.position.getLng())
          str.push('纬度：' + data.position.getLat())
          address = [data.position.getLng(), data.position.getLat()]
          console.log(str)
          // 定位信息解析成地址
          var geocoder = new AMap.Geocoder({
            city: '010' //城市，默认：“全国”
          })
          var marker = new AMap.Marker({
            map: map,
            bubble: true
          })
          marker.setPosition(address)
          geocoder.getAddress(address, function(status, result) {
            if (status == 'complete') {
              let citycode = result.regeocode.addressComponent.citycode;
              let city = result.regeocode.addressComponent.city;
              // 北京 天津 上海 重庆 香港 澳门
              let whiteCityList = ['010', '022', '021', '023', '1852', '1853']
              let tempCity = ''
              if (!!city) {
                tempCity = city;
                v.location = tempCity + ',' + result.regeocode.addressComponent.district
              } else if (whiteCityList.includes(citycode.toString())) {
                // 4个直辖市和2个特别行政区
                tempCity = result.regeocode.addressComponent.province;
                v.location = tempCity + ',' + result.regeocode.addressComponent.district
              } else {
                tempCity = '';
                v.location = result.regeocode.addressComponent.district
              }
            }
          })
        }
        //解析定位错误信息
        function onError(data) {
          v.location = '定位失败'
        }
      }
    },
    //定位城市选择
    dingweiCity() {
      if (this.location != '定位失败' && this.location != '定位中...') {
        let parent1, parent2, parent3
        let item0 = this.location.split(',')[0]
        let item1 = item0.substr(0, item0.length - 1)
        let item2 = this.location.split(',')[1]
        this.citys.forEach(vm => {
          if (vm.name == item1) {
            parent1 = vm.parent
            parent2 = vm.value
          }
        })
        this.citys.forEach(vn => {
          if (vn.name == item2) {
            parent3 = vn.value
          }
        })
        this.cityIdArr[0] = parent1
        this.cityIdArr[1] = parent2
        this.cityIdArr[2] = parent3
        let cityArr = this.getAddressName()
        let json = {
          cityIdArr: this.cityIdArr,
          type: this.type,
          cityArr: cityArr
        }
        this.$store.commit('updateCityData', json)
        this.flag = 1
        this.$router.go(-1)
      } else if (this.location == '定位中...') {
        return
      } else {
        this.$toast('重新定位中...')
        //如果定位失败，可以点击重新刷新页面
        // window.location.reload();
        this.gaodeGps()
      }
    },
    //常用城市选择
    chooseCity(item) {
      this.cityArr = ['']
      this.cityIdArr = ['']
      // this.$vux.toast.text(this.cityList[item].place, 'middle');
      this.cityArr.push(
        this.cityList[item].cityPlace,
        this.cityList[item].countyPlace
      )
      this.cityIdArr.push(
        this.cityList[item].cityId,
        this.cityList[item].countyId
      )
      this.getProvince(this.cityList[item].cityPlace)
      this.show = false
      this.flag = 1
      let cityArr = this.getAddressName()
      let json = {
        cityIdArr: this.cityIdArr,
        type: this.type,
        cityArr: cityArr
      }
      this.$store.commit('updateCityData', json)
      this.$router.go(-1)
    },
    selectCity(item, index) {
      this.condition = item.name
      this.dataShow = true
      let name = item.name.split(' ')
      if (name.length == 2) {
        //有城市和县区
        let city = name[0]
        let county = name[1]
        this.getProvince(city)
        let value1, value2
        this.citys.forEach(v => {
          if (v.name == city) {
            value1 = v.value
          }
          if (v.name == county) {
            value2 = v.value
          }
        })
        this.cityIdArr[1] = value1
        this.cityIdArr[2] = value2
      } else {
        //只有城市
        this.getProvince(name[0])
        let value
        this.citys.forEach(v => {
          if (v.name == name[0]) {
            value = v.value
          }
        })
        this.cityIdArr[1] = value
        this.cityIdArr[2] = ''
      }
      this.flag = 1
      let cityArr = this.getAddressName()
      let json = {
        cityIdArr: this.cityIdArr,
        type: this.type,
        cityArr: cityArr
      }
      this.$store.commit('updateCityData', json)
      this.$router.go(-1)
    },

    //选定城市
    checkCity(item, index) {
      this.j = index
      this.k = ''
      this.countyState = true
      //得到城市过后,再去基础数据里面寻找区县
      let parent1, value1
      this.countyList = []
      this.citys.forEach(v => {
        if (v.name == item.airportName) {
          parent1 = v.value //市的value
          value1 = v.parent //区的parent
        }
      })
      this.citys.forEach(vm => {
        if (vm.parent == parent1) {
          this.countyList.push(vm)
        }
      })

      this.getProvince(item.airportName)
      let value
      this.citys.forEach(v => {
        if (v.name == item.airportName) {
          value = v.value
        }
      })
      this.cityIdArr[1] = value
      this.cityIdArr[2] = ''
    },
    //选定区县
    checkCounty(item, index) {
      this.k = index
      //已经知道了省份的ID和市的ID
      //通过判断区的name 去找 区的ID
      let value, code
      this.citys.forEach(v => {
        if (v.value == this.cityIdArr[1]) {
          value = v.value
        }
      })
      this.citys.forEach(vm => {
        if (vm.name == item.name) {
          code = vm.value
        }
      })
      this.cityIdArr[2] = code
    },

    switchKey(key, val) {
      // this.show1 = true;
      // 当前选中的字母
      this.activeKey = key
      this.j = ''
      this.k = ''
      this.i = val
      this.anchor = key
      this.countyList = []
      this.cityIdArr = []
      // 1秒后清空，让`active-key`隐藏
      setTimeout(() => {
        this.activeKey = ''
      }, 1000)
    },

    //点击确定按钮，携带城市的Cityid到页面去
    cartTypeBtn() {
      if (this.show1 != true) {
        return
      }
      this.flag = 1
      let cityArr = this.getAddressName()
      let json = {
        cityIdArr: this.cityIdArr,
        type: this.type,
        cityArr: cityArr
      }
      this.$store.commit('updateCityData', json)
      this.$router.back()
    },

    //通过市的名字去查找省份
    getProvince(item) {
      //  var item = "合肥";
      let parent
      this.citys.forEach(v => {
        if (v.name == item) {
          parent = v.parent
        }
      })
      this.cityIdArr.splice(0, 1, parent)
    },
    //通过市、区的名字去获取市和区的ID
    getCityId(item1, item2) {
      let value1, value2, parent
      this.citys.forEach(v => {
        if (v.name == item1) {
          value1 = v.value
          parent = v.parent
        }
      })
      this.citys.forEach(vm => {
        if (vm.parent == value1) {
          if (vm.name == item2) {
            value2 = vm.value
          }
        }
      })
      this.cityIdArr[1] = value1
      this.cityIdArr[2] = value2
    }
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>
<style lang="less">
.choose_city_container {
  width: 100%;
  // background-color: #efefef;
  background: #fff;
  position: absolute;
  top: 0px;
  min-height: 100%;
  height: auto;
  overflow-x: hidden;
  overflow-y: scroll;
  .fontActive {
    color: #15499a !important;
    font-size: 18px !important;
  }
  .van-cell {
    background: none;
  }
  .bg_ef {
    height: 0.875rem;
    background-color: #efefef;
  }
  .fontActive1 {
    font-size: 1.125rem !important;
    color: #fff !important;
    border: 1px solid;
    padding: 0rem 0.5rem;
    background: #15499a !important;
  }

  .search_ipt_cxt {
    display: flex;
    margin-top: 10px;
    width: 100%;
    height: 46px;
    line-height: 46px;
    padding: 12px;

    .search_ipt_style {
      display: flex;
      align-items: center;
      width: 93%;
      height: 37px;
      border-radius: 4px;
      // border: 1px solid #BFBFBF;
      background: #f6f6f6;
      /deep/ .van-cell__value {
        margin-left: 0px !important;
      }
      .weui-cell {
        width: 96%;
      }

      .weui-cell:before {
        position: static;
      }

      .weui-input {
        width: 100%;
        height: 24px;
        padding: 11px 0px;
        line-height: 24px;
      }

      input::-webkit-input-placeholder {
        color: #9f9f9f;
        font-size: 14px;
      }

      img {
        width: 14px;
        height: 14px;
        padding-left: 12px;
      }
    }
  }
  .car-msg-choose {
    width: 100%;
    min-height: 56px;
    height: auto;
    display: flex;
    flex-wrap: wrap;

    .car-choose-btn {
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-radius: 5px;
      background: #f6f6f6;
      color: #797979;
      margin-top: 16px;
      margin: 0.2rem 0.5rem;
      padding: 0 0.5rem;
    }

    .choose-btn-active {
      background-color: #1581cf;
      color: #fff;
    }
  }

  .crt {
    color: #f23030;

    &:after {
      content: '';
      width: 20%;
      height: 2px;
      background-color: #f23030;
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 2;
    }
  }

  //A-Z
  .city-wap {
    color: #454545;

    .clearfix {
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    }

    p {
      background: #fff;
      margin-bottom: 10px;
      padding: 0 12px;
    }

    .search {
      position: fixed;
      top: 0px;
      box-shadow: 0 1px 3px 0 rgba(59, 79, 98, 0.1);
      width: 100%;
      height: 50px;

      input {
        line-height: 50px;
        width: 100%;
        border: none;
        box-shadow: none;
        padding: 0 10px;

        &:focus {
          outline: none;
        }
      }
    }

    .city-list {
      margin-left: 15%;
      .isFixed {
        position: fixed;
        width: 80%;
        top: 46px;
      }
      .block-60 {
        height: 40px;
        text-align: center;
        border-bottom: 1px solid #efefef;
        //   position: fixed;
        z-index: 20;
        //   width: 80%;
        background: #fff;
        p {
          // position: absolute;
          // bottom: 0;
          // // left: 50%;
          // left: 15%;
          font-weight: bold;
          margin-top: 5px;
          float: left;
          &:nth-child(2) {
            // position: absolute;
            // bottom: 0;
            // right:0;
            color: #fff;
            float: right;
            background-color: #15499a;
            border-radius: 5px;
            font-weight: normal;
            padding: 2px 10px;
          }
        }
      }
    }
    .istop {
      top: 38px;
    }
    ul {
      padding: 0 10px;
      position: absolute;
      width: 50%;
      // top:38px;
      li {
        list-style: none;
        display: block;
        /* margin-right: 10px; */
        line-height: 35px;
        // text-align: center;
        text-align: left;
        color: #454545;
        /* border-radius: 3px; */
        font-size: 15px;
        white-space: nowrap;
        /* overflow: hidden; */
        /* text-overflow: ellipsis; */
        padding: 0 2px;
        background: #fff;
      }
    }

    .filter {
      position: absolute;
      left: 0px;
      top: 40px;
      font-size: 15px;
      background: #f6f6f6;
      width: 40px;
      div {
        //   margin-top: 8px;
        padding: 5px 0;
        text-align: center;
      }
    }

    .active-key {
      position: fixed;
      width: 80px;
      height: 80px;
      line-height: 80px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 100;
      background: #78797b;
      color: #fff;
      border-radius: 100%;
      text-align: center;
      font-size: 30px;
    }
  }
}
</style>
