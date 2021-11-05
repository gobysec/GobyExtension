function ReplaceClassStrVar(byteCls, oldVar, newVar) {
    let code = Buffer.from(byteCls, 'base64');//解码
    let baseHexCode = code.toString('hex');//转为16进制
    let oldLength = decimalToHex(oldVar.length, 4)
    let hexoldvar = oldLength + Buffer.from(oldVar).toString('hex');//转为16进制
    let oldpos = baseHexCode.indexOf(hexoldvar);
    if (oldpos > -1) {//判断字节码中是否包含目标字符串
        let newlength = decimalToHex(newVar.length, 4);//计算新字符串长度
        let hexNewVar = newlength + Buffer.from(newVar).toString('hex')
        let retcode = baseHexCode.slice(0, oldpos) + (baseHexCode.slice(oldpos)).replace(new RegExp(hexoldvar), hexNewVar)

        return Buffer.from(retcode, 'hex').toString('base64');
    }
    return byteCls;
}

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
        hex = "0" + hex;//小于padding长度就填充0
    }
    return hex;
}

module.exports = ReplaceClassStrVar
