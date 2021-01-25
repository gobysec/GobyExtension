function activate (content) {
    let path = require('path');
    let request = require('request');
    let protocol = ['http','https','web'];
    class awvs {
        constructor(){
            this.request = require('request');
            // this.sha256 = require('sha256');
            this.fs = require('fs');
            this.path = require('path');
            this.version = require(this.path.join(__dirname,'../','package.json')).version;
            this.api='';
            this.headers={
                "X-Auth": "1986ad8c0a5b3df4d7028d5f3c06e936c68bbaae1815044cb9e3d0fbbf28cfda8",
                "content-type": "application/json",
                "User-Agent":navigator.userAgent
            }
        }
        checkDir(dirname){
            return  this.fs.existsSync(dirname);
        }
        getMe(){
            this.request({
                method:'get',
                url:`${this.api}/api/v1/me`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response,body)=>{
                if(error){
                    console.log(error);
                    return;
                }
                console.log(body);
            })
        }
        login({email,password}){//登录接口
            return;//暂时不做登录
            this.request({
                method:'post',
                url:`${this.api}/api/v1/me/login`,
                headers:this.headers,
                strictSSL:false,
                json:true,
                body:{
                    email,
                    password:this.sha256(password),
                    remember_me:true,
                    logout_previous:true
                }
            },(error,response,body)=>{
                if(error){
                    console.log(error);
                    return;
                }
                console.log(response);
                console.log(body);
            })
        }
        logout(){//退出接口
            this.request({
                method:'post',
                url:`${this.api}/api/v1/me/logout`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response,body)=>{
                if(error){
                    console.log(error);
                    return;
                }
                console.log(response);
                console.log(body);
            })
        }
        addTarget({address,criticality,description,callback}){
            this.request({
                method:'post',
                url:`${this.api}/api/v1/targets`,
                headers:this.headers,
                strictSSL:false,
                json:true,
                body:{address,criticality,description}
            },(error,response, body)=>{
                if(error){
                    goby.showInformationMessage('添加目标失败');
                    return;
                }
                switch (body.code) {
                    case 401:
                        goby.showInformationMessage('Invalid Login Credentials');
                        break;
                    case 521:
                        console.log('已登录');
                        break;
                    default:
                        if(callback){
                            callback(body);
                        } 
                        break;
                }
            })
        }
        addScan({target_id,profile_id,schedule,callback}){
            this.request({
                method:'post',
                url:`${this.api}/api/v1/scans`,
                headers:this.headers,
                strictSSL:false,
                json:true,
                body:{
                    target_id,
                    profile_id,
                    schedule,
                    report_template_id:'11111111-1111-1111-1111-111111111111'
                }
            },(error,response, body)=>{
                if(error){
                    goby.showInformationMessage('添加扫描失败');
                    return;
                }
                if(callback){
                    callback(body);
                }
            })
        }
        getOneTargetInfo({target_id,callback}){//获取目标信息
            this.request({
                method:'get',
                url:`${this.api}/api/v1/scans?q=target_id:${target_id}`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response,body)=>{
                if(error){
                    goby.showInformationMessage('获取目标信息失败');
                    return;
                }
                if(callback){
                    callback(body.scans.length>0?body.scans[0]:'')
                }
            })
        }
        getOneScanInfo({scan_id,scan_session_id,callback}){//获取单个扫描目标信息
            this.request({
                method:'get',
                url:`${this.api}/api/v1/scans/${scan_id}/results/${scan_session_id}/statistics`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response, body)=>{
                if(error){
                    goby.showInformationMessage('获取扫描信息失败');
                    return;
                }
                if(callback){
                    callback(body)
                }
            })
        }
        getAllScanInfo({callback}){
            this.request({
                method:'get',
                url:`${this.api}/api/v1/scans`,
                headers:this.headers,
                strictSSL:false,
                json:true,
            },(error,response, body)=>{
                if(error){
                    console.log(error);
                    console.log(body);
                    goby.showInformationMessage('获取扫描信息失败');
                    return;
                }
                if(!this.checkDir(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')){
                    callback([]);
                    return;
                }
                require.cache[require.resolve(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')];
                let data = Object.values(require(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')).map(v=>v.target_id);
                
                callback(body.scans.filter((v,k)=>{
                    return data.includes(v.target_id);
                }))
            })
        }
        deleteScan({scan_id,callback}){
            this.request({
                method:'delete',
                url:`${this.api}/api/v1/scans/${scan_id}`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response, body)=>{
                if(error){
                    // goby.showInformationMessage('删除任务失败');
                    return;
                }
                if(callback){
                    callback(body);
                }
            })
        }
        generateReports({template_id,id_list,callback}){//生成报告
            this.request({
                method:'post',
                url:`${this.api}/api/v1/reports`,
                headers:this.headers,
                strictSSL:false,
                json:true,
                body:{
                    template_id,
                    source:{
                        id_list,
                        list_type: "scans"
                    }
                }
            },(error,response,body)=>{
                if(error){
                    console.log(error);
                    return;
                }
                
                callback(body);
            })
        }
        getAllReports({callback}){
            this.request({
                method:'get',
                url:`${this.api}/api/v1/reports`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response,body)=>{
                if(error){
                    console.log('获取报告失败');
                    return;
                }
                if(callback){
                    callback(body);
                }
            })
        }
        addTargetScan(protocol,content){//不是awvs接口,是自定义的 根据传入的参数内容  调用addTarget和addScan
            this.addTarget({//添加目标
                "address":protocol+content.hostinfo,
                "criticality":10,
                "description":`Goby扫描任务${goby.getTaskId()}的${protocol}${content.hostinfo}`,
                callback:(res)=>{
                    if(!res.target_id){
                        goby.showInformationMessage('添加目标失败');
                        return;
                    }
                    this.addScan({//添加扫描
                        target_id:res.target_id,
                        profile_id:'11111111-1111-1111-1111-111111111111',
                        schedule:{
                            "disable":false,
                            "start_date":null,
                            "time_sensitive":false
                        },
                        callback:(result)=>{
                            if(!res.target_id){
                                goby.showInformationMessage('添加目标失败');
                                return;
                            }
                            goby.showInformationMessage('添加扫描目标成功');
                            this.getOneTargetInfo({target_id:res.target_id,callback:(res1)=>{//因为返回的数据没有scan_id,所以在获取scan_id
                                result['scan_id'] = res1['scan_id'];
                                if(!this.checkDir(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')){
                                    this.fs.writeFile(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json',JSON.stringify({
                                        [protocol+content.hostinfo+'|'+protocol+content.ip+':'+content.port]:result
                                    } , null, 6),(err)=>{console.log(err)});
                                }else{
                                    require.cache[require.resolve(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')]
                                    let data = require(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json');
                                    data[protocol+content.hostinfo+'|'+protocol+content.ip+':'+content.port] = result;
                                    this.fs.writeFile(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json',JSON.stringify(data,null,6),(err)=>{console.log(err)})
                                }
                            }})
                                
                        }
                    })
                }
            })
        }
        getReportTemplates({callback}){
            this.request({
                method:'get',
                url:`${this.api}/api/v1/report_templates`,
                headers:this.headers,
                strictSSL:false,
                json:true
            },(error,response,body)=>{
                if(error){
                    console.log('获取报告模版失败');
                    return;
                }
                if(callback){
                    callback(body);
                }
            })
        }
        mkdirsSync(dirname){
            if (this.fs.existsSync(dirname)) {  
                return true;  
            } else {  
                if (this.mkdirsSync(this.path.dirname(dirname))) {  
                    this.fs.mkdirSync(dirname);  
                    return true;  
                }  
            }
        }
    }
    if(window.awvs){
		let path = require('path');
		require.cache[require.resolve(path.join(__dirname,'../','package.json'))]
		if(compareVersion(window.awvs.version,require(path.join(__dirname,'../','package.json')).version)=='-1'){
			clearInterval(window.awvs.timed);
			delete window.awvs;
			window.awvs = new awvs();
		}
	}else{
		window.awvs = new awvs();
	}

    goby.registerCommand('awvs',function (content) {
        let protocol = content.port==443?'https://':'http://';
        let config = goby.getConfiguration();
        if(!config['API Key'].default.trim()){
            goby.showInformationMessage('请配置API Key');
            goby.showConfigurationDia();
            return;
        }
        if(!config['AWVS Web Address'].default.trim()){
            goby.showInformationMessage('请配置AWVS Web Address');
            goby.showConfigurationDia();
            return;
        }
        
        window.awvs.headers['X-Auth'] = config['API Key'].default;
        window.awvs.api = config['AWVS Web Address'].default.match(/^http(s|):\/\/\S*?\// )[0];
        if(!window.awvs.checkDir(__dirname+'/awvsData/'+goby.getTaskId())){
            window.awvs.mkdirsSync(__dirname+'/awvsData/'+goby.getTaskId());
        }
        if(window.awvs.checkDir(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')){
            require.cache[require.resolve(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json')]
            let data = require(__dirname+'/awvsData/'+goby.getTaskId()+'/data.json');
            if(data[protocol+content.hostinfo+'|'+protocol+content.ip+':'+content.port]){
                window.awvs.getOneTargetInfo({target_id:data[protocol+content.hostinfo+'|'+protocol+content.ip+':'+content.port]['target_id'],callback:(res)=>{
                    if(!res){
                        window.awvs.addTargetScan(protocol,content);
                    }else{
                        window.awvs.getOneScanInfo({scan_id:res.scan_id,scan_session_id:res.current_session.scan_session_id,callback:(result)=>{
                            if(result.status=='failed'){
                                window.awvs.deleteScan({
                                    scan_id:res.scan_id,
                                    callback:(con)=>{
                                        console.log(con);
                                    }
                                })
                                window.awvs.addTargetScan(protocol,content);
                                return;
                            }
                            if(result.scanning_app.wvs.main){
                                goby.showInformationMessage('当前进度'+result.scanning_app.wvs.main.progress+'%');
                                
                            }else{
                                goby.showInformationMessage('请稍后在尝试');
                            }
                        }})
                    }
                }})
                return;
            }else{
                window.awvs.addTargetScan(protocol,content);
            }
        }else{
            window.awvs.addTargetScan(protocol,content);
        }
        
            
        // goby.showIframeDia(path.join(__dirname,`assets/index.html?url=${__dirname}`),'awvs','600','500');
    });
    goby.registerCommand('showData',function(content){
        let taskId = goby.getTaskId();
        if(!taskId){
            goby.showInformationMessage('目前goby没有任务');
            return;
        }
        let config = goby.getConfiguration();
        if(!config['API Key'].default.trim()){
            goby.showInformationMessage('请配置API Key');
            goby.showConfigurationDia();
            return;
        }
        if(!config['AWVS Web Address'].default.trim()){
            goby.showInformationMessage('请配置AWVS Web Address');
            goby.showConfigurationDia();
            return;
        }
        window.awvs.headers['X-Auth'] = config['API Key'].default;
        window.awvs.api = config['AWVS Web Address'].default.match(/^http(s|):\/\/\S*?\// )[0];
        let path = require('path');
        goby.showIframeDia(path.join(__dirname, 'assets/index.html'), "awvs", "900", "500");
    })
    goby.registerCommand('isShow',function(content){
        if(protocol.includes(content.protocol)) return true;
        return false;
    })
    function compareVersion(v1,v2){
		if(!v1 || !v2){
			return -1;
		}
		v1 = v1.split('.')
		v2 = v2.split('.')
		const len = Math.max(v1.length, v2.length)
		
		while (v1.length < len) {
			v1.push('0')
		}
		while (v2.length < len) {
			v2.push('0')
		}
		
		for (let i = 0; i < len; i++) {
			const num1 = parseInt(v1[i])
			const num2 = parseInt(v2[i])
		
			if (num1 > num2) {
			
			return 1
			} else if (num1 < num2) {
			
			return -1
			}
		}
		
		return 0
	}
}

exports.activate = activate;