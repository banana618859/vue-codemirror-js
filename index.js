/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2019-10-14 23:12:13
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2019-12-14 11:24:34
 */
var CodeMirror = require('codemirror/lib/codemirror.js')
var CmComponent = require('./codemirror.vue')
var CmComponentCmd = require('./codemirrorCmd.vue')

CmComponent = CmComponent.default || CmComponent
CmComponentCmd = CmComponentCmd.default || CmComponentCmd

module.exports = {
  CodeMirror: CodeMirror,
  codemirror: CmComponent,
  codemirror: CmComponentCmd,
  install: function (Vue) {
    Vue.component('codemirror', CmComponent)
    Vue.component('codemirrorcmd', CmComponentCmd)
  }
}
