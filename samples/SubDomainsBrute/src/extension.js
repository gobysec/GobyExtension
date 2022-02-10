function activate(content) {
	const path = require('path');
		var subDomainsBruteWindow = null;
		let remote = top.require('@electron/remote');
		const subDomainsBruteIpc = remote.ipcMain;
	goby.registerCommand('subDomainsBrute',  function () {
		// let path = __dirname + "/index.html?curDirname=" + __dirname;
		// goby.showIframeDia(path, "子域名爆破", "666", "500");
		// if(!newPage){
		// 	message();
		// }else{
		// 	if(!newPage.location){
				// message();
		// 	}
		// }

		if(subDomainsBruteWindow) return;
		const { BrowserWindow } = top.require('@electron/remote');
		subDomainsBruteWindow = new BrowserWindow({
			width:666,
			height:520,
			resizable:false,
			title          : "subDomainsBrute",
			icon:path.join(__dirname,'./assets/img/logo.png'),
			autoHideMenuBar: true,
			webPreferences : {
				nodeIntegration: true,
				contextIsolation: false,	
				nodeIntegrationInSubFrames: true,
				webSecurity: false
			}
		})
		subDomainsBruteWindow.loadURL('file://' + path.join(__dirname,'./index.html'));
		remote.require("@electron/remote/main").enable(subDomainsBruteWindow.webContents);
		subDomainsBruteWindow.on('close',()=>{
			subDomainsBruteWindow = null;
		})
	});
	subDomainsBruteIpc.on('close',()=>{
		subDomainsBruteWindow.close()
	})
	subDomainsBruteIpc.on('execApi',(event,data)=>{
		event.sender.send(data.api,{
			target:data.api,
			info:goby[data.api](...data.val)
		})
	})
}

exports.activate = activate;