import map from 'array-map'
import find from 'array-find'
/**
 *
 *城市数据格式转换处理
 * @export cityDataToIWant
 * @param {*} data
 * @returns arr
 */
export function cityDataToIWant(data) {
  var arr = []
  for (var i = 0; i < data.length; i++) {
    var province = data[i]
    arr.push({
      name: province.cityName,
      value: province.cityId
    })
    for (var j = 0; j < province.child.length; j++) {
      var city = province.child[j]
      arr.push({
        name: city.cityName,
        value: city.cityId,
        parent: province.cityId,
        cityPinyin: city.cityPinyin
      })
      if (city.child) {
        arr.push({
          name: '',
          value: '',
          parent: city.cityId
        })
        for (var k = 0; k < city.child.length; k++) {
          var country = city.child[k]
          arr.push({
            name: country.cityName,
            value: country.cityId,
            parent: city.cityId
          })
        }
      } else {
        arr.push({
          name: '',
          value: '',
          parent: city.cityId
        })
      }
    }
  }
  return arr
}

/**
 * 模糊处理城市
 *
 * @export
 * @param {*} data
 * @returns
 */
export function mohuCity(data) {
  var searchCity = []
  data.forEach(item => {
    // console.log(item)
    item.child.forEach(index => {
      // console.log(index)
      let obj = {}
      obj.name = index.cityName
      obj.py = index.cityPinyin
      searchCity.push(obj)
    })
  })
  return searchCity
}

/**
 * 模糊处理城市+区县
 *
 * @export
 * @param {*} data
 * @returns
 */
export function mohuCounty(data) {
  var searchCity = []
  data.forEach(item => {
    item.child.forEach(index => {
      //   console.log(index)
      let obj = {}
      obj.name = index.cityName
      obj.py = index.cityPinyin
      searchCity.push(obj)
      if (index.child) {
        index.child.forEach(vm => {
          let obj1 = {}
          obj1.name = index.cityName + ' ' + vm.cityName
          obj1.py = index.cityPinyin + ' ' + vm.cityPinyin
          searchCity.push(obj1)
        })
      }
      //   index.forEach((v) => {
      //     // countyName = index.child.fullName
      //     // countyPy = index.child.cityPinyin
      //     console.log(v)
      //   })
    })
  })
  return searchCity
}

/**
 *
 *地址栏参数属性值获取
 * @export GetQueryString
 * @param {*} name
 * @returns 地址栏参数key对应的属性值
 */
export function GetQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export function value2name(value, list, delimiter) {
  if (value && !list.length) {
    return ''
  }
  if (!delimiter) {
    delimiter = ' '
  }

  let rs = map(value, (one, index) => {
    if (
      list.length &&
      Object.prototype.toString.call(list[0]) === '[object Array]'
    ) {
      return find(list[index], item => {
        return item.value === one
      })
    } else {
      return find(list, item => {
        return item.value === one
      })
    }
  })
  rs = rs.filter(one => {
    return typeof one !== 'undefined'
  })
  return map(rs, one => {
    return one.name
  })
    .join(delimiter)
    .replace('--', '')
}
