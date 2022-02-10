function activate(content) {
	const path = require('path');
	var themeWindow = null;
	let remote = top.require('@electron/remote');
	const themeIpc = remote.ipcMain;
	
	themeIpc.on('getTheme', function (event) {
		let theme = document.querySelector(':root').style.cssText;
		event.reply('getThemeRes', theme);
	})
	themeIpc.on('setColor',function(event,data){
		document.documentElement.style.setProperty(data.key, data.color);
	})
	themeIpc.on('getConfig',function(event,data){
		let config = goby.getConfiguration();
		event.reply('getConfig',{
			config
		})
	})

	themeIpc.on('getPath',function(event,data){
		remote.dialog.showOpenDialog(null, {
			properties: ['openFile'],
			filters:[
					{
							name:'image',
							extensions:[
								'jpg',
                'png',
                'gif',
                'jpeg',
                'webp',
                'ico'
							]
					}
			]
		}).then(res=>{
			event.reply('getPath',{
				...res,
				path:data
			})
		})
		
	})
	
	goby.registerCommand('ThemeDevelop', function () {
		if(themeWindow) return;
		
		const { BrowserWindow } = top.require('@electron/remote');
		
		themeWindow = new BrowserWindow({
			width          : 640,
			height         : 655,
			title          : "Custom theme",
			icon:path.join(__dirname,'./assets/img/icon.png'),
			autoHideMenuBar: true,
			resizable:false,
			webPreferences : {
				nodeIntegration: true,
				contextIsolation: false,	
				nodeIntegrationInSubFrames: true,
				webSecurity: false
			}
		})
		
		themeWindow.loadURL('file://' + path.join(__dirname,'./index.html'));
		remote.require("@electron/remote/main").enable(themeWindow.webContents);


		themeWindow.on('close',()=>{
			themeWindow = null;
			let configs = require(configPath);
			setTheme(configs['theme'][configs['curTheme']]); 
		})
	});
}

exports.activate = activate;
