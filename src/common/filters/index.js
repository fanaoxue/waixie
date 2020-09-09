// 手机号格式化(182****9256)
const formatPhone = value => {
  if (!value) return '';
  value = value.toString();
  return value.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');
};

// 4位一空格（格式化银行卡0000 0000 0000 0000 000）
const formatBank = val => {
  if (val) {
    return val
      .toString()
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ');
  }
};

// 卡号转化成字符串
const cardToNum = val => {
  return val.replace(/\s/gi, '');
};

/**
 * 格式化小数位
 * @param val 传入的值
 * @param pos 保留的小数位
 * @returns {*}
 */
const formatFloat = (val, pos = 2) => {
  let f = parseFloat(val);
  if (isNaN(f)) {
    return false;
  }
  f = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + pos) {
    s += '0';
  }
  return s;
};

/**
 * @description 加密身份证号（保留前三后二）
 * @export
 * @param {*} idCard
 * @returns
 */
const encryptIdCardForTrading = idCard => {
  if (!idCard) {
    return '';
  }
  let front = idCard.substr(0, 3);
  let middle = '';
  for (let i = 3; i < idCard.length - 2; i++) {
    middle += '*';
  }
  let end = idCard.substr(-2);
  let result = front + middle + end;
  return result;
};

/**
 * @description 时间格式化，默认：Y-m-d
 * @export timestamp 时间戳（毫秒级）
 * @export formats 时间格式
 *  1. Y-m-d
 * 2. Y-m-d H:i:s
 * 3. Y年m月d日
 * 4. Y年m月d日 H时i分
 * 5. Y-m
 * 6. Y年m月
 * @returns 返回指定时间格式
 */
export function dateFormat(timestamp, formats) {
  formats = formats || 'Y-m-d';
  let zero = function (value) {
    if (value < 10) {
      return '0' + value;
    }
    return value;
  };
  let myDate = timestamp ? new Date(timestamp) : new Date();
  let year = myDate.getFullYear();
  let month = zero(myDate.getMonth() + 1);
  let day = zero(myDate.getDate());
  let hour = zero(myDate.getHours());
  let minite = zero(myDate.getMinutes());
  let second = zero(myDate.getSeconds());

  return formats.replace(/Y|m|d|H|i|s/gi, function (matches) {
    return {
      Y: year,
      m: month,
      d: day,
      H: hour,
      i: minite,
      s: second,
    }[matches];
  });
}

// 卡号转化成字符串
const formatNumber = num => {
  if (num === undefined || num === '') return num;
  num = Number(num);
  num = String(num.toFixed(2));
  var re = /(-?\d+)(\d{3})/;
  num = num.replace(re, '$1,$2');
  return num;
};
// 获取当前时间 YYYY-MM-DD HH:MM:SS
export function getNow() {
  let value = new Date();
  let year = value.getFullYear();
  let month = value.getMonth() + 1;
  let day = value.getDate();
  let hour = value.getHours();
  let minute = value.getMinutes();
  let second = value.getSeconds();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  return (
    year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  );
}

// 过滤货物类型
export function typeFilter(item) {
  // 0-吨
  // 1-方
  // 2-件
  // 3-车
  let type = '';
  try {
    item = item.toString();
    // eslint-disable-next-line no-empty
  } catch (error) { }
  switch (item) {
    case '0':
      type = '吨';
      break;
    case '1':
      type = '方';
      break;
    case '2':
      type = '件';
      break;
    case '3':
      type = '车';
      break;
    default:
      type = '';
      break;
  }
  return type;
}
export default {
  formatPhone,
  formatBank,
  cardToNum,
  formatFloat,
  encrypt_idcard_trading: encryptIdCardForTrading,
  dateFormat,
  getNow,
  formatNumber,
  typeFilter,
};
