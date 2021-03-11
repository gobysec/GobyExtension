const fs = require('fs');
const os = require('os');

function activate (content) {
    let config = goby.getConfiguration();
    let identical = {
        "web": true,
        "http": true,
        "https": true
    };
    goby.registerCommand('vulmap_scan', function (content) {
        // vulmap.py 位置判断
        var VulmapPath = config["vulmap.py 位置"]["default"];
        if (fs.existsSync(VulmapPath)) {
            const lines = fs.readFileSync(VulmapPath).toString()
            if (lines.includes("vulmap")) {
                console.log("vulmap位置正确");
            } else {
                goby.showErrorMessage(`vulmap.py 位置有误: ${VulmapPath}`);
                return false;
            }
        } else {
            goby.showErrorMessage(`vulmap.py 位置有误: ${VulmapPath}`);
            return false;
        }
        // 获取各个参数
        let IP = content.ip;
        let Port = content.port;
        let targetUrl;
        // 判断协议头
        if (content.protocol == "https") {
            targetUrl = "https://" + content.hostinfo;
        } else {
            targetUrl = "http://" + content.hostinfo;
        }        
        // 指定扫描任务输出文件
        var taskResult = __dirname + "/result/" + goby.getTaskId() + "_" + IP + "_" + Port + ".txt";
        // goby.showInformationMessage(taskResult);
        // 判断扫描结果以及是否进行扫描
        if (fs.existsSync(taskResult)) {
            const lines = fs.readFileSync(taskResult).toString()
            if (lines.includes("Scan completed and ended")) {
                if (lines.includes("[+]")) {
                    goby.showSuccessMessage(`vulmap 扫描完成并发现漏洞 !`);
                } else if (lines.includes("[?]")){
                    goby.showSuccessMessage(`vulmap 扫描完成并发现疑似漏洞 ?`);
                } else if (lines.includes("install -r requirements.txt")){
                    goby.showWarningMessage(`vulmap 的依赖还有问题,要先解决 ~`);
                } else {
                    goby.showSuccessMessage(`vulmap 扫描完成，但是没有发现漏洞 ~`);
                }
                goby.showIframeDia(taskResult, "vulmap scan result", "900", "520");
            } else if (lines.includes("Survival check failed")){
                if (lines.includes("[+]")) {
                    goby.showSuccessMessage(`vulmap 扫描完成并发现漏洞 !`);
                } else if (lines.includes("[?]")){
                    goby.showSuccessMessage(`vulmap 扫描完成并发现疑似漏洞 ?`);
                } else if (lines.includes("install -r requirements.txt")){
                    goby.showWarningMessage(`vulmap 的依赖还有问题,要先解决 ~`);
                } else {
                    goby.showSuccessMessage(`vulmap 扫描完成，但是没有发现漏洞 ~`);
                }
                goby.showIframeDia(taskResult, "vulmap scan result", "900", "520");
            } else {
                goby.showWarningMessage(`正在扫描: ${targetUrl} 还没扫完, 请稍等再打开~`);
                goby.showIframeDia(taskResult, "vulmap scan result", "900", "520");
            }
        } else {
            goby.showInformationMessage(`运行 vulmap 扫描目标: ${targetUrl}`);
            // 此时开启vulmap扫描
            runScanner(targetUrl,taskResult);
        }
    });

    function runScanner(targetUrl,taskResult){
        var cp = require('child_process');
        var command  = config["python3 命令或位置"]["default"] + " " + config["vulmap.py 位置"]["default"] + " -u " + targetUrl + " > " + taskResult;
        // goby.showInformationMessage(command);
        cp.exec(command, (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error) {
                console.error(`扫描命令错误: ${error}`);
                goby.showErrorMessage(`扫描命令错误: ${error}`);
                return;
            } else {
                console.log(command)
                goby.showInformationMessage(`任务创建成功: ${taskID},请稍等片刻再次点击查看结果`);
            }
        })
    }
    goby.registerCommand('VulmapCheck', function (content) {
        if (identical[content.protocol]) return true;
        return false;
    });

}



exports.activate = activate;
