<template>
  <div class="city_picker">
    <!-- vant Picker 根据 绑定的columns数据，来渲染几级联动，这里我们使用的是三级联动 -->
    <van-picker
      show-toolbar
      :columns="columns"
      @cancel="onCancel"
      @confirm="onConfirm"
      @change="onChange"
      :item-height="35"
    />
  </div>
</template>
<script>
export default {
  name: 'city_picker',
  props: {
    columnsNum: {
      type: [Number, String],
      default: 2
    }
  },
  data() {
    return {
      // columns 为三个，即渲染出来的就是三级联动。
      columns: [
        {
          values: '',
          className: 'column1'
        },
        {
          values: '',
          className: 'column2',
          defaultIndex: 0
        }
      ],
      cityDatas: '', //安联当前选中市的所有区所有数据
      showPicker: false, //vant Popup弹出框显示隐藏
      data: {} //接口返回所有省市区数据
    }
  },
  created() {
    this.data = window.city.data
    // 默认展示一级的数据
    this.columns[0].values = Object.values(this.data).map(function(e) {
      return { text: e.addrName, code: e.cityId }
    })
    // 默认展示二级的数据
    this.columns[1].values = Object.values(this.data[0].child).map(function(e) {
      return { text: e.addrName, code: e.cityId }
    })
    if (this.columnsNum == 3) {
      this.columns.push({
        values: '',
        className: 'column3',
        defaultIndex: 0
      })
      // 默认展示三级的数据
      this.columns[2].values = Object.values(this.data[0].child[0].child).map(
        function(e) {
          return { text: e.addrName, code: e.cityId }
        }
      )
    }
  },
  mounted() {},
  methods: {
    // vant picker选择器回调
    // eslint-disable-next-line no-unused-vars
    async onChange(picker, values, index) {
      // 回调时修改第2列数据
      await picker.setColumnValues(1, this.cityDate(this.data, values[0].text))
      if (this.columnsNum == 3) {
        // 回调时修改第3列数据
        picker.setColumnValues(
          2,
          this.county(this.data, picker.getColumnValue(1).text)
        )
      }
    },
    cityDate(data, province) {
      var that = this
      data.forEach(function(res) {
        if (res.addrName == province) {
          that.cityDatas = res
        }
      })

      return Object.values(that.cityDatas.child).map(function(res) {
        return { text: res.addrName, code: res.cityId }
      })
    },
    county(data, county) {
      var that = this
      var countyData = ''
      that.cityDatas.child.forEach(function(res) {
        if (res.addrName == county) {
          countyData = res
        }
      })

      if (countyData && countyData.child && Array.isArray(countyData.child)) {
        return Object.values(countyData.child).map(function(res) {
          return { text: res.addrName, code: res.cityId }
        })
      } else {
        return []
      }
    },
    onConfirm(val, index) {
      this.showPicker = false
      let text = val[0].text + ' ' + val[1].text
      let code = val.map(function(res) {
        return (res && res.code) || ''
      })
      if (this.columnsNum == 3 && val[2] && val[2].text) {
        text += val[2].text
      }
      this.$emit('onConfirm', { text, code, val, index })
    },
    // eslint-disable-next-line no-unused-vars
    onCancel(val, index) {
      this.showPicker = false
      this.$emit('onCancel', val, index)
    }
  }
}
</script>
