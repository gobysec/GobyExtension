const dns = require('dns');
const AUTHMETHODS = { //只支持这两种方法认证
    NOAUTH: 0,
    USERPASS: 2
}

function autherHandler(data) {
    let sock = this.sock,
        connect = this.connect
    console.log('autherHandler ', data);
    const VERSION = parseInt(data[0], 10);
    if (VERSION !== 5) { //不支持其他版本socks协议
        sock.destoryed || sock.destory();
        return false;
    }
    const methodBuf = data.slice(2); //方法列表

    let methods = [];
    for (let i = 0; i < methodBuf.length; i++)
        methods.push(methodBuf[i]);
    //先判断账号密码方式
    let kind = methods.find(method => method === AUTHMETHODS.USERPASS);
    if (kind) {
        let buf = Buffer.from([VERSION, AUTHMETHODS.USERPASS]);
        sock.write(buf);
        sock.once('data', passwdHandler.bind({
            sock,
            connect
        }));
    } else {
        kind = methods.find(method => method === AUTHMETHODS.NOAUTH);
        if (kind === 0) {
            let buf = Buffer.from([VERSION, AUTHMETHODS.NOAUTH]);
            sock.write(buf);
            sock.once('data', requestHandler.bind({
                sock,
                connect
            }));
        } else {
            let buf = Buffer.from([VERSION, 0xff]);
            sock.write(buf);
            return false;
        }
    }

}

/**
 * 认证账号密码
 */
let passwdHandler = function (data) {
    let sock = this.sock, connect = this.connect;
    console.log('data ', data);
    let ulen = parseInt(data[1], 10);
    let username = data.slice(2, 2 + ulen).toString('utf8');
    let password = data.slice(3 + ulen).toString('utf8');
    if (username === 'admin' && password === '123456') {
        sock.write(Buffer.from([5, 0]));
    } else {
        sock.write(Buffer.from([5, 1]));
        return false;
    }
    sock.once('data', requestHandler.bind({sock, connect}));
}

/**
 * 处理客户端请求
 */
let requestHandler = function (data) {
    let sock = this.sock, connect = this.connect;
    const VERSION = data[0];
    let cmd = data[1]; // 0x01 先支持 CONNECT连接
    if (cmd !== 1)
        console.error('不支持其他连接 %d', cmd);
    let flag = VERSION === 5 && cmd < 4 && data[2] === 0;
    if (!flag)
        return false;
    let atyp = data[3];
    let host,
        port = data.slice(data.length - 2).readInt16BE(0);
    let copyBuf = Buffer.allocUnsafe(data.length);
    data.copy(copyBuf);
    if (atyp === 1) { //使用ip 连接
        host = hostname(data.slice(4, 8));
        //开始连接主机！
        connect(host, port, copyBuf, sock);

    } else if (atyp === 3) { //使用域名
        let len = parseInt(data[4], 10);
        host = data.slice(5, 5 + len).toString('utf8');
        if (!domainVerify(host)) {
            console.log('domain is fialure %s ', host);
            return false;
        }
        console.log('host %s', host);
        dns.lookup(host, (err, ip, version) => {
            if (err) {
                console.log(err)
                return;
            }
            connect(ip, port, copyBuf, sock);
        });

    }
}

let hostname = function (buf) {
    let hostName = '';
    if (buf.length === 4) {
        for (let i = 0; i < buf.length; i++) {
            hostName += parseInt(buf[i], 10);
            if (i !== 3)
                hostName += '.';
        }
    } else if (buf.length === 16) {
        for (let i = 0; i < 16; i += 2) {
            let part = buf.slice(i, i + 2).readUInt16BE(0).toString(16);
            hostName += part;
            if (i !== 14)
                hostName += ':';
        }
    }
    return hostName;
}

/**
 * 校验域名是否合法
 */
let domainVerify = function (host) {
    let regex = new RegExp(/^([a-zA-Z0-9|\-|_]+\.)?[a-zA-Z0-9|\-|_]+\.[a-zA-Z0-9|\-|_]+(\.[a-zA-Z0-9|\-|_]+)*$/);
    return regex.test(host);
}

module.exports = {autherHandler}
