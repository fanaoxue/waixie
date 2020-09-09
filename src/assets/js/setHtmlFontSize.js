/*
 * @Author: we.zhanghui
 * @Date: 2019-12-25 15:26:15
 * @Last Modified by: we.zhanghui
 * @Last Modified time: 2019-12-25 15:26:38
 * 暂未使用到
 */
import { designSize } from '@/settings.js'

// 基准大小
const baseSize = 100

function setHtmlFontSize() {
  // const scale = document.documentElement.clientWidth / Config.designSize
  const scale = document.body.offsetWidth / designSize
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px'
}
// 初始化
setHtmlFontSize()
// 改变窗口大小时重新设置 fontSize
window.onresize = function() {
  setHtmlFontSize()
}
