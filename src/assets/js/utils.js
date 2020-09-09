export function getCookie(cname) {
  var name = cname + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim()
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length)
  }
  return ''
}

/**
 * @description 在数组中找指定的元素,返回下标index值
 * @export arr 数组
 * @export num 执行元素
 * @returns 返回下标值
 */
export function arrFinNum(arr, num) {
  let index = -1
  for (let i = 0; i < arr.length; i++) {
    if (num === arr[i]) {
      index = i
      break
    }
  }
  return index
}

/**
 * @description 删除数组中的元素
 * @export arr 数组
 * @export val 需要删除的元素
 * @returns 返回删除的元素
 */
export function delArrNum(arr, val) {
  let index = arrFinNum(arr, val) // 调用了前面自行添加的arrFinNum方法
  if (index !== -1) {
    return arr.splice(index, 1)
  }
}

/*
 * 各种组合计算运费金额的方法
 * @Author: fanaoxue
 * @Date: 2018-12-03 10:06:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-03-22 14:35:32
 */
export function divide(arg1, arg2) {
  var t1 = 0
  var t2 = 0
  var r1, r2
  try {
    t1 = arg1.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) { }
  try {
    t2 = arg2.toString().split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) { }

  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

export function multiply(arg1, arg2) {
  var m = 0
  var s1 = arg1.toString()
  var s2 = arg2.toString()
  try {
    m += s1.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) { }
  try {
    m += s2.split('.')[1].length
    // eslint-disable-next-line no-empty
  } catch (e) { }
  return (
    (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
    Math.pow(10, m)
  )
}

export function subtract(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  // last modify by deeka
  // 动态控制精度长度
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

export function add(arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

export function round2places(arg) {
  return parseFloat(arg).toFixed(2)
}

//自定义去前后空格的方法
export function trim(i) {
  return i.toString().replace(/\s/g, '')
}

//非空验证通用方法
export function isEmptyStr(str) {
  var pat = /^[\s]*$/
  if (undefined == str || '' == str || null == str || pat.test(str)) {
    return true
  }
  return false
}

// 过滤对象值为 null 或 undefined的情况
export function resolveObj(obj) {
  for (var key in obj) {
    if (obj[key] == '' || obj[key] == null || obj[key] == undefined) {
      obj[key] = ''
    }
  }
  return obj
}

/**
 * 格式化时间戳
 * @param {传入的值} val 
 * @param {返回的格式是否要求带秒} s
 * 
 * */
export function getTimeFormat(val, s) {
  let xian = '-'
  let dian = ':'
  let year = val.getFullYear()
  let month = val.getMonth() + 1
  let day = val.getDate()
  let hour = val.getHours()
  let minute = val.getMinutes()
  let second = val.getSeconds()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  if (hour < 10) {
    hour = '0' + hour
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  if (s) {
    return year + xian + month + xian + day + ' ' + hour + dian + minute + dian + second
  } else {
    return year + xian + month + xian + day + ' ' + hour + dian + minute
  }
}
