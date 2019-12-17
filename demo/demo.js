/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2019-10-14 23:12:13
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2019-12-14 22:41:07
 */
var Vue = require('vue')
var VueCodeMirror = require('../index');

// yizheng-add-2019.12.12 代码解析分词 ast抽象语法树
var { getSonKey } = require('./js/parse.js');

// yizheng-add-cmd-2019.12.14 代码解析分词 ast抽象语法树
var { getCmdKey } = require('./js/parseCmd.js');

Vue.use(VueCodeMirror)

var codes = {
  javascript: 'var obj = {\n\tname: "vue-codemirror-lite",\n\tauthor: "Fangxw",\n\trepo: "https://github.com/cnu4/vue-codemirror-lite"\n}\n\n//Press Ctrl-Space to trigger hint',
  vue: '<template>\n<codemirror :value="code"></codemirror>\n</template>\n\n<script>\nimport { codemirror } from "vue-codemirror-lite"\nexport default {\n\tdata () {\n\t\treturn {\n\t\t\tcode: "const str = \"hello world\""\n\t\t}\n\t},\n\tcomponents: {\n\t\tcodemirror\n\t}\n}\n</script>'
}

// require htmlmixed mode
require('codemirror/mode/vue/vue.js')
require('codemirror/mode/javascript/javascript.js')

// require hint addon for javacript
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')

// require theme 
require('codemirror/theme/yeti.css')
require('codemirror/theme/3024-night.css')

var app = new Vue({
  el: '#app',
  data: function () {
    return {
      mode: 'javascript'
    }
  },
  computed: {
    code: function () {
      return codes[this.mode]
    },
    cmdcode: function () {
      return 'node abc.js'
    },
    options: function () {
      return {
        mode: this.mode,
        tabSize: 2,
        lineNumbers: true,
        lineWrapping: true,
        extraKeys: { 'Ctrl-H': 'autocomplete' }
      }
    }
  },
  methods: {
    change: function (code) {
      console.log('118888change', code);
      // this.showHint()
    },
    // cmdChange
    cmdChangeFun: function (code) {
      console.log('99cmdChange', code);
      // this.showHint()
    },
    // codeEditor change
    async cursorFun(cm) {
      var line = cm.getCursor().line;
      console.log('454cursorActivity', cm, cm.getValue());
      console.log('--line-code:', cm.getLine(line).split(' '))
      var currentWord = cm.getLine(line).split(' ').pop();
      console.log('###currentWord:', currentWord, currentWord.split('').pop());

      var code = cm.getValue();
      code = code.slice(0, code.length - 1)
      var obj = currentWord.slice(0, currentWord.length - 1);
      var point = currentWord.slice(currentWord.length - 1);
      // 默认设置一个属性
      cm.nowObj = [];

      console.log('---分解---', obj, ' ppp ', point);
      if (point == '.') {
        console.log('---对象提示---')
        try {
          // var rel = await getSonKey(code,'component');
          var rel = await getSonKey(code, obj);
          console.log('--44rel:', rel)
          // cm.ukeys = tips
          if (typeof rel == 'object' && rel.length > 0) {
            cm.nowObj = rel;
          } else {
            cm.nowObj = [];
          }
        } catch (error) {
          console.log('--err:', error)
        }
      }

      // 自定义关键词
      cm.ukeys = ['yizheng', 'tom'];
      // 传入对象
      console.log('---end---');
      var user = {
        name: 'tommy',
        arr: [1, 2, 3]
      }
      cm.showHint();
    },
    // cmdEditor change
    async cursorCmdFun(cm) {
      try {


        var line = cm.getCursor().line;
        if (!line) {
          return;
        }
        console.log('777cursorActivity', cm, cm.getValue());
        console.log('--line-code:', cm.getLine(line).split(' '))
        var currentWord = cm.getLine(line).split(' ').pop();
        if (!currentWord) {
          return
        }
        console.log('###currentWord:', currentWord, currentWord.split('').pop());

        var code = cm.getValue();
        if (!code) {
          return
        }
        code = code.slice(0, code.length - 1)
        var obj = currentWord.slice(0, currentWord.length - 1);
        var point = currentWord.slice(currentWord.length - 1);
        // 默认设置一个属性
        cm.nowObj = [];

        console.log('---分解---', obj, ' ppp ', point);
        if (point == '.') {
          console.log('---对象提示---')

          // var rel = await getSonKey(code,'component');
          var rel = await getCmdKey(code, obj);
          console.log('--44rel:', rel)
          // cm.ukeys = tips
          if (typeof rel == 'object' && rel.length > 0) {
            cm.nowObj = rel;
          } else {
            cm.nowObj = [];
          }

        }

        // 自定义关键词
        cm.ukeys = ['yizheng', 'tom'];
        // 传入对象
        console.log('---end---');
        var user = {
          name: 'tommy',
          arr: [1, 2, 3]
        }
        cm.showHint();

      } catch (error) {
        console.log('--err:', error)
      }
    }
  }
})