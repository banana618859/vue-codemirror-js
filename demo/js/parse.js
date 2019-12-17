/*
 * @Descripttion: 
 * @Author: yizheng.yuan
 * @Date: 2019-12-12 09:01:58
 * @LastEditors: yizheng.yuan
 * @LastEditTime: 2019-12-14 21:22:21
 */
var recast = require('recast');
var str0 = "var user={name:'tom',age:10};";
var str1 = "var user={name:'tom',age:10};var a=87;function add(a,b){return a+b;}";
function getSonKey(str, Keyword) {
    return new Promise((resolve,reject)=> {
        console.log('-tttyyystr:', str)
        console.log('###keyword:',Keyword)
        var rel = recast.parse(str);
        console.log('-rel:',rel)
        var body0 = rel.program.body[0];
        console.log('-body22:', body0);
        // return;
        var tokens = body0.declarations[0].id.loc.tokens;
        var allObjIndex = [];

        // 截取所有的对象obj
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i].type == 'Punctuator' && (tokens[i].value == '{' || tokens[i].value == '}')) {
                allObjIndex.push(i)
            }
        }
        console.log('--index:', allObjIndex);
        var objLeftIndex = [];
        var funLeftIndex = [];
        allObjIndex.forEach((item, index) => {
            if (index % 2 == 0) {
                let indx = item - 3;
                let value = tokens[indx].value;
                // objLeftIndex.push(item)
                if (value == 'var' || value == 'let' || value == 'const') {
                    objLeftIndex.push(item)
                } else {
                    funLeftIndex.push(item)
                }
            }
        })
        // console.log('--index:',objLeftIndex);
        // 截取对象字段
        let objSegmentArr = []
        for (let i = 0; i < objLeftIndex.length; i++) {
            let theIndex = allObjIndex.indexOf(objLeftIndex[i]);
            if (theIndex != -1) {
                let newArr = [];
                newArr.push(allObjIndex[theIndex], allObjIndex[theIndex + 1])
                objSegmentArr.push(newArr)
            }
        }
        // console.log('objSegmentArr:',objSegmentArr)
        // 提取对象的属性
        let objSon = [];

        for (let i = 0; i < objSegmentArr.length; i++) {
            let firstOne = objSegmentArr[i][0]
            console.log('--firstOne:', firstOne)
            let objName = tokens[firstOne - 2].value;
            console.log('--objName:', objName)
            let sonArr = [];
            for (let z = objSegmentArr[i][0]; z < objSegmentArr[i][1]; z++) {

                // let value = objSegmentArr[i][z];
                if (tokens[z].type != 'Punctuator') {
                    sonArr.push(tokens[z].value)
                }
            }
            var newObj = {
                name: objName,
                property: sonArr
            }
            objSon.push(newObj);
        }

        // console.log('final-obj',objSon);
        //将字符串转为对象
        for (let i = 0; i < objSon.length; i++) {
            let newObj = {}
            for (let s = 0; s < objSon[i].property.length; s++) {
                let key = objSon[i].property[s]
                if (s % 2 == 0) {
                    newObj[key] = objSon[i].property[s + 1]
                }
            }
            objSon[i].property = newObj;
        }
        console.log('final-obj2', objSon);
        
        let hasResult = -1;
        let result;
        for (let i = 0; i < objSon.length; i++) {
            if (objSon[i].name == Keyword) {
                hasResult = i;
                // result = objSon
                result = Object.keys(objSon[i].property);
            }
        }
        if (hasResult == -1) {
            resolve('no result');
            //return 'no result'
        } else {
            resolve(result);
            //return result;
        }
    })
    
}


module.exports.getSonKey = getSonKey;
