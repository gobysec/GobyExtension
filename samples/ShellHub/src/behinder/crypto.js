const crypto = require('crypto');


function decrypt(bs, key, encryptType, types) {
    let result
    if (types === "jsp") {
        result = decryptForJava(bs, key)
    } else if (types === "php") {
        result = decryptForPhp(bs, key, encryptType)
    } else if (types === "aspx") {
        result = decryptForCSharp(bs, key)
    } else if (types === "asp") {
        result = decryptForAsp(bs, key)
    }

    return result
}

function encryptForJava(bs, key) {
    return encryption_ecb(bs, key)
}

function decryptForJava(ct, key) {
    return decryption_ecb(ct, key)
}

function encryptForPhp(pt, key, encryptType) {
    let encrypted;
    if (encryptType === 0) {
        let iv = Buffer.from("00000000000000000000000000000000", 'hex')
        encrypted = encryption_cbc(pt, key, iv)
    } else if (encryptType === 1) {
        encrypted = encryptForAsp(pt, key)
        encrypted = Buffer.from(encrypted).toString('base64')
    }
    return encrypted
}

function decryptForPhp(pt, key, encryptType) {
    let decrypted;
    if (encryptType === 0) {
        let str = Buffer.from(pt.toString(), 'base64')
        let iv = Buffer.from("00000000000000000000000000000000", 'hex')
        decrypted = decryption_cbc(str, key, iv)
    } else if (encryptType === 1) {
        decrypted = decryptForAsp(pt, key)
    }
    return decrypted
}


function encryptForCSharp(bs, key) {
    return encryption_cbc(bs, key, key)
}

function decryptForCSharp(bs, key) {
    return decryption_cbc(bs, key, key)
}

function encryptForAsp(bs, key) {
    let message = '';
    for (let i = 0; i < bs.length; i++) {
        message += String.fromCharCode(bs.charCodeAt(i) ^ key.charCodeAt((i + 1) & 15));
    }
    return message
}

function decryptForAsp(bs, key) {
    for (let i = 0; i < bs.length; i++) {
        bs[i] = bs[i] ^ key.charCodeAt((i + 1) & 15)
    }
    return bs
}

function encryption_cbc(data, key, iv) {
    let cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let crypted = cipher.update(data, 'utf8', 'binary');
    crypted += cipher.final('binary');
    crypted = Buffer.from(crypted, 'binary').toString('base64');
    return crypted;
}

function decryption_cbc(data, key, iv) {
    try {
        let crypted = Buffer.from(data, 'base64').toString('binary');
        let decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    } catch (e) {
        console.log(e)
    }

}


//data 是准备加密的字符串,key是你的密钥
function encryption_ecb(data, key) {
    // console.log("encryption data: " + data);
    let iv = "";
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    let cipherChunks = [];
    let cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);

    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));

    return cipherChunks.join('');
}

//data 是你的准备解密的字符串,key是你的密钥
function decryption_ecb(data, key) {
    // console.log("decryption data: " + data);
    let iv = "";
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    let cipherChunks = [];
    let decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);

    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));

    return cipherChunks.join('');
}

// let bs = "mAUYLzmqn5QPDkyI5lvSp0fjiBu1e7047YjfczwY6j66BpxifC8q9IFABHsNteaxopOXw6wJ922dOjwSdSyD6fK9RaEzhi9CDSYsDqza2OUKan3nrS7ixTrgmuO0IPRv2cEeTXcKHa5LzhthZG7PYUMkc4ptXQQihVYMy1YD7li6lsZTfUuljdkn7Kw5Uveg2fklO9yb5RQmEBftpCeBm+v1t34xdWbC3u0zEb1feoXy/8OzHi8+83tStY7fjRVm"
// let xx = decryptForPhp(bs, "e45e329feb5d925b", 0)
// console.log(xx)
module.exports = {
    decrypt,
    encryptForJava,
    decryptForJava,
    encryptForPhp,
    decryptForPhp,
    encryptForCSharp,
    decryptForCSharp,
    encryptForAsp,
    decryptForAsp,
}
