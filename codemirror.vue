<!--
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2019-10-14 23:12:13
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2019-12-17 11:33:39
 -->
<template>
  <div class="vue-codemirror-wrap">
    <textarea></textarea>
  </div>
</template>

<script>
  var CodeMirror = require('codemirror/lib/codemirror.js')
  require('codemirror/lib/codemirror.css')
  export default {
    props: {
      value: {
        type: String,
        default: ''
      },
      options: {
        type: Object,
        default: function () {
          return {
            mode: 'text/javascript',
            lineNumbers: true,
            lineWrapping: true
          }
        }
      },
    },
    data: function () {
      return {
        skipNextChangeEvent: false
      }
    },
    ready: function () {
      console.log('--ready--')
      var _this = this
      this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
      this.editor.setValue(this.value)
    },
    mounted: function (e) {
      console.log('--mounted--')
      // onCursorActivity={e => e.showHint()/*调用显示提示*/}
      var _this = this
      this.editor = CodeMirror.fromTextArea(this.$el.querySelector('textarea'), this.options)
      this.editor.setValue(this.value)

      this.editor.on('cursorActivity', function(e){
        console.log('00cursorActivity');
        if (!!_this.$emit) {
          _this.$emit('cursor-active',e)
        }
      })
      
      this.editor.on('change', function(cm) {
        console.log('change')
        //console.log('this.editor.on-change');
        // cm.showHint()
        if (_this.skipNextChangeEvent) {
          _this.skipNextChangeEvent = false
          return
        }
        if (!!_this.$emit) {
          // _this.$emit('change', cm.getValue())
          //_this.$emit('input', cm.getValue())
        }
      })
    },
    watch: {
      'value': function (newVal, oldVal) {
        var editorValue = this.editor.getValue()
        if (newVal !== editorValue) {
          this.skipNextChangeEvent = true
          var scrollInfo = this.editor.getScrollInfo()
          this.editor.setValue(newVal)
          this.editor.scrollTo(scrollInfo.left, scrollInfo.top)
        }
      },
      'options': function (newOptions, oldVal) {
        if (typeof newOptions === 'object') {
          for (var optionName in newOptions) {
            if (newOptions.hasOwnProperty(optionName)) {
              this.editor.setOption(optionName, newOptions[optionName])
            }
          }
        }
      }
    },
    beforeDestroy: function () {
      if (this.editor) {
        this.editor.toTextArea()
      }
    }
  }
</script>

<style>
  .CodeMirror-code {
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  }
</style>
