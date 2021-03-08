function activate (content) {
    goby.registerCommand('test',function(){
        const config = goby.getConfiguration();
        const email = config[' Email '].default,
            host = config[' Smtp '].default,
            port = config[' Port '].default,
            AuthCode =  config[' Auth Code '].default,
            Switch =  config[' Switch '].default;
        if(!Switch || Switch.trim().toLowerCase()!='on'){
            goby.showErrorMessage('SendMail没有开启，请在配置页面开启后在进行测试');
            return;
        }
        if(email){
            let reg  =/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if(!reg.test(email)){
                goby.showErrorMessage('请配置正确的邮箱地址');
                return;
            }
        }else{
            goby.showErrorMessage('请配置邮箱地址');
            return;
        }
        if(!AuthCode){
            goby.showErrorMessage('请配置邮箱的SMTP授权码');
            return;
        }
        if(!host){
            goby.showErrorMessage('请配置邮箱的SMTP服务器地址');
            return;
        }
        if(!port){
            goby.showErrorMessage('请配置邮箱的端口');
            return;
        }
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
        host: host,//smtp.qq.com
        port: port,//465
        auth: {
            user: email,
            pass: AuthCode //授权码
        }
        });
        
        var mailOptions = {
            from: email, // 发送者
            to: email, // 接受者,可以同时发送多个,以逗号隔开
            subject: `Goby SendMail`, // 标题
            //text: 'Hello world', // 文本
            html: `
                <div style="width: 630px;margin: 0 auto;background: #FFFFFF;box-shadow: 0px 3px 13px 0px rgba(71, 120, 199, 0.2);border-radius: 4px;">
                    <div style="height: 4px;background: #4778C7;border-radius: 4px;"></div>
                    <div style="padding: 0 40px;">
                        <img src="https://gobies.org/static_front/img/logo-goby.svg" style="display: block;width: 122px;height: auto;padding: 40px 0;">
                        <div style="font-size: 16px;color: #163366;line-height: 32px;margin-bottom: 10px;">Hello:</div>
                        <div style="font-size: 14px;color: #7586A6;line-height: 30px;">
                            恭喜您邮箱配置成功，可以前往Goby进行使用。
                        </div>
                    </div>
                    <div style="padding-bottom: 90px;text-decoration: none;"></div>
                    <div style="height: 35px;line-height: 35px;background: #F2F7FF;border-radius: 4px;padding: 0 40px;">
                        <span style="float: left;font-size: 12px;color: #7586A6;">©${new Date().getFullYear()} Goby</span>
                        <span style="float: right;height:35px;">
                            <a href="https://github.com/gobysec" target="_blank" style="float: left;margin-right: 9px;margin-top: 3px;" rel="noopener">
                                <img src="https://gobies.org/git-01.svg" style="max-height: 16px;width: auto; ">
                            </a>
                            <a href="https://twitter.com/goby77463399" target="_blank" style="float: left;margin-right: 9px;margin-top: 4px;" rel="noopener">
                                <img src="https://gobies.org/tter-01.svg" style="max-height: 17px;width: auto; ">
                            </a>
                            <a href="http://t.me/gobies" target="_blank" style="float: left;margin-right: 9px;margin-top: 3px;" rel="noopener">
                                <img src="https://gobies.org/telegram.svg" style="max-height: 16px;width: auto; ">
                            </a>
                            <a href="mailto:gobysec@gmail.com" target="_blank" style="float: left;margin-top: 3px;" rel="noopener">
                                <img src="https://gobies.org/gmail-01.svg" style="max-height: 16px;width: auto; ">
                            </a>
                        </span>
                    </div>
                </div>
            ` 
        };
        
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                goby.showErrorMessage(err);
            return;
            }
            goby.showSuccessMessage('恭喜您邮箱配置成功');
        })
    })
    goby.bindEvent('onEndScan',function(content){
        let {state,progress} = goby.getScanState();
        if(state!=2 || progress!=100) return;
        const config = goby.getConfiguration();
        const email = config[' Email '].default,
            host = config[' Smtp '].default,
            port = config[' Port '].default,
            AuthCode =  config[' Auth Code '].default,
            Switch =  config[' Switch '].default;
        if(Switch!='on') return;
        if(email){
            let reg  =/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if(!reg.test(email)){
                goby.showErrorMessage('请配置正确的邮箱地址');
                return;
            }
        }else{
            goby.showErrorMessage('请配置邮箱地址');
            return;
        }
        if(!AuthCode){
            goby.showErrorMessage('请配置邮箱的SMTP授权码');
            return;
        }
        if(!host){
            goby.showErrorMessage('请配置邮箱的SMTP服务器地址');
            return;
        }
        if(!port){
            goby.showErrorMessage('请配置邮箱的端口');
            return;
        }
        const Year = content.taskId.substr(0,4),
            Month = content.taskId.substr(4,2),
            Day = content.taskId.substr(6,2),
            Hour = content.taskId.substr(8,2),
            Minute = content.taskId.substr(10,2),
            Second = content.taskId.substr(12,2);
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
        host: host,//smtp.qq.com
        port: port,//465
        auth: {
            user: email,
            pass: AuthCode //授权码
        }
        });
        goby.getAsset(content.taskId,(res)=>{
            if(res.statusCode!=200){
                goby.showErrorMessage(res.messages);
                return;
            }
            MakeFile(res,content.taskId);
            var mailOptions = {
                from: email, // 发送者
                to: email, // 接受者,可以同时发送多个,以逗号隔开
                subject: `Goby 扫描任务结束提醒您`, // 标题
                //text: 'Hello world', // 文本
                html: `
                    <div style="width: 630px;margin: 0 auto;background: #FFFFFF;box-shadow: 0px 3px 13px 0px rgba(71, 120, 199, 0.2);border-radius: 4px;">
                        <div style="height: 4px;background: #4778C7;border-radius: 4px;"></div>
                        <div style="padding: 0 40px;">
                            <img src="https://gobies.org/static_front/img/logo-goby.svg" style="display: block;width: 122px;height: auto;padding: 40px 0;">
                            <div style="font-size: 16px;color: #163366;line-height: 32px;margin-bottom: 10px;">Hello:</div>
                            <div style="font-size: 14px;color: #7586A6;line-height: 30px;">
                                您于 ${Year}年${Month}月${Day}日${Hour}时${Minute}分 创建的 ${content.taskName || content.taskId} 任务已扫描完成，共计${res.data.total.assets}个资产，${res.data.total.vulnerabilities}个漏洞，请打开 Goby 客户端查看详细信息。
                            </div>
                        </div>
                        <div style="padding-bottom: 90px;text-decoration: none;"></div>
                        <div style="height: 35px;line-height: 35px;background: #F2F7FF;border-radius: 4px;padding: 0 40px;">
                            <span style="float: left;font-size: 12px;color: #7586A6;">©${new Date().getFullYear()} Goby</span>
                            <span style="float: right;">
                                <a href="https://github.com/gobysec" target="_blank" style="float: left;margin-right: 9px;margin-top: 3px;" rel="noopener">
                                    <img src="https://gobies.org/git-01.svg" style="max-height: 16px;width: auto;">
                                </a>
                                <a href="https://twitter.com/goby77463399" target="_blank" style="float: left;margin-right: 9px;margin-top: 4px;" rel="noopener">
                                    <img src="https://gobies.org/tter-01.svg" style="max-height: 17px;width: auto;">
                                </a>
                                <a href="http://t.me/gobies" target="_blank" style="float: left;margin-right: 9px;margin-top: 3px;" rel="noopener">
                                    <img src="https://gobies.org/telegram.svg" style="max-height: 16px;width: auto;">
                                </a>
                                <a href="mailto:gobysec@gmail.com" target="_blank" style="float: left;margin-top: 3px;" rel="noopener">
                                    <img src="https://gobies.org/gmail-01.svg" style="max-height: 16px;width: auto;">
                                </a>
                            </span>
                        </div>
                    </div>
                ` ,
                attachments:[
                    {
                        filename : content.taskId+'-asset.xlsx',
                        path: __dirname+'/file/'+content.taskId+'-asset.xlsx'
                    },
                    {
                        filename : content.taskId+'-vul.xlsx',
                        path: __dirname+'/file/'+content.taskId+'-vul.xlsx'
                    }
                ]
            };
            
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                    goby.showErrorMessage(err);
                return;
                }
                goby.showSuccessMessage('邮件发送成功');
            })
        })
            
    })
    function MakeFile(res,taskId){
        let xlsx = require('xlsx');
        let vul = require('./excelVulData')(res.data.ips);
        let vulSheet = xlsx.utils.aoa_to_sheet(vul);
        vulSheet['!cols'] = [
            {
                wpx: 180,
            },
            {
                wpx: 60,
            },
            {
                wpx: 120,
            },
            {
                wpx: 150,
            },
            {
                wpx: 120,
            }
        ];
        
        var vulBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(vulBook, vulSheet, "vulSheet");
        let filePath = __dirname + '/file/'+taskId;
        xlsx.writeFileSync(vulBook, filePath + "-vul.xlsx");


        let assets = require('./excelAssetData')(res.data.ips);
        var assetSheet = xlsx.utils.aoa_to_sheet(assets);
        var assetBook = xlsx.utils.book_new();
        assetSheet['!cols'] = [
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            },
            {
                wpx: 120,
            }
        ];
        xlsx.utils.book_append_sheet(assetBook, assetSheet, "assetSheet");
        // let filePath = __dirname + '/file/'+taskId;
        xlsx.writeFileSync(assetBook, filePath + "-asset.xlsx");
    }
}

exports.activate = activate;

